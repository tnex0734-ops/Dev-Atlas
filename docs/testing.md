# DevAtlas — Testing Guide & Verification Matrix

> **Document:** `docs/testing.md`  
> **Frameworks:** Vitest + React Testing Library + Firebase Emulators

---

## 1. Test Execution Commands

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests against Firebase Emulator Suite
firebase emulators:exec "npm run test"
```

---

## 2. Test Coverage Matrix

1. **Link Resolver:** Verification that all internal entity types (`decision`, `meeting`, `task`, `memory`, `finding`, `prd`) map to valid active views.
2. **Deterministic Grounded Reasoner:** Validates query keyword matching, source citation extraction, and non-hallucinatory entity retrieval.
3. **Repository Mappers:** Ensures bidirectional conversion between Firestore documents and TypeScript domain interfaces.
4. **Offline Fallback Engine:** Guarantees graceful degradation when network connectivity is lost.
5. **Security Defenses:** Verifies SSRF URL validation and untrusted payload escaping.
