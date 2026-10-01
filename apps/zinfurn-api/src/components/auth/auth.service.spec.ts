import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MemberStatus } from '../../libs/enums/member.enum';

/**
 * Token juftligi xavfsizlik testlari:
 *  - access 1h, sessiya mutlaq 10h va tokenType claim'lari
 *  - refresh rotation sessiyani UZAYTIRMASLIGI (absolute cap)
 *  - refresh tokenni access sifatida ishlatib BO'LMASLIGI
 *  - bloklangan member refresh qilolmasligi
 */
describe('AuthService (token pair)', () => {
	const jwt = new JwtService({ secret: 'test-secret' });
	const fakeMember: any = { _id: '507f1f77bcf86cd799439011', memberNick: 'tester', memberStatus: MemberStatus.ACTIVE };

	const SESSION_MAX_AGE_SEC = 10 * 60 * 60;
	const nowSec = () => Math.floor(Date.now() / 1000);

	const makeService = (memberModel: any = {}) => new AuthService(jwt, memberModel);

	it('createToken 1 soatlik access token beradi (tokenType=access, sid bilan)', async () => {
		const service = makeService();
		const token = await service.createToken(fakeMember);
		const claims: any = jwt.decode(token);
		expect(claims.tokenType).toBe('access');
		expect(claims.exp - claims.iat).toBe(60 * 60);
		expect(claims.sid).toBeGreaterThan(0);
	});

	it('createToken: sessiya qoldig\'i 1 soatdan kam bo\'lsa access shu qoldiq bilan cheklanadi', async () => {
		const service = makeService();
		// Sessiya 9.5 soat oldin boshlangan — 30 daqiqa qoldi
		const sid = nowSec() - (SESSION_MAX_AGE_SEC - 30 * 60);
		const token = await service.createToken(fakeMember, sid);
		const claims: any = jwt.decode(token);
		expect(claims.exp - claims.iat).toBeLessThanOrEqual(30 * 60);
		expect(claims.exp - claims.iat).toBeGreaterThan(29 * 60);
	});

	it('createRefreshToken sessiya qoldig\'iga teng muddat beradi (tokenType=refresh, minimal payload)', async () => {
		const service = makeService();
		const token = await service.createRefreshToken(fakeMember);
		const claims: any = jwt.decode(token);
		expect(claims.tokenType).toBe('refresh');
		expect(claims.exp - claims.iat).toBe(SESSION_MAX_AGE_SEC);
		expect(claims.memberNick).toBeUndefined(); // profil ma'lumotlari refresh'da bo'lmasin
	});

	it('createRefreshToken: sessiya tugagan bo\'lsa token bermaydi', async () => {
		const service = makeService();
		const expiredSid = nowSec() - SESSION_MAX_AGE_SEC - 1;
		await expect(service.createRefreshToken(fakeMember, expiredSid)).rejects.toThrow('Session expired');
	});

	it('verifyToken refresh tokenni RAD ETADI', async () => {
		const service = makeService();
		const refresh = await service.createRefreshToken(fakeMember);
		await expect(service.verifyToken(refresh)).rejects.toThrow('Refresh token cannot be used');
	});

	it('verifyToken access tokenni qabul qiladi', async () => {
		const service = makeService();
		const access = await service.createToken(fakeMember);
		const member = await service.verifyToken(access);
		expect(member.memberNick).toBe('tester');
	});

	it("verifyToken legacy (tokenType'siz) tokenni qabul qiladi — eski sessiyalar buzilmaydi", async () => {
		const service = makeService();
		const legacy = await jwt.signAsync({ _id: fakeMember._id, memberNick: 'old' }, { expiresIn: '30d' });
		const member = await service.verifyToken(legacy);
		expect(member.memberNick).toBe('old');
	});

	it('refreshTokens: yaroqli refresh evaziga yangi juftlik', async () => {
		const memberModel = {
			findById: () => ({ exec: async () => fakeMember }),
			updateOne: () => ({ exec: async () => undefined }),
		};
		const service = makeService(memberModel);
		const refresh = await service.createRefreshToken(fakeMember);
		const result = await service.refreshTokens(refresh);
		expect(result.token).toBeTruthy();
		expect(result.refresh).toBeTruthy();
		expect((jwt.decode(result.token) as any).tokenType).toBe('access');
	});

	it('refreshTokens: rotation sessiyani UZAYTIRMAYDI — sid saqlanadi, muddat qisqaradi', async () => {
		const memberModel = {
			findById: () => ({ exec: async () => fakeMember }),
			updateOne: () => ({ exec: async () => undefined }),
		};
		const service = makeService(memberModel);

		// Sessiya 6 soat oldin boshlangan — 4 soat qoldi
		const sid = nowSec() - 6 * 60 * 60;
		const oldRefresh = await service.createRefreshToken(fakeMember, sid);
		const result = await service.refreshTokens(oldRefresh);

		const newClaims: any = jwt.decode(result.refresh);
		expect(newClaims.sid).toBe(sid); // sessiya boshlanishi o'zgarmadi
		expect(newClaims.exp - newClaims.iat).toBeLessThanOrEqual(4 * 60 * 60);
		expect(newClaims.exp - newClaims.iat).toBeGreaterThan(4 * 60 * 60 - 60);
	});

	it('refreshTokens: 10 soatlik sessiya tugagach RAD etiladi', async () => {
		const memberModel = { findById: () => ({ exec: async () => fakeMember }) };
		const service = makeService(memberModel);

		// Sid allaqachon eskirgan, lekin JWT exp'i hali yaroqli (uzoq muddatli qo'lda imzolangan token)
		const staleSid = nowSec() - SESSION_MAX_AGE_SEC - 60;
		const staleRefresh = await jwt.signAsync(
			{ _id: fakeMember._id, tokenType: 'refresh', sid: staleSid },
			{ expiresIn: '30d' },
		);
		await expect(service.refreshTokens(staleRefresh)).rejects.toThrow('Session expired');
	});

	it("refreshTokens: sid'siz eski refresh token RAD etiladi", async () => {
		const memberModel = { findById: () => ({ exec: async () => fakeMember }) };
		const service = makeService(memberModel);
		const legacyRefresh = await jwt.signAsync({ _id: fakeMember._id, tokenType: 'refresh' }, { expiresIn: '30d' });
		await expect(service.refreshTokens(legacyRefresh)).rejects.toThrow('Session expired');
	});

	it('refreshTokens: bloklangan member RAD etiladi', async () => {
		const blocked = { ...fakeMember, memberStatus: MemberStatus.BLOCK };
		const memberModel = { findById: () => ({ exec: async () => blocked }) };
		const service = makeService(memberModel);
		const refresh = await service.createRefreshToken(fakeMember);
		await expect(service.refreshTokens(refresh)).rejects.toThrow('not active');
	});

	it("refreshTokens: access token bilan refresh qilib BO'LMAYDI", async () => {
		const service = makeService({ findById: () => ({ exec: async () => fakeMember }) });
		const access = await service.createToken(fakeMember);
		await expect(service.refreshTokens(access)).rejects.toThrow('Invalid refresh token');
	});


	describe('app sessiyasi (sirpanuvchi)', () => {
		const DAY = 24 * 60 * 60;
		/** memberSessions'ni xotirada saqlaydigan minimal mock */
		const makeAppModel = () => {
			let sessions: { sid: number; jti: string; prevJti?: string; rotatedAt: Date }[] = [];
			return {
				get sessions() {
					return sessions;
				},
				updateOne: (_filter: any, update: any) => ({
					exec: async () => {
						if (update.$pull) {
							const cond = update.$pull.memberSessions;
							const sids = cond.$or ? cond.$or.filter((c: any) => 'sid' in c).map((c: any) => c.sid) : [cond.sid];
							sessions = sessions.filter((x) => !sids.includes(x.sid));
						}
						if (update.$push) sessions.push(...update.$push.memberSessions.$each);
						if (update.$set) sessions = [];
					},
				}),
				exists: (filter: any) => ({
					exec: async () => {
						const m = filter.memberSessions.$elemMatch;
						const [byJti, byPrev] = m.$or;
						const ok = sessions.some(
							(x) =>
								x.sid === m.sid &&
								(x.jti === byJti.jti || (x.prevJti === byPrev.prevJti && x.rotatedAt > byPrev.rotatedAt.$gt)),
						);
						return ok ? { _id: fakeMember._id } : null;
					},
				}),
				findById: () => ({ exec: async () => fakeMember }),
			};
		};

		it('app refresh 30 kunlik, client=app va jti bilan', async () => {
			const service = makeService(makeAppModel());
			const { token, refresh } = await service.createTokenPair(fakeMember, undefined, 'app');
			const r: any = jwt.decode(refresh);
			expect(r.client).toBe('app');
			expect(r.jti).toBeTruthy();
			expect(r.exp - r.iat).toBe(30 * DAY);
			expect((jwt.decode(token) as any).exp - (jwt.decode(token) as any).iat).toBe(60 * 60);
		});

		it('app refresh har rotation\'da 30 kunga uzayadi, lekin 90 kundan oshmaydi', async () => {
			const service = makeService(makeAppModel());
			const oldSid = nowSec() - 80 * DAY;
			const { refresh } = await service.createTokenPair(fakeMember, oldSid, 'app');
			const result = await service.refreshTokens(refresh);
			const r: any = jwt.decode(result.refresh);
			expect(r.sid).toBe(oldSid);
			expect(r.exp - r.iat).toBeLessThanOrEqual(10 * DAY);
			expect(r.exp - r.iat).toBeGreaterThan(10 * DAY - 60);
		});

		it('app: 90 kun o\'tgach refresh RAD etiladi', async () => {
			const service = makeService(makeAppModel());
			const stale = await jwt.signAsync(
				{ _id: fakeMember._id, tokenType: 'refresh', sid: nowSec() - 91 * DAY, client: 'app', jti: 'x' },
				{ expiresIn: DAY },
			);
			await expect(service.refreshTokens(stale)).rejects.toThrow('Session expired');
		});

		it('app: oldingi refresh grace ichida qabul qilinadi (javob yo\'qolgan holat)', async () => {
			const service = makeService(makeAppModel());
			const { refresh } = await service.createTokenPair(fakeMember, undefined, 'app');
			await service.refreshTokens(refresh);
			await expect(service.refreshTokens(refresh)).resolves.toBeTruthy();
		});

		it('app: grace\'dan keyin eski refresh qayta ishlatilsa sessiya yopiladi', async () => {
			const model = makeAppModel();
			const service = makeService(model);
			const { refresh } = await service.createTokenPair(fakeMember, undefined, 'app');
			const next = await service.refreshTokens(refresh);
			model.sessions.forEach((x) => (x.rotatedAt = new Date(Date.now() - 5 * 60 * 1000)));
			await expect(service.refreshTokens(refresh)).rejects.toThrow('Session revoked');
			// o'g'irlik belgisi — yangi token ham endi ishlamaydi
			await expect(service.refreshTokens(next.refresh)).rejects.toThrow('Session revoked');
		});

		it('app: logout va parol almashishi sessiyani bekor qiladi', async () => {
			const model = makeAppModel();
			const service = makeService(model);
			const a = await service.createTokenPair(fakeMember, nowSec() - 10, 'app');
			const b = await service.createTokenPair(fakeMember, nowSec() - 20, 'app');
			await service.logoutSession(a.refresh);
			await expect(service.refreshTokens(a.refresh)).rejects.toThrow('Session revoked');
			await service.revokeAllSessions(fakeMember._id);
			await expect(service.refreshTokens(b.refresh)).rejects.toThrow('Session revoked');
		});

		it('web: refresh jti bilan bazaga yoziladi, logout\'dan keyin RAD etiladi', async () => {
			const model = makeAppModel();
			const service = makeService(model);
			const { refresh } = await service.createTokenPair(fakeMember);
			expect((jwt.decode(refresh) as any).jti).toBeTruthy();
			expect(model.sessions).toHaveLength(1);
			await service.logoutSession(refresh);
			await expect(service.refreshTokens(refresh)).rejects.toThrow('Session revoked');
		});

		it('web: member bloklanganda (revokeAllSessions) refresh RAD etiladi', async () => {
			const model = makeAppModel();
			const service = makeService(model);
			const { refresh } = await service.createTokenPair(fakeMember);
			await service.revokeAllSessions(fakeMember._id);
			await expect(service.refreshTokens(refresh)).rejects.toThrow('Session revoked');
		});

		it('web: rotation 10 soatlik mutlaq chegarani saqlaydi', async () => {
			const service = makeService(makeAppModel());
			const sid = nowSec() - 6 * 60 * 60;
			const { refresh } = await service.createTokenPair(fakeMember, sid);
			const r: any = jwt.decode((await service.refreshTokens(refresh)).refresh);
			expect(r.sid).toBe(sid);
			expect(r.exp - r.iat).toBeLessThanOrEqual(4 * 60 * 60);
		});
	});
});
