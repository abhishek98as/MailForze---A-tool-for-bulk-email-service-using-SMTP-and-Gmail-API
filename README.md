# MailForze — Bulk Email Service using SMTP & Gmail API

> Enterprise-grade email automation platform built with **Next.js 14**, **MongoDB**, and **Google Gemini AI**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

- 📧 **Bulk Email Sending** — Import recipients from Excel (.xlsx) and send personalized emails via your own SMTP
- 🤖 **AI-Powered Analysis** — Google Gemini 1.5 Flash spam score, tone detection & email rewriting
- 📊 **Real-time Dashboard** — Live stats for sent, delivered, bounced, opened & replied emails
- 📋 **Campaign Management** — Create, track, and manage multiple email campaigns
- 👥 **Recipients Browser** — Filter recipients by campaign and status, retry failed emails
- 📄 **Email Templates** — Create, save, and reuse HTML email templates with live preview
- 📈 **Reports & Analytics** — Daily volume charts, status distribution, CSV export
- 🔔 **Activity Logs** — Full paginated audit trail of every email event
- ⚙️ **SMTP/IMAP Settings** — Store credentials securely in your own MongoDB instance
- 📱 **Fully Responsive** — Mobile, tablet, and desktop compatible
- 🔒 **Client-First Privacy** — Credentials stored only in **your own** MongoDB Atlas database

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Styling     | Tailwind CSS v4 + Custom CSS        |
| Database    | MongoDB Atlas (Mongoose)            |
| Email       | Nodemailer (SMTP)                   |
| IMAP Sync   | imap-simple + mailparser            |
| Excel Parse | xlsx                                |
| AI          | Google Gemini 1.5 Flash             |
| Deployment  | Vercel (with Cron Jobs)             |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abhishek98as/MailForze---A-tool-for-bulk-email-service-using-SMTP-and-Gmail-API.git
cd MailForze---A-tool-for-bulk-email-service-using-SMTP-and-Gmail-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mailforge?retryWrites=true&w=majority
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it's already in `.gitignore`

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

### SMTP Setup (Gmail)

1. Go to **Settings** in the app
2. Enter your Gmail SMTP details:
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **Username:** your Gmail address
   - **Password:** [App Password](https://myaccount.google.com/apppasswords) (not your main password)
3. Click **Test SMTP Connection** to verify
4. Click **Save Settings**

### MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add your IP to the **Network Access** whitelist (or `0.0.0.0/0` for all)
3. Create a database user and copy the connection string to `MONGODB_URI`

---

## 📁 Project Structure

```
mailforge/
├── app/
│   ├── api/              # API routes (campaigns, send, track, AI, etc.)
│   ├── dashboard/        # Dashboard page
│   ├── compose/          # Compose & Send page
│   ├── campaigns/        # Campaigns list + detail
│   ├── recipients/       # Recipients browser
│   ├── templates/        # Email templates
│   ├── reports/          # Analytics & reports
│   ├── logs/             # Activity logs
│   ├── ai-assistant/     # AI email optimizer
│   └── settings/         # SMTP/IMAP settings
├── components/           # Shared UI components (Sidebar, Topbar, etc.)
├── models/               # Mongoose models (Campaign, Recipient, EmailLog)
├── lib/                  # DB connection, utilities
└── vercel.json           # Vercel cron job config
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy — Vercel auto-configures Next.js

The `vercel.json` includes a **cron job** that syncs IMAP replies/bounces automatically.

---

## 🔐 Privacy & Security

- SMTP/IMAP credentials are stored **only in your MongoDB** instance — not on any third-party server
- Use **App Passwords** (not your main email password) for Gmail/Outlook
- The `.env.local` file is gitignored and never committed

---

## 📄 License

MIT License — free to use and modify.

---

*Built with ❤️ using Next.js + MongoDB + Google Gemini AI*
