# DevAtlas — Security & Access Control Architecture

> **Document:** `docs/security.md`  
> **Status:** Production Security Blueprint  
> **Standards:** Principle of Least Privilege, Zero Client Secrets, SSRF-Resistant Scraper, Project-Level Isolation

---

## 1. Zero Client Secrets Policy

Under the new Firebase architecture:
1. **Frontend Bundle:** Contains **no LLM API keys**, no GitHub personal access tokens, and no webhook secrets.
2. **Configuration Exposed in Browser:** Only the public Firebase configuration keys (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.), which are client identifiers meant to be public under Firebase's security model.
3. **Privileged Keys:** Kept exclusively in Cloud Functions 2nd Gen server-side environments or Google Secret Manager (`OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `GITHUB_TOKEN`).
4. **Local Storage:** `localStorage` is completely stripped of any provider credentials or authentication tokens.

---

## 2. Cloud Firestore Security Rules

Project data is strictly partitioned using path-based multi-tenancy:
`projects/{projectId}/...`

### Rules Highlights:
- **Project Isolation:** A user can only read or write to `projects/{projectId}/...` if they have an active document in `projects/{projectId}/members/$(request.auth.uid)`.
- **Role-Based Permissions:**
  - `dev`: Full write on `tasks`, `decisions`, read on meetings.
  - `designer`: Write on `validationSessions`, `designTokens`, `figmaSpecs`.
  - `pm` / `all`: Write on `meetings`, `requirements`, `roadmap`.
  - `qa`: Write on `bugs`, `qaTestCases`, `securityAssessments`.
  - `ops`: Write on `releases`, `incidents`, `maintenance`.
- **Deny Unauthenticated:** Top-level default is `allow read, write: if false;`.
- **Self-Profile Only:** Users can only write to their own profile: `users/$(request.auth.uid)`.

---

## 3. Storage Security Rules

Binary files (PDFs, architecture diagrams, OpenAPI specifications) uploaded to Cloud Storage reside under:
`projects/{projectId}/files/{fileId}/{fileName}`

- **Access Guard:** Must be authenticated and belong to `projects/{projectId}/members/$(request.auth.uid)`.
- **Size Limit:** Max 25MB per file.
- **Type Guard:** Restricted to `application/pdf`, `image/*`, `application/json`, `text/markdown`, `text/plain`.

---

## 4. SSRF & Web Scraper Defenses

The Deployed Site Scraper (`scrapeSiteMetadata`) runs inside Cloud Functions 2nd Gen and implements strict SSRF defenses:
1. **Protocol Check:** Only `http:` and `https:` URLs are accepted. `file:`, `data:`, `javascript:`, `vbscript:`, and `ftp:` are rejected immediately.
2. **Private IP & Loopback Filter:** Hostnames resolving to `localhost`, `127.0.0.1`, `0.0.0.0`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16` (metadata service), or IPv6 equivalents are blocked before making any socket connection.
3. **Size & Timeout Clamps:** Max response body size of 1MB; max timeout of 6,000ms.
4. **Redirect Limits:** Max 3 redirects; each redirect target is re-validated against the private IP blocklist.

---

## 5. AI Prompt Injection & Untrusted Data Sanitization

1. Meeting notes, discussions, and external GitHub README files are treated as **untrusted data**.
2. Context builder wraps retrieved project data in unambiguous delimiters (`<project_context>`, `<untrusted_content>`) and injects mandatory system invariants preventing override instructions.
