# 💰 Personal Finance Dashboard

A full-stack **Personal Finance Dashboard** built with **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL**, **NextAuth**, and the **Plaid API**. The application allows users to securely register, log in, connect a bank account using Plaid Sandbox, and view financial information such as account balances and transactions through an intuitive dashboard.

---

## 🚀 Features.

- 🔐 Secure user authentication with NextAuth
- 🔒 Password hashing using bcrypt
- 👤 User registration and login
- 🏦 Connect bank accounts using Plaid Sandbox
- 💳 View linked bank accounts
- 💰 Display account balances
- 📄 View recent transactions
- 📊 Spending overview dashboard
- 🗄️ PostgreSQL database with Prisma ORM
- 📱 Responsive UI built with Tailwind CSS

---

# 🛠 Tech Stack.

| Category | Technology |
|----------|------------|
| Frontend | Next.js 16, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth |
| Password Security | bcrypt |
| Financial API | Plaid Sandbox |

---

# ⚙️ How the Project Works

### 1️⃣ User Registration

- Users create an account using their name, email, and password.
- Passwords are securely hashed using **bcrypt** before being stored in PostgreSQL.

---

### 2️⃣ Authentication

- Users log in using their registered email and password.
- NextAuth validates the credentials.
- A secure session is created.
- Only authenticated users can access the dashboard.

---

### 3️⃣ Connect Bank Account

- Users click **Connect Bank Account**.
- Plaid Link opens in Sandbox mode.
- Users authenticate with a sandbox bank.
- Plaid generates a **Public Token**.
- The backend exchanges it for an **Access Token**.
- Account details are securely stored.

---

### 4️⃣ Fetch Financial Data

The application retrieves:

- Account balances
- Bank accounts
- Transaction history
- Spending categories

using the Plaid API and stores the data in PostgreSQL.

---

### 5️⃣ Dashboard

The dashboard displays:

- Linked bank accounts
- Current balances
- Recent transactions
- Spending summary

allowing users to monitor their finances from a single interface.

---

# 🏦 Plaid Sandbox Demo

To test the application, use the following Plaid Sandbox credentials.

## Phone Number

```
415-555-0011
```

## OTP

```
123456
```

## Bank Name

```
Tartan Bank
```

## Username

```
user_good
```

## Password

```
pass_good
```

---

# 📂 Project Structure

```text
personal-finance-dashboard
│
├── app
│   ├── api
│   ├── dashboard
│   ├── login
│   └── register
│
├── components
├── lib
│   ├── auth.ts
│   ├── prisma.ts
│   └── plaid.ts
│
├── prisma
│   └── schema.prisma
│
├── public
├── types
├── prisma.config.ts
├── package.json
└── README.md
```

---

# ⚡ Installation

Clone the repository

```bash
git clone https://github.com/Puneet-2005/personal-finance-dashboard.git
```

Move into the project

```bash
cd personal-finance-dashboard
```

Install dependencies

```bash
npm install
```

Create a `.env` file and configure:

```env
DATABASE_URL=your_database_url

AUTH_SECRET=your_secret

PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox
```

Generate Prisma Client

```bash
npx prisma generate
```

Push the schema to PostgreSQL

```bash
npx prisma db push
```

Run the development server

```bash
npm run dev
```

Open the application:

```
http://localhost:3000
```

---
## 📸 Screenshots

- Login Page
- Register Page
- Dashboard
- Plaid Bank Connection
- Transactions View
# 🔒 Security

- Passwords are securely hashed using bcrypt.
- Authentication is managed using NextAuth.
- Sensitive API keys are stored in environment variables.
- Plaid access tokens are handled securely on the server.

---

# 🎯 Future Improvements

- AI-powered expense categorization
- Monthly spending analytics
- Budget notifications
- CSV/PDF export
- Investment portfolio tracking
- Interactive financial charts
- Multi-bank support
- Mobile application

---

# 👨‍💻 Author

**Puneet M P Bharadwaj**

- GitHub: https://github.com/Puneet-2005

---

# 📜 License

This project is created for educational and portfolio purposes.
