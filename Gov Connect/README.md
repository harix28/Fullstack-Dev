# Fullstack Development Repository

Welcome to the Fullstack Development repository! This repository contains a collection of full-stack projects, frontend interfaces, and development experiments.

## Projects

### 🏛️ [GovConnect - Unified Citizen Services Platform](./govconnect)

**GovConnect** is a comprehensive, citizen-facing portal designed to simplify how people interact with government services. It acts as a unified platform where citizens can discover schemes, track job opportunities, manage official documents securely, and receive AI-assisted help with grievances.

#### Key Features of GovConnect:
- **Unified Citizen Profile**: A single source of truth for personal data to drive intelligent eligibility matching.
- **Scheme Discovery Engine**: Recommends relevant government schemes with visual eligibility checklists and match percentages.
- **Government Jobs Portal**: A localized job board for discovering government vacancies, complete with deadline tracking.
- **Document Vault**: A UI for a secure document manager that simulates OCR processing states (Verified, Processing).
- **AI Grievance Assistant**: A guided workflow that analyzes user complaints, classifies the correct department, drafts formal grievances, and directs the user to the correct official portal for submission.
- **Modern Tech Stack**: Built with React 18, Vite, Tailwind CSS v3, and React Router v6.

> **Note:** The GovConnect frontend is currently built using mock data and local state to demonstrate the UI/UX architecture. It is designed to be easily wired up to a Node.js/PostgreSQL backend in the future.

👉 **[View the GovConnect Project Details & Installation Guide](./govconnect/README.md)**

---

## 🛠️ Repository Setup

If you wish to run any of the projects locally, navigate to the specific project folder and follow its respective `README.md`.

For example, to run GovConnect:
```bash
cd govconnect
npm install
npm run dev
```

## 📄 License
This repository is open-sourced under the MIT License.

## AI + Government Source Pipeline

1. Copy `server/.env.example` to `server/.env`.
2. Put a newly rotated Gemini API key in `GEMINI_API_KEY` (never in `VITE_*`).
3. Start backend: `npm run server`.
4. Start frontend in another terminal: `npm run dev`.
5. Optional source crawl: `pip install -r scraper/requirements.txt` then `npm run scrape`.

The crawler reads `scraper/government_list.xlsx`, checks robots.txt, stays on the source host, applies a delay and writes `scraper/data/pages.json` and `sources.json`. It does not bypass CAPTCHA, OTP, authentication or other access controls. Crawled content is source material and must be verified before being presented as current official information.
