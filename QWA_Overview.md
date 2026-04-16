
# 📘 Quran Web Application (QWA) — Overview

A minimal and production-ready **Quran Web Application (QWA)** built using **Next.js (Frontend + SSG)** and a minimal **Node.js backend** inside the same project directory, running on the **same port**, styled using **Tailwind CSS**, and fully implemented with **JavaScript**.

Theme Colors:
- **Black** (#0A0A0A)
- **Navy Blue** (#0D1B2A)

This app is intentionally minimal and focused only on the required features — nothing extra.

---

## 🎯 Project Goals
- Provide a clean and responsive Quran reading interface.
- Use **Next.js SSG** for fast and SEO‑friendly content delivery.
- Keep backend minimal (Node.js API routes).
- Manage settings using **localStorage**.
- Use a **simple Quran JSON database** from GitHub.

---

## 🧩 Core Features (MVP)
### ✅ Surah List Page
Display all **114 surahs** with:
- Arabic name
- English name
- Surah number

### ✅ Ayat Page
For each surah:
- Arabic text
- English translation
- Responsive and clean layout

### ✅ Search
Allow users to search **English translations** across all ayat.

### ✅ Settings Panel (Sidebar)
- Arabic font selection (minimum 2 fonts)
- Arabic font size adjustment
- Translation font size adjustment
- Persist settings using **localStorage**

---

## 🏗 Tech Stack
### Frontend
- **Next.js 14+** (App Router or Pages Router)
- **Static Site Generation (SSG)**
- **React + JavaScript**
- **Tailwind CSS v3+**

### Backend (same port)
- **Node.js** using:
  - Next.js API Routes **OR**
  - Hono/Express custom server (optional)

### Data
- Quran JSON dataset (from GitHub)
- No need for MongoDB unless expanding later

### Storage
- Browser localStorage for settings

---

## 📂 Detailed Folder Structure
```
/qwa-project
│
├── app/                      # Next.js App Router (UI + Pages)
│   ├── layout.js            # Global layout, theme, header
│   ├── page.js              # Surah List Page
│   │
│   ├── surah/               # Dynamic Ayat Pages
│   │   └── [id]/
│   │       └── page.js      # Ayat display per Surah
│   │
│   ├── search/
│   │   └── page.js          # Search UI
│   │
│   ├── settings/
│   │   └── page.js          # Settings panel (font/type controls)
│   │
│   └── api/                 # Backend API Routes
│       ├── quran/           # Surah/Ayat data
│       │   ├── route.js
│       │   └── [id]/route.js
│       │
│       └── search/route.js  # Search API handler
│
├── lib/                     # Utility helpers
│   ├── quran.js             # Data loaders
│   └── settings.js          # LocalStorage sync helpers
│
├── public/
│   └── quran-json/          # Quran dataset (surahs, ayat, translations)
│
├── styles/
│   └── globals.css          # Tailwind + custom styles
│
├── tailwind.config.js       # Tailwind config
├── next.config.js           # Next.js configuration
├── package.json
└── README.md
```

---

## 🚀 Final Deliverable
A clean, modern Next.js Quran reader with:
- Fast SSG pages
- Beautiful dark UI
- Local settings persistence
- Minimal but effective backend

Nothing unnecessary. Everything functional.

---
