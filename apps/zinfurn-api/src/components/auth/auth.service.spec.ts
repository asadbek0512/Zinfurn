import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { MemberStatus } from '../../libs/enums/member.enum';

/**
 * Token juftligi xavfsizlik testlari:
 *  - access 1h / refresh 30d va tokenType claim'lari
 *  - refresh tokenni access sifatida ishlatib BO'LMASLIGI
 *  - bloklangan member refresh qilolmasligi
 */
describe('AuthService (token pair)', () => {
	const jwt = new JwtService({ secret: 'test-secret' });
	const fakeMember: any = { _id: '507f1f77bcf86cd799439011', memberNick: 'tester', memberStatus: MemberStatus.ACTIVE };

	const makeService = (memberModel: any = {}) => new AuthService(jwt, memberModel);

	it('createToken 1 soatlik access token beradi (tokenType=access)', async () => {
		const service = makeService();
		const token = await service.createToken(fakeMember);
		const claims: any = jwt.decode(token);
		expect(claims.tokenType).toBe('access');
		expect(claims.exp - claims.iat).toBe(60 * 60);
	});

	it('createRefreshToken 30 kunlik refresh beradi (tokenType=refresh, minimal payload)', async () => {
		const service = makeService();
		const token = await service.createRefreshToken(fakeMember);
		const claims: any = jwt.decode(token);
		expect(claims.tokenType).toBe('refresh');
		expect(claims.exp - claims.iat).toBe(30 * 24 * 60 * 60);
		expect(claims.memberNick).toBeUndefined(); // profil ma'lumotlari refresh'da bo'lmasin
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
