
# 🛠 QWA Backend Guide (Node.js Backend Inside Next.js)

This backend is intentionally simple — built directly into the Next.js project using **Next API Routes** or a small **Hono/Express server** running on the **same port**.

No TypeScript. Only JavaScript.

---

## 🧰 Backend Stack
- **Node.js**
- **Next.js API Routes** (`app/api/.../route.js`)
- Optional: **Hono** or **Express** custom server
- Quran data via JSON dataset (from GitHub)

---

## 📁 Backend Folder Structure
```
/app/api
  /quran/route.js        # Returns all surahs
  /quran/[id]/route.js   # Returns ayat for specific surah
  /search/route.js       # Search translation text

/lib/quran.js            # Helper functions for loading Quran JSON files
```

---

## 📦 Loading Quran Data
Place dataset in:
```
/public/quran-json/
```
Example:
```js
const surahs = require('@/public/quran-json/surah.json');
```

---

## 🔍 Search API Example
```js
export async function POST(req) {
  const { query } = await req.json();
  const translation = require('@/public/quran-json/translation.json');

  const results = translation.filter((a) =>
    a.text.toLowerCase().includes(query.toLowerCase())
  );

  return Response.json({ results });
}
```

---

## ⚡ Performance Tips
- Cache JSON data once in memory
- Use SSG for all Surah/Ayat pages
- Keep backend minimal

---

## ✔ Not Included
- Authentication
- Database integration
- Audio or tafsir endpoints

This backend supports **just the required features only**.
