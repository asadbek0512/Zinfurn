import { Injectable, Logger } from '@nestjs/common';

/**
 * Product nom/description'ni 5 tilga tarjima qiladi (Gemini).
 * Brand/model nomlari o'z holicha qoladi, faqat tarjima qilsa bo'ladigan so'zlar tarjima qilinadi.
 * MUHIM: bu xizmat xato bersa ham chaqiruvchi joy buzilmasligi kerak (non-blocking ishlatiladi).
 */

export const SUPPORTED_LOCALES = ['uz', 'en', 'ru', 'kr', 'ar'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALE_NAMES: Record<SupportedLocale, string> = {
	uz: 'Uzbek',
	en: 'English',
	ru: 'Russian',
	kr: 'Korean',
	ar: 'Arabic',
};

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_TIMEOUT_MS = 15000;

export interface I18nText {
	title: string;
	desc: string;
}
export type PropertyTranslationsMap = Partial<Record<SupportedLocale, I18nText>>;

@Injectable()
export class TranslationService {
	private readonly logger = new Logger(TranslationService.name);

	private buildPrompt(title: string, desc: string): string {
		const langs = SUPPORTED_LOCALES.map((k) => `${LOCALE_NAMES[k]} (${k})`).join(', ');
		return `You are a translator for a furniture e-commerce store.
Translate the product TITLE and DESCRIPTION into these languages: ${langs}.

STRICT RULES:
- Keep brand names, model names and proper nouns UNCHANGED (do NOT translate them). Translate ONLY the common/descriptive words.
  Example: "Alhambra Pool Table" -> uz: "Alhambra bilyard stoli", ru: "Бильярдный стол Alhambra".
- Keep numbers, units and measurements as-is.
- Natural, concise translation. Do not add words that are not in the source.
- If description is empty, return empty string for desc.

TITLE: ${title}
DESCRIPTION: ${desc || ''}`;
	}

	private buildResponseSchema() {
		const item = {
			type: 'OBJECT',
			properties: { title: { type: 'STRING' }, desc: { type: 'STRING' } },
			required: ['title', 'desc'],
		};
		return {
			type: 'OBJECT',
			properties: Object.fromEntries(SUPPORTED_LOCALES.map((k) => [k, item])),
			required: [...SUPPORTED_LOCALES],
		};
	}

	private buildArticlePrompt(title: string, content: string): string {
		const langs = SUPPORTED_LOCALES.map((k) => `${LOCALE_NAMES[k]} (${k})`).join(', ');
		return `You are a translator for a furniture blog / community.
Translate the article TITLE and CONTENT into these languages: ${langs}.

STRICT RULES:
- Keep brand names, product/model names and proper nouns UNCHANGED. Translate only the readable text.
- Keep the meaning faithful and natural. Do not summarize or add content.
- Keep numbers as-is.
- If content is empty, return empty string for desc.

TITLE: ${title}
CONTENT: ${content || ''}`;
	}

	/** Property nom/desc tarjimasi. Xato bo'lsa null (throw qilmaydi). */
	public async translateProperty(title: string, desc?: string): Promise<PropertyTranslationsMap | null> {
		if (!title || !title.trim()) return null;
		return this.run(this.buildPrompt(title, desc || ''));
	}

	/** Article nom/content tarjimasi. Xato bo'lsa null. */
	public async translateArticle(title: string, content?: string): Promise<PropertyTranslationsMap | null> {
		if (!title || !title.trim()) return null;
		return this.run(this.buildArticlePrompt(title, content || ''));
	}

	/** Umumiy Gemini chaqiruv + parse. Xato bo'lsa null. */
	private async run(prompt: string): Promise<PropertyTranslationsMap | null> {
		const key = process.env.GEMINI_API_KEY;
		if (!key) {
			this.logger.warn('GEMINI_API_KEY topilmadi — tarjima o\'tkazib yuborildi');
			return null;
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
		try {
			const res = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						contents: [{ role: 'user', parts: [{ text: prompt }] }],
						generationConfig: {
							responseMimeType: 'application/json',
							responseSchema: this.buildResponseSchema(),
							temperature: 0.2,
						},
					}),
					signal: controller.signal,
				},
			);
			if (!res.ok) {
				const errText = await res.text();
				this.logger.warn(`Gemini tarjima xato (${res.status}): ${errText.slice(0, 200)}`);
				return null;
			}
			const data: any = await res.json();
			const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (!raw) return null;
			const parsed = JSON.parse(raw) as PropertyTranslationsMap;
			// Faqat ruxsat etilgan tillarni qoldiramiz
			const clean: PropertyTranslationsMap = {};
			for (const loc of SUPPORTED_LOCALES) {
				if (parsed[loc]?.title) clean[loc] = { title: parsed[loc]!.title, desc: parsed[loc]!.desc || '' };
			}
			return Object.keys(clean).length ? clean : null;
		} catch (err: any) {
			this.logger.warn(`Tarjima bajarilmadi: ${err?.message || err}`);
			return null;
		} finally {
			clearTimeout(timer);
		}
	}
}
