<div align="center">

# ⚡ VaultMail

### Obsidian Vault Knowledge Base + RAG Email Sender

Turn your Obsidian notes into perfectly crafted, context-aware emails — powered by Gemini AI and Retrieval-Augmented Generation.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-vault--mail--nine.vercel.app-f59e0b?style=for-the-badge)](https://vault-mail-nine.vercel.app/)
[![Video Demo](https://img.shields.io/badge/🎬_Video_Demo-Google_Drive-2dd4bf?style=for-the-badge)](https://drive.google.com/file/d/11IMnpzwm5-K33-BbU5KVS3l5i-AoKTx4/view?usp=sharing)

</div>

---

## 📌 What is VaultMail?

VaultMail is a full-stack web application that bridges your **Obsidian knowledge base** with **AI-powered email drafting**. Upload your vault, and VaultMail will:

1. **Parse** every Markdown file in your Obsidian vault
2. **Chunk & Embed** the content using Google's Gemini Embedding API
3. **Index** the embeddings into a Qdrant vector database
4. **Retrieve** the most relevant notes when you describe an email
5. **Draft** a context-aware email using Gemini Flash — grounded in *your own words*
6. **Send** the finalized email via Gmail SMTP

> No hallucinated content. Every email is backed by your actual notes.

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | JWT-based authentication with bcrypt password hashing |
| 📦 **Vault Upload** | Drag-and-drop `.zip` upload of your entire Obsidian vault |
| 🧠 **RAG Pipeline** | Gemini embeddings → Qdrant vector search → context-grounded drafting |
| ✍️ **AI Email Drafting** | Describe what you want — Gemini writes it using your notes as source |
| 📧 **Gmail SMTP Integration** | Review, edit, and send emails directly from the app |
| 📂 **Vault Browser** | Explore indexed notes with a code-editor-style preview (line numbers included) |
| 📜 **Email History** | Track all sent emails with timestamps and recipients |
| 👥 **Multi-User Isolation** | Each user's vault and emails are completely isolated |
| 🎨 **Premium UI** | Custom "Obsidian Terminal" design — amber/teal palette, JetBrains Mono, dark theme |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |
| **Vite 8** | Build tool & dev server |
| **Lucide React** | Icon library |
| **Vercel** | Frontend deployment |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Python web framework (async) |
| **Google Gemini API** | `text-embedding-004` for embeddings, `gemini-2.0-flash` for drafting |
| **Qdrant Cloud** | Vector database for semantic search |
| **MongoDB Atlas** | User accounts, email history |
| **Gmail SMTP** | Email delivery |
| **Gunicorn + Uvicorn** | Production ASGI server |
| **Render** | Backend deployment |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                     │
│              React + Tailwind + Vite                     │
│                                                         │
│  Landing ──► Auth ──► Dashboard ──► Compose ──► Send    │
│                         │                               │
│                    Vault Upload                          │
│                    Vault Browser                         │
│                    Email History                         │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (HTTPS)
┌──────────────────────▼──────────────────────────────────┐
│                   BACKEND (Render)                       │
│                  FastAPI + Python                        │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Auth    │  │  Vault   │  │  Agent   │  │  Email  │ │
│  │  Router  │  │  Router  │  │  Router  │  │  Router │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │             │              │      │
│  ┌────▼─────┐  ┌─────▼────┐  ┌────▼─────┐  ┌────▼────┐│
│  │ MongoDB  │  │  Qdrant  │  │  Gemini  │  │  Gmail  ││
│  │  Atlas   │  │  Cloud   │  │   API    │  │  SMTP   ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Google Gemini API Key** — [Get one free](https://aistudio.google.com/apikey)
- **Qdrant Cloud** account — [Free tier](https://cloud.qdrant.io/)
- **MongoDB Atlas** cluster — [Free tier](https://www.mongodb.com/atlas)
- **Gmail App Password** — [Generate here](https://myaccount.google.com/apppasswords)

### 1. Clone the Repository

```bash
git clone https://github.com/Sahil-2005/VaultMail.git
cd VaultMail
```

### 2. Backend Setup

```bash
cd server
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `server/.env` from the example:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
GMAIL_ADDRESS=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/vaultmail
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

> Backend runs at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

> Frontend runs at `http://localhost:5173`

### 4. Try It Out

1. Register a new account at `http://localhost:5173/register`
2. Upload a `.zip` of your Obsidian vault
3. Go to **Compose** and describe the email you want
4. Review the AI-generated draft with source citations
5. Click **Approve & Send**

---

## 📁 Project Structure

```
VaultMail/
├── client/                    # React frontend
│   ├── src/
│   │   ├── assets/            # Static assets (demo video)
│   │   ├── components/        # Reusable UI components
│   │   │   └── email/         # ComposeForm, DraftEditor, SourcePanel, ApproveButton
│   │   ├── context/           # AuthContext (JWT state management)
│   │   ├── pages/             # Route pages
│   │   │   ├── LandingPage    # Public landing with demo video
│   │   │   ├── LoginPage      # Two-pane auth layout
│   │   │   ├── RegisterPage   # Account creation
│   │   │   ├── Dashboard      # Stats + quick actions
│   │   │   ├── VaultUpload    # Drag-and-drop vault upload
│   │   │   ├── VaultBrowser   # Code-editor-style note viewer
│   │   │   ├── ComposePage    # RAG email drafting
│   │   │   └── HistoryPage    # Sent email log
│   │   ├── utils/             # apiFetch helper
│   │   └── index.css          # Design system (Obsidian Terminal theme)
│   └── vercel.json            # SPA routing config
│
├── server/                    # FastAPI backend
│   ├── app/
│   │   ├── config.py          # Environment variable loader
│   │   ├── dependencies.py    # JWT auth dependency
│   │   ├── main.py            # App entry + CORS middleware
│   │   ├── routers/
│   │   │   ├── auth.py        # Register / Login / Me
│   │   │   ├── vault.py       # Upload / Notes / Note detail
│   │   │   ├── agent.py       # RAG draft endpoint
│   │   │   └── email.py       # Send / History
│   │   └── services/
│   │       ├── auth_service.py     # Bcrypt + JWT
│   │       ├── database.py         # MongoDB (Motor async)
│   │       ├── email_service.py    # Gmail SMTP sender
│   │       ├── embedding_service.py # Gemini embedding
│   │       ├── gemini_service.py   # Gemini Flash drafting
│   │       └── retrieval_service.py # Qdrant vector search
│   └── requirements.txt
│
└── sample_vault/              # Example Obsidian vault for testing
```

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 **Live App** | [vault-mail-nine.vercel.app](https://vault-mail-nine.vercel.app/) |
| 🎬 **Video Demo** | [Google Drive](https://drive.google.com/file/d/11IMnpzwm5-K33-BbU5KVS3l5i-AoKTx4/view?usp=sharing) |
| 💻 **GitHub Repo** | [github.com/Sahil-2005/VaultMail](https://github.com/Sahil-2005/VaultMail) |

---

## 📄 License

This project is built as an internship assignment submission.

---

<div align="center">

## 👤 Author

### Sahil Gawade

[![GitHub](https://img.shields.io/badge/GitHub-171515?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Sahil-2005)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sahil-gawade-920a0a242/)
[![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gawadesahil.dev@gmail.com)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/sahilgawade4321/)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sahil-gawade.vercel.app/)

---

*Built with ☕ and Gemini — because your notes deserve better than copy-paste.*

</div>
