# 📧 Resilient Email Sending Service (Node.js + TypeScript)

This project implements a resilient mock email service with built-in retry logic, provider fallback, idempotency, rate limiting, and status tracking. Built using TypeScript and Express.js, this service simulates real-world robustness for sending emails.

---

## ✅ Features

- 🔁 Retry logic with exponential backoff (1s → 2s → 4s)
- 🔄 Fallback to secondary email provider if primary fails
- ♻️ Idempotency using unique job IDs to avoid duplicate emails
- 🚦 Rate limiting (10 requests/min per IP)
- 📊 Status tracking for each email request
- 🧼 Clean architecture following SOLID principles
- 🧪 Unit-test ready and well-structured code
- 💡 Logging	Console logs simulate provider response

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Rate Limiting:** `express-rate-limit`
- **Tools:** ts-node-dev, nodemon

---

## 📦 Installation & Running Locally

### Prerequisites

- Node.js (v18+)
- npm

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/email-service-ts.git
cd email-service-ts

# Install dependencies
npm install

# Start the server (development mode)
npm run start
Server will run on: http://localhost:3000
```

📢 Feedback & Contribution
Feel free to open issues, suggest improvements, or contribute!

🔗 LinkedIn - Sayon Batabyal
💼 Email: batabyalsayon@gmail.com


### 📄 License
This project is provided for learning and internship demonstration purposes. You are free to fork and reuse with credit.
