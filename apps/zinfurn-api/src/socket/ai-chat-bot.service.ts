import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

/** Chat'dagi AI persona — frontend "AI" belgisini `isAi` bo'yicha ko'rsatadi */
export interface AiMember {
	_id: string;
	memberNick: string;
	memberImage: string;
	isAi: true;
}

/** Bot o'qiydigan chat xabari (gateway'dagi MessagePayload'ning kerakli qismi) */
export interface ChatLine {
	text: string;
	memberData: { _id?: unknown; memberNick?: string; isAi?: boolean } | null;
}

export interface AiChatHooks {
	/** Xabarni ro'yxatga qo'shib hammaga yuboradi */
	emit: (member: AiMember, text: string, replyTo?: { text: string; memberNick: string }) => void;
	history: () => ChatLine[];
	onlineCount: () => number;
}

interface Persona {
	member: AiMember;
	/** Model uchun xarakter tavsifi */
	style: string;
}

interface GeneratedLine {
	persona: string;
	text: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_TIMEOUT_MS = 20_000;

/** Chat jim turganda yangi suhbat boshlanish oralig'i */
const AMBIENT_MIN_MS = 3 * 60_000;
const AMBIENT_MAX_MS = 10 * 60_000;
/** Real foydalanuvchiga javob kechikishi (odamga o'xshab "yozayotgandek") */
const REPLY_MIN_MS = 5_000;
const REPLY_MAX_MS = 20_000;
/** Bitta suhbat ichidagi xabarlar orasidagi pauza */
const LINE_GAP_MIN_MS = 8_000;
const LINE_GAP_MAX_MS = 25_000;
/** Groq bepul limitini tejash: soatiga ko'pi bilan shuncha AI xabar */
const MAX_AI_MESSAGES_PER_HOUR = 30;
const HOUR_MS = 60 * 60_000;
/** Model'ga beriladigan oxirgi xabarlar soni */
const HISTORY_SIZE = 12;
const MAX_TEXT_LENGTH = 300;
const MAX_LINES_PER_TOPIC = 4;

const PERSONAS: Persona[] = [
	{
		member: { _id: 'ai-malika', memberNick: 'Malika', memberImage: '', isAi: true },
		style: 'interior designer, warm and practical, loves Scandinavian and minimal styles, gives concrete tips on colors and layout',
	},
	{
		member: { _id: 'ai-jasur', memberNick: 'Jasur', memberImage: '', isAi: true },
		style: 'furniture craftsman with 15 years of experience, talks about wood types, joints, care and repair, a bit humorous',
	},
	{
		member: { _id: 'ai-dilnoza', memberNick: 'Dilnoza', memberImage: '', isAi: true },
		style: 'young customer furnishing her first apartment in Seoul on a budget, asks questions and shares finds',
	},
	{
		member: { _id: 'ai-timur', memberNick: 'Timur', memberImage: '', isAi: true },
		style: 'office manager who buys furniture for a small company, cares about ergonomics, durability and delivery',
	},
];

const TOPICS = [
	'choosing a sofa for a small living room',
	'solid wood vs MDF furniture',
	'ergonomic office chairs for working from home',
	'how to care for a leather sofa',
	'making a small studio apartment feel bigger',
	'best colors for a bedroom',
	'repairing a wobbly table or chair',
	'furniture for a kids room',
	'moving furniture safely to a new apartment',
	'dining table size for a family of four',
];

const LANGUAGES = ['Uzbek (Latin script)', 'Uzbek (Latin script)', 'Russian', 'English'];

const SYSTEM_RULES = `You write short, natural chat messages for the public chat of Zinfurn, a furniture marketplace.
Rules: casual tone, 1-2 sentences per message, no markdown, no links, no prices, no personal data,
never claim to be human, stay on furniture, interior and home topics. Reply ONLY with JSON.`;

const randomBetween = (min: number, max: number): number => min + Math.floor(Math.random() * (max - min));
const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Umumiy chat'dagi AI suhbatdoshlar. Chat jim tursa mavzu boshlaydi, real foydalanuvchiga javob beradi.
 * Hamma xabar `isAi` belgisi bilan ketadi — foydalanuvchi aldanmasligi uchun.
 */
@Injectable()
export class AiChatBotService implements OnModuleDestroy {
	private readonly logger = new Logger(AiChatBotService.name);
	private hooks: AiChatHooks | null = null;
	private ambientTimer: NodeJS.Timeout | null = null;
	private sentTimestamps: number[] = [];
	private busy = false;

	public start(hooks: AiChatHooks): void {
		if (!process.env.GROQ_API_KEY) {
			this.logger.warn('GROQ_API_KEY is not set — AI chat personas disabled');
			return;
		}
		this.hooks = hooks;
		this.scheduleAmbient();
	}

	public onModuleDestroy(): void {
		if (this.ambientTimer) clearTimeout(this.ambientTimer);
	}

