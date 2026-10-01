import { BadRequestException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { ReviewService } from './review.service';
import { Review } from '../../libs/dto/review/review';
import { CreateReviewInput } from '../../libs/dto/review/review.input';
import { OrderStatus } from '../../libs/enums/order.enum';

/**
 * Sharh testlari — faqat haqiqiy xaridor yozadi:
 *  - buyurtma CONFIRMED va mahsulot shu buyurtma tarkibida bo'lishi shart
 *  - bitta buyurtma pozitsiyasiga bitta sharh
 *  - o'rtacha reyting qayta hisoblanadi
 */
describe('ReviewService.createReview', () => {
	const MEMBER_ID = 'member1' as unknown as ObjectId;
	const input = { orderId: 'o1', propertyId: 'p1', reviewRating: 4, reviewContent: 'Good' } as unknown as CreateReviewInput;

	const makeService = (order: object | null, existing: object | null = null, avg = 4.26) => {
		const orderFindOne = jest.fn(async (_filter: object) => order);
		const create = jest.fn(async (doc: object) => ({ _id: 'r1', ...doc }));
		const reviewModel = {
			findOne: jest.fn(async () => existing),
			create,
			aggregate: jest.fn(() => ({ exec: async () => [{ avg }] })),
		} as unknown as Model<Review>;
		const propertyUpdate = jest.fn(async (_id: string, _update: object) => undefined);
		const service = new ReviewService(
			reviewModel,
			{ findOne: orderFindOne } as unknown as Model<unknown>,
			{ findByIdAndUpdate: propertyUpdate } as unknown as Model<unknown>,
		);
		return { service, orderFindOne, create, propertyUpdate };
	};

	it("buyurtma tarkibidagi mahsulot va CONFIRMED status talab qilinadi", async () => {
		const { service, orderFindOne } = makeService(null);
		await expect(service.createReview(MEMBER_ID, input)).rejects.toThrow('Order must be confirmed');
		expect(orderFindOne.mock.calls[0][0]).toEqual({
			_id: 'o1',
			memberId: MEMBER_ID,
			orderStatus: OrderStatus.CONFIRMED,
			'orderItems.propertyId': 'p1',
		});
	});

	it('takroriy sharh rad etiladi', async () => {
		const { service, create } = makeService({ _id: 'o1' }, { _id: 'r0' });
		await expect(service.createReview(MEMBER_ID, input)).rejects.toBeInstanceOf(BadRequestException);
		expect(create).not.toHaveBeenCalled();
	});

	it("sharh yaratiladi, reyting bir xonagacha yaxlitlanib mahsulotga yoziladi", async () => {
		const { service, create, propertyUpdate } = makeService({ _id: 'o1' });
		const review = await service.createReview(MEMBER_ID, input);
		expect(review).toMatchObject({ _id: 'r1', memberId: MEMBER_ID });
		expect(create).toHaveBeenCalled();
		expect(propertyUpdate).toHaveBeenCalledWith('p1', { $inc: { propertyReviews: 1 }, propertyRating: 4.3 });
	});
});
