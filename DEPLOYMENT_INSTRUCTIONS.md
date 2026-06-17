# RentEase Deployment Instructions

This guide explains how to deploy the RentEase platform to production using **MongoDB Atlas**, **Render**, and **Vercel**.

---

## 1. Database Setup: MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Shared Cluster (Free tier).
3. Under **Database Access**, create a database user with Read/Write privileges.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) since Render IPs rotate dynamically.
5. Navigate to **Clusters** > **Connect** > **Drivers** and copy the Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/rentease?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment: Render

1. Log in to [Render](https://render.com).
2. Click **New** > **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service:
   * **Name:** `rentease-backend`
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Under **Environment Variables**, add the following configs:
   * `PORT`: `5000` (or Render will bind automatically)
   * `MONGODB_URI`: *Your MongoDB Atlas Connection String*
   * `JWT_SECRET`: *A secure random string (e.g. `d83ha9d7211bf7386d...`)*
   * `NODE_ENV`: `production`
6. Click **Deploy Web Service**. Render will build and provide a public URL: `https://rentease-backend.onrender.com`.

### Seeding the Production Database (Optional)
To seed products and test data into your MongoDB Atlas cluster:
1. Locally in `/backend/.env`, replace the local `MONGODB_URI` with your production MongoDB Atlas Connection String.
2. Run `npm run seed` from your local terminal backend directory.
3. Verify that items appear in Atlas, then restore your local `.env` values.

---

## 3. Frontend Deployment: Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** and import your Git repository.
3. Configure the Project:
   * **Root Directory:** `frontend`
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL`: *Your Render Backend URL* (e.g., `https://rentease-backend.onrender.com/api`)
5. Click **Deploy**. Vercel will build your static files and deploy them.

---

## 4. Local Run Commands

If you want to run the whole application locally:

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to test the app.