	/** Real foydalanuvchi yozganda chaqiriladi */
	public onUserMessage(text: string, memberNick: string): void {
		if (!this.hooks || this.busy || !text.trim()) return;
		this.busy = true;
		void this.replyTo(text, memberNick).finally(() => {
			this.busy = false;
		});
	}

	private scheduleAmbient(): void {
		if (this.ambientTimer) clearTimeout(this.ambientTimer);
		this.ambientTimer = setTimeout(() => {
			void this.runAmbient().finally(() => this.scheduleAmbient());
		}, randomBetween(AMBIENT_MIN_MS, AMBIENT_MAX_MS));
	}

	private async runAmbient(): Promise<void> {
		// Hech kim online bo'lmasa (kechasi ham) — limitni behuda sarflamaymiz
		if (!this.hooks || this.busy || this.hooks.onlineCount() === 0) return;
		this.busy = true;
		try {
			const [first, second] = [...PERSONAS].sort(() => Math.random() - 0.5);
			const prompt = `Write a short chat exchange (2-${MAX_LINES_PER_TOPIC} messages) between these people:
- ${first.member.memberNick}: ${first.style}
- ${second.member.memberNick}: ${second.style}
Topic: ${pick(TOPICS)}. Language: ${pick(LANGUAGES)}.
Recent chat for context:
${this.formatHistory()}
JSON format: {"messages":[{"persona":"<name>","text":"<message>"}]}`;
			const lines = await this.generate(prompt);
			for (const line of lines.slice(0, MAX_LINES_PER_TOPIC)) {
				if (!this.emitLine(line)) break;
				await sleep(randomBetween(LINE_GAP_MIN_MS, LINE_GAP_MAX_MS));
			}
		} finally {
			this.busy = false;
		}
	}

	private async replyTo(text: string, memberNick: string): Promise<void> {
		await sleep(randomBetween(REPLY_MIN_MS, REPLY_MAX_MS));
		const personaList = PERSONAS.map((p) => `- ${p.member.memberNick}: ${p.style}`).join('\n');
		const prompt = `A real user "${memberNick}" wrote in the chat. Pick the ONE most suitable persona to answer helpfully,
in the same language the user wrote in. If the user asks whether you are a bot, answer honestly that you are an AI assistant.
Personas:
${personaList}
Recent chat:
${this.formatHistory()}
JSON format: {"messages":[{"persona":"<name>","text":"<reply>"}]}`;
		const [line] = await this.generate(prompt);
		if (line) this.emitLine(line, { text: text.slice(0, MAX_TEXT_LENGTH), memberNick });
	}

	private emitLine(line: GeneratedLine, replyTo?: { text: string; memberNick: string }): boolean {
		if (!this.hooks || !this.withinHourlyLimit()) return false;
		const persona = PERSONAS.find((p) => p.member.memberNick.toLowerCase() === String(line.persona).toLowerCase());
		const text = String(line.text ?? '').trim().slice(0, MAX_TEXT_LENGTH);
		if (!persona || !text) return true;
		this.sentTimestamps.push(Date.now());
		this.hooks.emit(persona.member, text, replyTo);
		return true;
	}

	private withinHourlyLimit(): boolean {
		const since = Date.now() - HOUR_MS;
		this.sentTimestamps = this.sentTimestamps.filter((ts) => ts > since);
		return this.sentTimestamps.length < MAX_AI_MESSAGES_PER_HOUR;
	}

	private formatHistory(): string {
		const lines = this.hooks?.history().slice(-HISTORY_SIZE) ?? [];
		if (!lines.length) return '(empty)';
		return lines
			.map((m) => `${m.memberData?.memberNick ?? 'Guest'}${m.memberData?.isAi ? ' (AI)' : ''}: ${String(m.text).slice(0, MAX_TEXT_LENGTH)}`)
			.join('\n');
	}

	private async generate(prompt: string): Promise<GeneratedLine[]> {
		if (!this.withinHourlyLimit()) return [];
		try {
			const response = await fetch(GROQ_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
				body: JSON.stringify({
					model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
					messages: [
						{ role: 'system', content: SYSTEM_RULES },
						{ role: 'user', content: prompt },
					],
					response_format: { type: 'json_object' },
					temperature: 0.9,
				}),
				signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
			});
			if (!response.ok) {
				this.logger.warn(`Groq ${response.status}: ${(await response.text()).slice(0, 150)}`);
				return [];
			}
			const data = (await response.json()) as { choices: { message: { content: string } }[] };
			const parsed = JSON.parse(data.choices[0].message.content) as { messages?: GeneratedLine[] };
			return Array.isArray(parsed.messages) ? parsed.messages : [];
		} catch (err) {
			this.logger.warn(`AI chat generation failed: ${(err as Error).message}`);
			return [];
		}
	}
}
