<p align="center">
  <img src="client/public/logo.png" width="180" alt="Ilaaj Track Official Logo" />
</p>

# 🏥 Ilaaj Track (इलाज ट्रैक)
> **AI-Orchestrated Closed-Loop Healthcare Referral & Care Continuity Platform for Rural Communities**

[![Live Demo](https://img.shields.io/badge/Live%20Platform-ilaaj--track.onrender.com-0f766e?style=for-the-badge&logo=render&logoColor=white)](https://ilaaj-track.onrender.com)
[![Status](https://img.shields.io/badge/Deployment-Live%20%26%20Operational-10b981?style=for-the-badge)](https://ilaaj-track.onrender.com)
[![AI Engine](https://img.shields.io/badge/AI%20Core-Gemini%203.8%20%7C%20Groq%20120B-8b5cf6?style=for-the-badge)](https://ilaaj-track.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌐 Live Website & Demo Links
* **Live Web Application:** [https://ilaaj-track.onrender.com](https://ilaaj-track.onrender.com)
* **REST API Health Endpoint:** [https://ilaaj-track.onrender.com/api/health](https://ilaaj-track.onrender.com/api/health)
* **Family Health Locker API:** [https://ilaaj-track.onrender.com/api/family-members](https://ilaaj-track.onrender.com/api/family-members)
* **Active Facilities Directory:** [https://ilaaj-track.onrender.com/api/facilities](https://ilaaj-track.onrender.com/api/facilities)
* **Live Referrals Queue:** [https://ilaaj-track.onrender.com/api/referrals](https://ilaaj-track.onrender.com/api/referrals)

---

## 🎯 Mission Statement
> *"Never send a rural patient blindly into the dark. Ensure the receiving hospital is ready, guide the journey with live routing, and stay connected until post-discharge recovery is verified in their village."*

---

## 🚨 The Rural Healthcare Challenge: The "Clinical Black Hole"
In public healthcare networks across rural India (Ayushman Arogya Mandirs $\rightarrow$ Primary Health Centres $\rightarrow$ Community Health Centres $\rightarrow$ Sub-District & District Hospitals), emergency referrals face critical systemic friction:
* **Over 150,000 blind paper referral slips** are written every week with zero advance notice to receiving facilities and zero bed reservations.
* **48.2% Referral Drop-Out Rate** (*The Lancet Global Health*): Nearly half of rural patients abandon care after traveling 40–80 km over unpaved roads, only to find absent specialists, full ICU wards, or broken diagnostic equipment (ECG, X-Ray, CT).
* **Catastrophic Out-of-Pocket Expenditure (OOPE)**: Redundant emergency visits and repeated diagnostic tests drive families into medical debt.
* **Absence of Counter-Referrals**: Once discharged, patients return to remote villages without structured follow-up, causing preventable post-operative relapses.

---

## ⚡ Key Platform Capabilities

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            ILAAJ TRACK PLATFORM ARCHITECTURE                     │
└──────────────────────────────────────────────────────────────────────────────────┘

   [ 1. Rural Health Post ]          [ 2. Cloud AI Engine ]         [ 3. Receiving Hospital ]
  • Frontline ASHA / ANM Worker    • Multimodal Gemini 2.5 Flash   • District Casualty Desk
  • Indic Spoken Voice Input       • 6-Factor Facility Scorecard   • Bed Pre-Reservation
  • Handwritten Slip OCR           • Dynamic Haversine Routing     • QR Handover Scan
            │                               │                              │
            ▼                               ▼                              ▼
  ┌───────────────────┐           ┌───────────────────┐          ┌───────────────────┐
  │ Voice/OCR Triage  │──────────►│ Care Readiness &  │─────────►│ Pre-Arrival Queue │
  │ & Vital Extraction│           │ Smart Rerouting   │          │ & Green Corridor  │
  └───────────────────┘           └───────────────────┘          └───────────────────┘
            ▲                                                              │
            │                                                              ▼
  ┌───────────────────┐                                          ┌───────────────────┐
  │ DHO Infrastructure│◄─────────────────────────────────────────│ Counter-Referral  │
  │ Network Heatmap   │        Live Closed-Loop Feedback         │ Village Follow-Up │
  └───────────────────┘                                          └───────────────────┘
```

### 1. Indic Voice & Prescription OCR Clinical Triage
* Designed for frontline ASHA and ANM workers speaking colloquial Hindi or Marathi.
* Multimodal AI extracts vitals (BP, SpO2, Pulse, Temp) and presents symptoms into structured ICMR entities in $<5$ seconds.
* Handwritten prescription slip OCR transcribes medications and past interventions instantly.

### 2. 6-Factor Hospital Readiness Engine & Dynamic Rerouting
* Before a patient boards transport, Ilaaj Track evaluates the receiving hospital across 6 live criteria:
  1. Specialist on duty (Cardiologist, Obstetrician, Surgeon)
  2. Diagnostic equipment uptime (ECG, X-Ray, CT Scanner)
  3. ICU bed availability ($<85\%$ threshold)
  4. Blood bank status (O-negative reserves)
  5. Emergency corridor transport availability
  6. Universal identity verification
* **Automated Mid-Transit Rerouting:** If the primary destination experiences an ICU surge or equipment breakdown, the system automatically redirects the ambulance to the nearest capable facility via live Haversine routing.

### 3. Casualty Pre-Arrival Queue & 108 Emergency Green Corridor
* Receiving emergency casualty departments receive digital advance notice with complete vitals, suspected diagnosis, and pre-assigned diagnostic slots.
* Fast-track token and digital QR code eliminate chaotic 3-hour casualty registration queues.

### 4. Post-Discharge Village Follow-Up (Counter-Referral)
* Closes the loop when the patient returns home.
* Automatically schedules post-discharge checkups for the village ASHA worker, unlocking direct performance incentives upon completed verification.

### 5. DHO Infrastructure & Equipment Uptime Radar
* Provides District Health Officers with real-time visibility into machine downtime, specialist vacancies, and referral bottleneck patterns across all blocks.

---

## 🎨 Rural Clinical Fieldwork Design System
The user interface is engineered specifically for low-resource rural clinical settings:
* **Daylight-First High-Contrast Palette:** Glare-resistant clinical teal (`#0f766e`), slate (`#f8fafc`), and alert rose (`#be123c`) designed for outdoor sunlight visibility.
* **48px Tactile Touch Targets:** Large, fumble-free buttons accessible on budget touchscreens and mobile devices.
* **Typography:** Clear, open humanist typography with Plus Jakarta Sans and Google Material Symbols.
* **Bilingual Frontline Clarity:** English interface with dual Indic language subtext for frontline workers.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Material Symbols |
| **Backend API** | Node.js, Express, Multer, REST APIs |
| **Clinical AI** | Google Gemini 3.8 Flash (Multimodal Clinical Reasoning & Vision OCR), Groq Flagship GPT-OSS 120B & Qwen 3.8 27B (Sub-second Reasoning), Groq Whisper Large v3 Turbo (Indic STT) |
| **Data & State** | In-Memory State Cache, Supabase PostgreSQL Integration Ready |
| **Hosting & CDN** | Render Global Edge, Render Web Services |

---

## 🛠️ Quick Start: Local Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/AkshitaTamrayat/ilaaj-Track.git
cd ilaaj-Track
```

### 2. Install Dependencies
```bash
# Install backend and root dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Start Development Servers
```bash
# Run backend server (from project root)
npm start
# Server starts on http://localhost:5000

# In a separate terminal, run frontend client
cd client
npm run dev
# Vite frontend starts on http://localhost:3000
```

### 5. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment on Render

This project is configured for fullstack deployment on Render:

1. **Web Service Configuration:**
   * **Environment:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
   * **Health Check Path:** `/api/health`
2. **Environment Variables:**
   * `NODE_ENV` = `production`
   * `PORT` = `10000`
   * `GEMINI_API_KEY` = `<your-api-key>`
   * `GROQ_API_KEY` = `<your-api-key>`

Express automatically serves the pre-compiled Vite frontend from `client/dist` and handles API requests under `/api/*`.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
