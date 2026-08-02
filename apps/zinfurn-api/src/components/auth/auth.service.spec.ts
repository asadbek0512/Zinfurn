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
		};
		const service = makeService(memberModel);
		const refresh = await service.createRefreshToken(fakeMember);
		const result = await service.refreshTokens(refresh);
		expect(result.token).toBeTruthy();
		expect(result.refresh).toBeTruthy();
		expect((jwt.decode(result.token) as any).tokenType).toBe('access');
	});

	it('refreshTokens: rotation sessiyani UZAYTIRMAYDI — sid saqlanadi, muddat qisqaradi', async () => {
		const memberModel = { findById: () => ({ exec: async () => fakeMember }) };
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
});
