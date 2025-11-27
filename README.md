
## 🚀 IntentWallet — Minimal Intent-Based Wallet API

IntentWallet is a lightweight, modular, and extensible Node.js + Express backend designed for building intent-driven applications.  
It supports clean API route structuring, automatic request logging, JSON response capturing, Vite-powered frontend development, and production-ready static serving.

Perfect for developers who want a **fast, minimal, and structured backend** to build modern intent-driven apps.

---

## ⚡ Features

- **Express-based backend**
- **Modular route registration** using `registerRoutes`
- **Automatic request logging** (status, duration, body preview)
- **Raw body capture** for secure verification (e.g., Webhooks)
- **JSON override middleware** to introspect responses
- **Shared server instance** (useful for WebSocket upgrades)
- **Integrated Vite dev mode**
- **Static build serving in production**
- **Railway-ready (PORT auto-detection)**
- **Typescript-first project**

---
---

## 🛠️ Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**

### Frontend Development
- **Vite** (only during development mode)

### Deployment
- **Railway**
- Auto picks `process.env.PORT`
- Works with `0.0.0.0` and production static serving

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Dipro-cyber/IntentWallet
cd IntentWallet
````

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run in Development Mode (with Vite)

```bash
npm run dev
```

This will:

* Start Express backend
* Start Vite dev server
* Enable hot-reload for frontend + API changes

---

## 4️⃣ Build for Production

```bash
npm run build
```

This generates the `dist/` directory.

---

## 5️⃣ Start Production Server

```bash
npm start
```

Runs the compiled Express server and serves static files.

---

## 📡 API Structure

All routes are loaded via:

```ts
registerRoutes(app)
```

You can add new API endpoints inside the `routes/` folder.

---

## 🔍 Logging

The server automatically logs:

* HTTP method
* Route
* Status code
* Duration
* Trimmed JSON response (first 80 chars)

Example:

```
POST /api/evaluate 200 in 23ms :: {"result":"ok"}…
```

---

## 🌐 Production Deployment (Railway)

Railway injects the correct port through:

```ts
const port = process.env.PORT || 5000;
```

✔ Fully compatible
✔ Auto-deploy on Git push
✔ Supports static frontend serving

Just push your repo — Railway handles the rest.

---

## 🧩 Environment Variables (Optional)

```
PORT=5000
NODE_ENV=development | production
```

---

## 🧪 Add Your Own Routes

Example route (inside `/routes/example.ts`):

```ts
export function exampleRoute(app) {
  app.get("/api/example", (req, res) => {
    res.json({ message: "hello world" });
  });
}
```

Then import it inside `registerRoutes`.

---

## 🏗️ Build Goal

The intention of IntentWallet is to provide a clean, scalable structure for:

* Intent-based APIs
* Wallet/payment integrations
* Signature or webhook validation
* Lightweight backend apps
* Vite-powered full-stack projects

---

## 🤝 Contributing

Pull requests are welcome!
Feel free to open Issues or suggest improvements.

---

## 📜 License

MIT License — free to use and modify.

---

## ⭐ Support

If this project helped you, consider giving the GitHub repo a **star** ⭐
It motivates future enhancements!

```

