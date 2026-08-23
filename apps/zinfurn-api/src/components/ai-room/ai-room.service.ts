import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PropertyService } from '../property/property.service';
import { GenerateRoomImageInput, RoomAnalysisInput } from '../../libs/dto/ai-room/ai-room.input';
import { GeneratedRoomImage, RoomAnalysisResult } from '../../libs/dto/ai-room/ai-room';
import { PropertiesInquiry } from '../../libs/dto/property/property.input';
import { PropertyCategory, PropertyColor, PropertyMaterial, PropertyType } from '../../libs/enums/property.enum';
import { Message } from '../../libs/enums/common_enum';
import { ShapeIntoMongoObjectId } from '../../libs/config';

const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
const ANALYZE_TIMEOUT_MS = 60000;
const IMAGE_TIMEOUT_MS = 90000;
const MATCHED_PRODUCTS_LIMIT = 8;
const CANDIDATE_POOL_LIMIT = 40;

interface GeminiRoomAnalysis {
	roomType: string;
	dominantColors: string[];
	suggestedMaterial?: string;
	requestedType?: string;
	searchKeyword?: string;
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
		const searchKeyword = raw.searchKeyword?.trim() || undefined;

		const matchedProducts = await this.findMatchingProducts(
			roomType,
			dominantColors,
			suggestedMaterial,
			requestedType,
			searchKeyword,
		);

		return {
			roomType,
			requestedType,
			dominantColors,
			suggestedMaterial,
			styleNotes: raw.styleNotes || '',
			matchedProducts,
		};
	}

	public async generateRoomImage(input: GenerateRoomImageInput): Promise<GeneratedRoomImage> {
		const anonymousMemberId = undefined as unknown as ObjectId;
		const propertyId = ShapeIntoMongoObjectId(input.productId);
		const product = await this.propertyService.getProperty(anonymousMemberId, propertyId);
		const productImagePath = product.propertyImages?.[0];
		if (!productImagePath) throw new BadRequestException(Message.NO_DATA_FOUND);

		const productImage = await this.readImageAsBase64(productImagePath);
		const generated = await this.runGeminiImageGeneration(
			input.roomImageBase64,
			input.mimeType || 'image/jpeg',
			productImage.base64,
			productImage.mimeType,
			product.propertyTitle,
		);
		if (!generated) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return generated;
	}

	private async readImageAsBase64(relativePath: string): Promise<{ base64: string; mimeType: string }> {
		const absolutePath = path.join(process.cwd(), relativePath);
		const buffer = await fs.readFile(absolutePath);
		const ext = path.extname(relativePath).toLowerCase();
		const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
		return { base64: buffer.toString('base64'), mimeType };
	}

	private async runGeminiImageGeneration(
		roomImageBase64: string,
		roomMimeType: string,
		productImageBase64: string,
		productMimeType: string,
		productTitle: string,
	): Promise<GeneratedRoomImage | null> {
		const key = process.env.GEMINI_API_KEY;
		if (!key) {
			this.logger.error('GEMINI_API_KEY topilmadi — rasm generatsiyasi ishlamaydi');
			throw new BadRequestException(Message.SOMETHING_WENT_WRONG);
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

		try {
			const res = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${key}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						contents: [
							{
								parts: [
									{
										text: `You are given two images: (1) a real room photo, (2) a product photo of a "${productTitle}" furniture piece.
Edit the FIRST image (the room) by realistically placing the furniture from the SECOND image into it — matching the room's perspective, scale, lighting and shadows so it looks like a real, unedited photo. Do not change anything else in the room. Output only the edited room photo.`,
									},
									{ inline_data: { mime_type: roomMimeType, data: roomImageBase64 } },
									{ inline_data: { mime_type: productMimeType, data: productImageBase64 } },
								],
							},
						],
						generationConfig: {
							responseModalities: ['IMAGE'],
						},
					}),
					signal: controller.signal,
				},
			);

			if (!res.ok) {
				const errText = await res.text();
				this.logger.error(`Gemini rasm generatsiyasi xato (${res.status}): ${errText.slice(0, 300)}`);
				return null;
			}

			const data: any = await res.json();
			const parts = data?.candidates?.[0]?.content?.parts || [];
			const imagePart = parts.find((p: any) => p.inlineData || p.inline_data);
			const inline = imagePart?.inlineData || imagePart?.inline_data;
			if (!inline?.data) {
				this.logger.error('Gemini javobida rasm topilmadi');
				return null;
			}
			return { imageBase64: inline.data, mimeType: inline.mimeType || inline.mime_type || 'image/png' };
		} catch (err: any) {
			this.logger.error(`Gemini rasm generatsiyasi bajarilmadi: ${err?.message || err}`);
			return null;
		} finally {
			clearTimeout(timer);
		}
	}

	private async findMatchingProducts(
		roomType?: PropertyCategory,
		colors?: PropertyColor[],
		material?: PropertyMaterial,
		requestedType?: PropertyType,
		searchKeyword?: string,
	) {
		// getProperties auth'siz chaqirilganda memberId undefined bo'lishi kutiladi — mavjud resolver'lar ham shunday ishlatadi.
		const anonymousMemberId = undefined as unknown as ObjectId;

		// Faqat SO'RALGAN MAHSULOT TURI (masalan TABLE, CHAIR, SOFA) qattiq filtr — chunki foydalanuvchi
		// aniq shu turni so'ragan. Xona kategoriyasi, rang, material — bularning barchasi ball (score)
		// sifatida ishlatiladi, qattiq AND filtr emas, aks holda bittasi mos kelmasa ham bo'sh qaytadi.
		// Tur berilmagan bo'lsa (umumiy so'rov), xona kategoriyasi bo'yicha qidiramiz.
		const candidateInquiry: PropertiesInquiry = {
			page: 1,
			limit: CANDIDATE_POOL_LIMIT,
			search: {
				typeList: requestedType ? [requestedType] : undefined,
				categoryList: !requestedType && roomType ? [roomType] : undefined,
			},
		};
		const candidateResult = await this.propertyService.getProperties(anonymousMemberId, candidateInquiry);
		const candidates = candidateResult?.list ?? [];
		if (!candidates.length) return [];

		const keywordWords = (searchKeyword ?? '').toLowerCase().split(/\s+/).filter(Boolean);

		const scored = candidates.map((product) => {
			let score = 0;
			const title = (product.propertyTitle ?? '').toLowerCase();
			for (const word of keywordWords) if (title.includes(word)) score += 3;
			if (roomType && product.propertyCategory === roomType) score += 2;
			if (material && product.propertyMaterial === material) score += 2;
			if (colors && colors.includes(product.propertyColor)) score += 1;
			return { product, score };
		});

		scored.sort((a, b) => b.score - a.score);
		return scored.slice(0, MATCHED_PRODUCTS_LIMIT).map((s) => s.product);
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
5. searchKeyword — a short English product-title keyword (2-4 words) that best describes the SPECIFIC item the user wants, to search our catalog by title. This must disambiguate within a broad category — e.g. if the user wants a work/study desk, use "desk" or "office table", NOT "pool table" or "billiard table" even though both are "TABLE" type. Leave empty if no request text is given.
6. styleNotes — one short sentence (in Uzbek) describing the room's style, to show the user.

${userRequest ? `User's request (may be in Uzbek): "${userRequest}"` : 'User did not provide a request text — leave requestedType and searchKeyword empty.'}

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
				searchKeyword: { type: 'STRING' },
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
