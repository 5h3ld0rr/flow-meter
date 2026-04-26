# 🌊 FlowMeter: Premium Utility Management System

**FlowMeter** is a high-fidelity, full-stack Utility Management System (UMS) designed for modern infrastructure providers. Built with a focus on visual excellence and operational efficiency, it streamlines meter readings, billing, payment processing, and customer management across Electricity, Water, and Gas utilities.

---

## ✨ Key Features

### 📊 Intelligent Dashboards
*   **Real-time Analytics:** Visualized consumption trends using high-performance `Recharts`.
*   **Executive Overview:** At-a-glance metrics for total revenue, active meters, and pending bills.
*   **AI Insights:** Automated consumption forecasting and anomaly detection powered by **Google Gemini**.

### 📝 Comprehensive Meter Management
*   **Multi-Utility Support:** Unified handling of Electricity, Water, and Gas meters.
*   **Historical Tracking:** Complete audit trail of meter readings and maintenance logs.
*   **Verification Workflow:** Built-in status tracking (Submitted, Verified, Disputed) for reading accuracy.

### 💸 Automated Billing & Payments
*   **Dynamic Tariffs:** Flexible rate management for Household, Business, and Government tiers.
*   **PDF Generation:** Professional, automated bill generation using `jsPDF`.
*   **Secure Payments:** Support for Cash, Card, and Online transactions with instant receipting.
*   **Email Notifications:** Automated billing alerts and payment confirmations via `React Email`.

### 🔐 Enterprise-Grade Security
*   **Role-Based Access Control (RBAC):** Granular permissions for Admins, Managers, Officers, and Cashiers.
*   **Secure Auth:** JWT-based session management using `jose` and `bcryptjs`.
*   **Audit Logging:** Comprehensive activity logs for every system action.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| **Backend** | Server Actions, Next.js Middleware |
| **Database** | Microsoft SQL Server (MSSQL) |
| **AI** | Google Gemini (GenAI SDK) |
| **UI Components** | Radix UI, Lucide Icons, Sonner Toasts |
| **Analytics** | Recharts |
| **Communication** | Nodemailer, React Email |

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 20+
*   SQL Server (Express or LocalDB)
*   Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/5h3ld0rr/flow-meter.git
    cd flow-meter
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
    Fill in your database credentials and Gemini API key.

4.  **Initialize Database**
    Run the SQL scripts in the `database/` directory or use the provided script:
    ```bash
    npm run db:init
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```text
flow-meter/
├── src/
│   ├── app/                # Next.js App Router (Dashboard, Billing, etc.)
│   ├── components/         # Reusable UI components & Design System
│   ├── lib/                # DB logic, AI integration, and utilities
│   └── constants/          # Global configuration and static data
├── database/               # SQL schema and initialization scripts
├── public/                 # Static assets and icons
└── scripts/                # Database maintenance scripts
```

---

## 🎨 Design Philosophy
FlowMeter follows a **Glassmorphic Modernist** aesthetic. The interface features:
*   **Deep Contrast:** Rich dark modes with vibrant neon accents.
*   **Visual Hierarchy:** Subtle blurs and layered transparency for depth.
*   **Micro-interactions:** Smooth animations using `framer-motion` (implemented via Tailwind Animate).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by the FlowMeter Team</p>
