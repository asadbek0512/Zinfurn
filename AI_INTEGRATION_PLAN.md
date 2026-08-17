# AI Integration Plan — Zinfurn

Maqsad: Zinfurn'ga AI/AR asosidagi mebel tanlash funksiyasini qo'shish. Portfolio/interview uchun bosqichma-bosqich amalga oshiriladi.

## Bosqich 1 — AI xona tahlili + mebel tavsiyasi + vizual to'ldirish

### Arxitektura

```
[Next.js] rasm upload
   → [NestJS: AiRoomModule]
        1. Vision tahlil (GPT-4o vision) → {uslub, ranglar, xona turi, bo'sh joy tavsifi}
        2. Furniture matching (embedding similarity, MongoDB)
        3. Image generation (mockup) → URL
   → [Next.js] natija: tavsif + tavsiya etilgan mahsulotlar + mockup rasm
```

### Backend (`zinfurn-api`)

- [ ] `AiRoomModule` yaratish (`apps/zinfurn-api/src/component/ai-room/`)
- [ ] `POST /ai-room/analyze` (yoki GraphQL mutation `analyzeRoom`) — rasm qabul qiladi, OpenAI vision'ga yuboradi
  - Input: rasm (multipart yoki base64), foydalanuvchi ID (auth ixtiyoriy)
  - Output: `{ style: string, colors: string[], roomType: string, notes: string }`
- [ ] Mavjud `Product` (mebel) schema'siga `styleTags: string[]` va `embedding: number[]` maydonlarini qo'shish
- [ ] Bir martalik migration/script: barcha mavjud mahsulotlar uchun tavsif asosida embedding generatsiya qilib, DB'ga yozish (`text-embedding-3-small`)
- [ ] `findMatchingProducts(roomAnalysis)` — cosine similarity bilan eng mos 5-10 mahsulotni qaytaradi (MongoDB Atlas Vector Search yoki oddiy in-memory cosine, boshida oddiysidan boshlash)
- [ ] `generateRoomMockup(roomImage, selectedProducts)` — image generation API (OpenAI `gpt-image-1` yoki Stable Diffusion/Replicate) orqali mockup yaratadi, natija URL `uploads/` ga saqlanadi
- [ ] Rate limit / xarajat nazorati (OpenAI so'rovlar limitlangan bo'lishi kerak — foydalanuvchi kuniga N marta)

### Frontend (`zinfurn-next`)

- [ ] Yangi sahifa: `pages/ai-room-designer.tsx` (yoki mavjud mahsulot sahifasiga widget)
- [ ] Rasm yuklash komponenti (`<RoomImageUpload />`)
- [ ] Natija ko'rsatish: tahlil matni + tavsiya etilgan mahsulotlar kartasi + generatsiya qilingan mockup rasm
- [ ] Loading/error state (AI so'rovi 5-15 soniya cho'zilishi mumkin)

### Ma'lumotlar oqimi (data flow) qisqacha

1. Foydalanuvchi rasm yuklaydi → frontend backend'ga yuboradi
2. Backend OpenAI vision'ga so'rov yuboradi → tahlil qaytadi
3. Tahlil matnidan embedding hisoblanadi → DB'dagi mahsulot embedding'lari bilan solishtiriladi
4. Eng mos mahsulotlar + original rasm image generation modeliga yuboriladi
5. Natija (matn + mahsulotlar ro'yxati + mockup URL) frontend'ga qaytadi

**Status:** boshlanmagan

## Bosqich 2 — Mahsulotlarni 3D modelga aylantirish

- [ ] Pilot: bir nechta mahsulotda (masalan game chair) 2D rasmdan 3D model generatsiya qilib sinash
- [ ] Sifatni baholash, professional darajaga yetkazish
- [ ] Qolgan mahsulotlarga kengaytirish

**Status:** boshlanmagan

## Bosqich 3 — AR kamera orqali real joylashtirish

- [ ] Kamera orqali xona sirtini aniqlash
- [ ] Tanlangan 3D mebelni real joyga proyeksiya qilish, o'lchamga moslash
- [ ] 5 soniya ushlab turish orqali joylashtirish trigger'i

**Status:** boshlanmagan

## Eslatmalar

- Bosqichlar mustaqil demo bo'la oladigan qilib bo'lingan — har biri tugagach ko'rsatib bo'ladi
- Texnik qarorlar va progress shu faylga qo'shilib boriladi
