import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { PropertyService } from '../property/property.service';
import { RoomAnalysisInput } from '../../libs/dto/ai-room/ai-room.input';
import { RoomAnalysisResult } from '../../libs/dto/ai-room/ai-room';
import { PropertiesInquiry } from '../../libs/dto/property/property.input';
import { PropertyCategory, PropertyColor, PropertyMaterial, PropertyType } from '../../libs/enums/property.enum';
import { Message } from '../../libs/enums/common_enum';

const GEMINI_MODEL = 'gemini-3.6-flash';
const ANALYZE_TIMEOUT_MS = 20000;
const MATCHED_PRODUCTS_LIMIT = 8;

interface GeminiRoomAnalysis {
	roomType: string;
	dominantColors: string[];
	suggestedMaterial?: string;
	requestedType?: string;
	styleNotes: string;
}

@Injectable()
export class AiRoomService {
	private readonly logger = new Logger(AiRoomService.name);

	constructor(private readonly propertyService: PropertyService) {}

	public async analyzeRoom(input: RoomAnalysisInput): Promise<RoomAnalysisResult> {
		const raw = await this.runGeminiVision(input);
		if (!raw) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);

		const roomType = this.cleanEnumValue(raw.roomType, PropertyCategory);
		const dominantColors = (raw.dominantColors || [])
			.map((c) => this.cleanEnumValue(c, PropertyColor))
			.filter((c): c is PropertyColor => !!c);
		const suggestedMaterial = this.cleanEnumValue(raw.suggestedMaterial, PropertyMaterial);
		const requestedType = this.cleanEnumValue(raw.requestedType, PropertyType);

		const matchedProducts = await this.findMatchingProducts(roomType, dominantColors, suggestedMaterial, requestedType);

		return {
			roomType,
			requestedType,
			dominantColors,
			suggestedMaterial,
			styleNotes: raw.styleNotes || '',
			matchedProducts,
		};
	}

	private async findMatchingProducts(
		roomType?: PropertyCategory,
		colors?: PropertyColor[],
		material?: PropertyMaterial,
		requestedType?: PropertyType,
	) {
		// getProperties auth'siz chaqirilganda memberId undefined bo'lishi kutiladi — mavjud resolver'lar ham shunday ishlatadi.
		const anonymousMemberId = undefined as unknown as ObjectId;
		const inquiry: PropertiesInquiry = {
			page: 1,
			limit: MATCHED_PRODUCTS_LIMIT,
			search: {
				categoryList: roomType ? [roomType] : undefined,
				colorList: colors && colors.length ? colors : undefined,
				materialList: material ? [material] : undefined,
				typeList: requestedType ? [requestedType] : undefined,
			},
		};
		const result = await this.propertyService.getProperties(anonymousMemberId, inquiry);
		return result?.list ?? [];
	}

	private cleanEnumValue<T extends string>(value: string | undefined, enumObj: Record<string, T>): T | undefined {
		if (!value) return undefined;
		const match = Object.values(enumObj).find((v) => v === value.toUpperCase());
		return match;
	}

	private buildPrompt(userRequest?: string): string {
		return `You are a furniture e-commerce room analysis assistant.
Look at the room photo and determine:
1. roomType — the single best-fitting category for this room.
2. dominantColors — the 2-3 dominant wall/floor/decor colors in the room.
3. suggestedMaterial — the furniture material that would best match this room's style (optional).
4. requestedType — the furniture type the user is asking for, extracted from their request text below (optional, only if a request text is given and it clearly names a furniture type).
5. styleNotes — one short sentence (in Uzbek) describing the room's style, to show the user.

${userRequest ? `User's request (may be in Uzbek): "${userRequest}"` : 'User did not provide a request text — leave requestedType empty.'}

Respond ONLY with values from the allowed lists below.
roomType allowed values: ${Object.values(PropertyCategory).join(', ')}
dominantColors allowed values: ${Object.values(PropertyColor).join(', ')}
suggestedMaterial allowed values: ${Object.values(PropertyMaterial).join(', ')}
requestedType allowed values: ${Object.values(PropertyType).join(', ')}`;
	}

	private buildResponseSchema() {
		return {
			type: 'OBJECT',
			properties: {
				roomType: { type: 'STRING', enum: Object.values(PropertyCategory) },
				dominantColors: {
					type: 'ARRAY',
					items: { type: 'STRING', enum: Object.values(PropertyColor) },
				},
				suggestedMaterial: { type: 'STRING', enum: Object.values(PropertyMaterial) },
				requestedType: { type: 'STRING', enum: Object.values(PropertyType) },
				styleNotes: { type: 'STRING' },
			},
			required: ['roomType', 'dominantColors', 'styleNotes'],
		};
	}

	private async runGeminiVision(input: RoomAnalysisInput): Promise<GeminiRoomAnalysis | null> {
		const key = process.env.GEMINI_API_KEY;
		if (!key) {
			this.logger.error('GEMINI_API_KEY topilmadi — xona tahlili ishlamaydi');
			throw new BadRequestException(Message.SOMETHING_WENT_WRONG);
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

		try {
			const res = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						contents: [
							{
								parts: [
									{ text: this.buildPrompt(input.userRequest) },
									{
										inline_data: {
											mime_type: input.mimeType || 'image/jpeg',
											data: input.imageBase64,
										},
									},
								],
							},
						],
						generationConfig: {
							response_mime_type: 'application/json',
							response_schema: this.buildResponseSchema(),
							temperature: 0.2,
						},
					}),
					signal: controller.signal,
				},
			);

			if (!res.ok) {
				const errText = await res.text();
				this.logger.error(`Gemini xona tahlili xato (${res.status}): ${errText.slice(0, 200)}`);
				return null;
			}

			const data: any = await res.json();
			const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (!raw) return null;
			return JSON.parse(raw) as GeminiRoomAnalysis;
		} catch (err: any) {
			this.logger.error(`Gemini xona tahlili bajarilmadi: ${err?.message || err}`);
			return null;
		} finally {
			clearTimeout(timer);
		}
	}
}
