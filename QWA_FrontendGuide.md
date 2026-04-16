
# 🎨 QWA Frontend Guide (Next.js + Tailwind + JavaScript)

This guide explains how the **frontend** of the Quran Web Application works using **Next.js**, **JavaScript**, and **Tailwind CSS**, along with a minimal and beautiful dark user interface.

---

## 🧰 Technologies Used
- **Next.js 14+** (Static Site Generation)
- **React (JavaScript only)**
- **Tailwind CSS**
- **localStorage** for settings persistence
- No TypeScript for simplicity

---

## 📁 Frontend Folder Structure
```
/app
  layout.js
  page.js                    # Surah list

  /surah/[id]/page.js        # Ayat page
  /search/page.js            # Search page
  /settings/page.js          # Settings UI

  /api                       # Minimal backend powered by Next.js API Routes
```

---

## 🖼 UI Theme — Black + Navy Blue
### Tailwind Theme Colors
```js
extend: {
  colors: {
    navy: '#0D1B2A',
    blackish: '#0A0A0A',
    textlight: '#E0E1DD'
  }
}
```

---

## 📄 Pages Summary
### 1. Surah List Page (`app/page.js`)
- SSG generated
- Lists 114 surahs with:
  - Arabic name
  - English name
  - Surah number

### 2. Ayat Page (`app/surah/[id]/page.js`)
- Load surah ayat with translation
- Shows Arabic text + English translation
- Font sizes controlled by settings

### 3. Search Page (`app/search/page.js`)
- Client-side OR `/api/search` powered search
- Returns filtered ayat + surah reference

### 4. Settings Page (`app/settings/page.js`)
- Arabic font family switch (Amiri, Madina, etc.)
- Arabic font size
- Translation font size
- All settings **persist via localStorage**

---

## 🔍 Loading Quran Data
Preferred method: SSG load from `public/quran-json/`

```js
const surahList = require('@/public/quran-json/surah.json');
```

---

## 📱 Responsiveness
Use Tailwind breakpoints:
```
md:p-6 lg:p-12
```

---

## ❌ What is NOT included
- Audio recitation
- Tafsir
- User accounts
- Multiple translations

Minimal app only.
