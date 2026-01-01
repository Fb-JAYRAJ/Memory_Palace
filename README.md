# 🧠 Memory Palace — Flashcards App

A clean, fast, and minimal flashcards application built to help you
**create, organize, and memorize concepts efficiently**.

Users create **rooms (topics)** and fill them with **flashcards** containing:
- question (front)
- answer (back)
- optional hint
- flip + reveal animations
- edit + delete controls

---

## 🔗 Live Demo

👉 https://memory-palace-nu.vercel.app  
(Login required — create a test account)

---

## 🚀 Deployment (Vercel)
 
Deployed on **Vercel** and powered by **Supabase** for authentication + database.  
Already configured with:

vercel.json:
```
{
  "rewrites": [
    { "source": "/room/:path*", "destination": "/" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🖼️ Preview

### 🖼️ Signup Page
<img width="1512" height="805" alt="Memory_Palace_Signup" src="https://github.com/user-attachments/assets/6f722a66-6dd2-436a-a46d-96f7246d1906" />

### 🖼️ Rooms Dashboard
<img width="1512" height="810" alt="Memory_Palace" src="https://github.com/user-attachments/assets/b5e40cc8-b783-435a-94dd-49fc0a3025b2" />

---

## ✨ Features

### 🔐 Authentication
- Email + password login/signup (Supabase Auth)
- Secure session handling

### 🏠 Rooms (Topics)
- Create rooms
- Edit room details
- Delete rooms
- Each room contains its own flashcards

### 🃏 Flashcards
- Add question / answer / hint
- Flip animation (Hint → Answer → Reset cycle)
- Edit flashcards inline
- Delete with confirmation modal
- Smooth UI feedback + toasts

### 🎨 UI / UX
- TailwindCSS styling
- Subtle gradients + shadows
- Responsive layout
- Skeleton loading states
- Clean, minimal interface

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|--------|
| React + Vite | Frontend framework |
| Supabase | Auth + Database |
| Zustand | State management |
| React Router | Routing |
| TailwindCSS | Styling |
| Vercel | Deployment |
| React Hot Toast | Notifications |

---

## 📁 Folder Structure

```
src/
├── components/
│   └── auth/
│        ├── Login.jsx
│        └── Signup.jsx
├── pages/
│   ├── rooms/
│   │    └── Rooms.jsx
│   └── cards/
│        └── Cards.jsx
├── lib/
│   ├── supabase.js
│   └── auth.js
├── store/
│   └── useMemories.js
├── styles/
│   └── theme.css
├── App.jsx
├── main.jsx
└── index.css
```

---

## ⚙️ Environment Variables

Create a file:

.env.local
```
Add:
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ✔️ These are safe to expose on the frontend — but don’t leak your **service_role key**.

In Vercel → Project → Settings → Environment Variables, add the same values.

---

## 🗄️ Supabase Setup

1️⃣ Create project at https://supabase.com  
2️⃣ Create tables:

### rooms

| column | type | notes |
|--------|------|------|
| id | uuid | primary key |
| title | text | required |
| description | text | optional |
| user_id | uuid | references auth.users |
| created_at | timestamp | default now() |

### cards

| column | type | notes |
|--------|------|------|
| id | uuid | primary key |
| room_id | uuid | references rooms.id |
| front | text | question |
| back | text | answer |
| hint | text | optional |
| user_id | uuid | references auth.users |
| created_at | timestamp | default now() |

Enable **Row Level Security**, then use Supabase defaults for CRUD policies.

---

## ▶️ Running Locally

```
npm install
npm run dev
```

Project runs at:
```
http://localhost:5173
```

---

## 🐛 Common Issues

1️⃣ Blank Page on Deploy

Check env variables in Vercel.

2️⃣ Refresh 404 on Card Page

Ensure vercel.json exists in root.

3️⃣ Supabase Error: “URL Required”

.env file not loaded → restart server.

---

## 📜 License

MIT License — feel free to learn from it and build on top.

---

## 🙌 Contributions

Pull requests are welcome — improvements, refactors, UI polishing, new features, all appreciated.

---

## ⭐ Support

If you like the project — star the repo!
It helps others discover it and shows your support ✨

---

## 👤 Author

**Jayraj Sawant**
