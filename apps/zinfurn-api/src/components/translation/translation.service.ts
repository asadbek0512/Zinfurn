import { Injectable, Logger } from '@nestjs/common';

/**
 * Product nom/description'ni 5 tilga tarjima qiladi.
 * ASOSIY: Groq (llama-3.3-70b, bepul limiti baland, tez) — GROQ_API_KEY bo'lsa.
 * FALLBACK: Gemini (bepul kunlik limiti juda past) — Groq yo'q/yiqilsa.
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

// llama-3.3-70b-versatile 2026-06-17 da Groq'da deprecate qilindi (free/dev tier) —
// decommission bo'lgach `model_decommissioned` xato beradi. Groq tavsiyasi bo'yicha gpt-oss-120b.
const GROQ_MODEL = 'openai/gpt-oss-120b';
const GEMINI_MODEL = 'gemini-2.5-flash';
const TRANSLATE_TIMEOUT_MS = 15000;

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

	/** Tarjima: avval Groq, bo'lmasa Gemini. Xato bo'lsa null. */
	private async run(prompt: string): Promise<PropertyTranslationsMap | null> {
		if (process.env.GROQ_API_KEY) {
			const viaGroq = await this.runGroq(prompt);
			if (viaGroq) return viaGroq;
			this.logger.warn('Groq tarjima bermadi — Gemini fallback urinilyapti');
		}
		return this.runGemini(prompt);
	}

	/** Groq (OpenAI-uslub chat API, JSON mode). Xato bo'lsa null. */
	private async runGroq(prompt: string): Promise<PropertyTranslationsMap | null> {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
		try {
			const jsonShape = SUPPORTED_LOCALES.map((k) => `"${k}": {"title": "...", "desc": "..."}`).join(', ');
			const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
				},
				body: JSON.stringify({
					model: GROQ_MODEL,
					messages: [
						{ role: 'system', content: `Respond ONLY with a JSON object exactly in this shape: {${jsonShape}}` },
						{ role: 'user', content: prompt },
					],
					response_format: { type: 'json_object' },
					temperature: 0.2,
				}),
				signal: controller.signal,
			});
			if (!res.ok) {
				const errText = await res.text();
				this.logger.warn(`Groq tarjima xato (${res.status}): ${errText.slice(0, 200)}`);
				return null;
			}
			const data: any = await res.json();
			const raw = data?.choices?.[0]?.message?.content;
			if (!raw) return null;
			return this.cleanParsed(JSON.parse(raw));
		} catch (err: any) {
			this.logger.warn(`Groq tarjima bajarilmadi: ${err?.message || err}`);
			return null;
		} finally {
			clearTimeout(timer);
		}
	}

	/** Parse natijasidan faqat ruxsat etilgan tillarni qoldirish */
	private cleanParsed(parsed: PropertyTranslationsMap): PropertyTranslationsMap | null {
		const clean: PropertyTranslationsMap = {};
		for (const loc of SUPPORTED_LOCALES) {
			if (parsed[loc]?.title) clean[loc] = { title: parsed[loc]!.title, desc: parsed[loc]!.desc || '' };
		}
		return Object.keys(clean).length ? clean : null;
	}

	/** Gemini fallback. Xato bo'lsa null. */
	private async runGemini(prompt: string): Promise<PropertyTranslationsMap | null> {
		const key = process.env.GEMINI_API_KEY;
		if (!key) {
			this.logger.warn('GEMINI_API_KEY topilmadi — tarjima o\'tkazib yuborildi');
			return null;
		}

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
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
			return this.cleanParsed(JSON.parse(raw) as PropertyTranslationsMap);
		} catch (err: any) {
			this.logger.warn(`Tarjima bajarilmadi: ${err?.message || err}`);
			return null;
		} finally {
			clearTimeout(timer);
		}
	}
}
