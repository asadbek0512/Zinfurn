import { BadRequestException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from './member.service';
import { Member } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';

/**
 * Akkauntni o'chirish (store talabi) — shaxsiy ma'lumot qolmasligi va login yo'llari yopilishi shart
 */
describe('MemberService.deleteMyAccount', () => {
	const MEMBER_ID = '650000000000000000000001' as unknown as ObjectId;

	const makeService = (modifiedCount: number) => {
		const memberUpdate = jest.fn(() => ({ exec: async () => ({ modifiedCount }) }));
		const propertyUpdate = jest.fn(() => ({ exec: async () => ({}) }));
		const repairUpdate = jest.fn(() => ({ exec: async () => ({}) }));
		const service = new MemberService(
			{ updateOne: memberUpdate } as unknown as Model<Member>,
			{} as unknown as Model<never>,
			{ updateMany: propertyUpdate } as unknown as Model<unknown>,
			{ updateMany: repairUpdate } as unknown as Model<unknown>,
			{} as AuthService,
			{} as ViewService,
			{} as LikeService,
		);
		return { service, memberUpdate, propertyUpdate, repairUpdate };
	};

	it('shaxsiy ma\'lumot tozalanadi, login identifikatorlari va sessiyalar o\'chiriladi', async () => {
		const { service, memberUpdate } = makeService(1);
		await expect(service.deleteMyAccount(MEMBER_ID)).resolves.toBe(true);

		const [filter, update] = memberUpdate.mock.calls[0] as unknown as [Record<string, unknown>, Record<string, Record<string, unknown>>];
		expect(filter).toEqual({ _id: MEMBER_ID, memberStatus: { $ne: MemberStatus.DELETE } });
		expect(update.$set.memberStatus).toBe(MemberStatus.DELETE);
		expect(update.$set.memberNick).toBe(`deleted_${MEMBER_ID}`);
		expect(update.$set.memberSessions).toEqual([]);
		expect(Object.keys(update.$unset)).toEqual(
			expect.arrayContaining(['memberPhone', 'memberEmail', 'memberPassword', 'memberTelegramId', 'memberGoogleId']),
		);
	});

	it('e\'lonlar yashiriladi', async () => {
		const { service, propertyUpdate, repairUpdate } = makeService(1);
		await service.deleteMyAccount(MEMBER_ID);
		const [propertyFilter, propertySet] = propertyUpdate.mock.calls[0] as unknown as [Record<string, unknown>, Record<string, unknown>];
		expect(propertyFilter.memberId).toBe(MEMBER_ID);
		expect(propertySet.propertyStatus).toBe(PropertyStatus.DELETE);
		expect(repairUpdate).toHaveBeenCalledTimes(1);
	});

	it('akkaunt topilmasa yoki allaqachon o\'chirilgan bo\'lsa xato, e\'lonlarga tegilmaydi', async () => {
		const { service, propertyUpdate } = makeService(0);
		await expect(service.deleteMyAccount(MEMBER_ID)).rejects.toBeInstanceOf(BadRequestException);
		expect(propertyUpdate).not.toHaveBeenCalled();
	});
});

/** App Store 1.2 (UGC): foydalanuvchi boshqa a'zoni bloklay olishi shart */
describe('MemberService.blockMember', () => {
	const ME = '650000000000000000000001' as unknown as ObjectId;
	const TARGET = '650000000000000000000002' as unknown as ObjectId;

	const makeService = (targetExists: boolean) => {
		const memberUpdate = jest.fn(() => ({ exec: async () => ({}) }));
		const followDelete = jest.fn(() => ({ exec: async () => ({}) }));
		const service = new MemberService(
			{ updateOne: memberUpdate, exists: () => ({ exec: async () => (targetExists ? { _id: TARGET } : null) }) } as unknown as Model<Member>,
			{ deleteOne: followDelete } as unknown as Model<never>,
			{} as Model<unknown>,
			{} as Model<unknown>,
			{} as AuthService,
			{} as ViewService,
			{} as LikeService,
		);
		return { service, memberUpdate, followDelete };
	};

	it("bloklangan a'zo ro'yxatga qo'shiladi va obuna uziladi", async () => {
		const { service, memberUpdate, followDelete } = makeService(true);
		await expect(service.blockMember(ME, TARGET)).resolves.toBe(true);
		expect(memberUpdate).toHaveBeenCalledWith({ _id: ME }, { $addToSet: { memberBlocked: TARGET } });
		expect(followDelete).toHaveBeenCalledWith({ followingId: TARGET, followerId: ME });
	});

	it("o'zini bloklash va mavjud bo'lmagan a'zoni bloklash rad etiladi", async () => {
		const { service, memberUpdate } = makeService(false);
		await expect(service.blockMember(ME, ME)).rejects.toBeInstanceOf(BadRequestException);
		await expect(service.blockMember(ME, TARGET)).rejects.toBeInstanceOf(BadRequestException);
		expect(memberUpdate).not.toHaveBeenCalled();
	});
});
