# DevAtlas — Deployment Configuration & Pipeline

> **Document:** `docs/deployment.md`  
> **Target:** Firebase Hosting + Cloud Functions 2nd Gen + Cloud Firestore + Cloud Storage

---

## 1. Build and Run Commands

```bash
# Development server (Local Vite)
npm run dev

# TypeScript typecheck and production build
npm run build

# Preview production build locally
npm run preview

# Deploy entire Firebase stack (Hosting, Functions, Rules, Indexes, Storage)
firebase deploy

# Deploy specific targets
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

---

## 2. Environment Variables Configuration

### Frontend Variables (`.env` or Cloud hosting env):
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=devatlas-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devatlas-app
VITE_FIREBASE_STORAGE_BUCKET=devatlas-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_USE_FIREBASE_EMULATORS=false
```

### Backend / Cloud Functions Secrets:
```bash
firebase functions:secrets:set OPENROUTER_API_KEY
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set GROQ_API_KEY
firebase functions:secrets:set GITHUB_TOKEN
```

---

## 3. Hosting Architecture

- **Single Page Application (SPA):** Static assets built to `dist/`, served with rewrites to `/index.html`.
- **API & Function Endpoints:** Functions 2nd Gen deployed in `us-central1` (or nearest region) handling callable RPCs.
