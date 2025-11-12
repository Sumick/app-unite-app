# Quick Poll Creator - Specyfikacja Projektowa

## 1. Kontekst Biznesowy

**Klient:** Lokalny urząd miasta  
**Problem:** Potrzeba szybkiego zbierania opinii mieszkańców na temat inicjatyw lokalnych  
**Cel:** Prosty MVP do tworzenia ankiet z natychmiastowymi wynikami  
**Timeline:** 40 minut (Proof of Concept)

### Założenia Biznesowe
- Spodziewana liczba respondentów: 100-500 na ankietę
- Typ ankiet: proste, jedno pytanie z wieloma opcjami
- Użytkowanie: desktop + mobile
- Model: "fire and forget" - brak potrzeby długoterminowej historii

---

## 2. Wymagania Funkcjonalne

### 2.1 Core Features

#### Admin Panel
- **Tworzenie ankiety:**
  - Jedno pytanie (tekst)
  - 3-5 opcji odpowiedzi
  - Generowanie unikalnego, sharable linka
  - Dostęp chroniony 4-cyfrowym PIN-em (hardcoded w MVP)
  
- **Lista ankiet:**
  - Widok wszystkich utworzonych ankiet
  - Dostęp do linków do głosowania
  - Dostęp do wyników każdej ankiety

#### Publiczne Głosowanie
- **Bez logowania** - każdy może zagłosować
- **Jedna opcja** - single choice voting
- **Natychmiastowe wyniki** po oddaniu głosu
- **Live updates** - polling co 1 sekundę

#### Wyniki
- Procenty dla każdej opcji
- Liczba głosów (total + per option)
- Real-time aktualizacja (client-side polling)

### 2.2 Ograniczenia i Zabezpieczenia

#### Double Voting Prevention
**Strategia:** IP + User Agent fingerprinting
- Jeden głos z danego IP na daną ankietę
- Dodatkowe rozróżnienie po User Agent (urządzenie/przeglądarka)
- **Twarde blokowanie** - brak możliwości ponownego głosowania
- Komunikat: "Już zagłosowałeś w tej ankiecie"

**Implementacja:**
```
vote_record = {
  poll_id: string,
  ip_address: string,
  user_agent: string,
  voted_at: timestamp
}
```

---

## 3. Architektura Techniczna

### 3.1 Tech Stack

**Framework:** Next.js 15+ (App Router)
- Najszybszy deployment (Vercel)
- API Routes wbudowane
- SSR/SSG out of the box
- Excellent DX dla MVP

**Database:** SQLite (local) → PostgreSQL (production ready)
- Zero setup dla PoC
- Łatwa migracja do Postgres
- Wystarczające dla 100-500 respondentów

**Styling:** TailwindCSS
- Szybki development
- Responsive by default
- Minimal bundle size

**State Management:** React hooks (useState, useEffect)
- Brak potrzeby Redux/Zustand dla prostego MVP
- Polling implementowany przez useEffect

### 3.2 Data Model

```typescript
// Poll
{
  id: string (uuid),
  question: string,
  options: string[], // 3-5 opcji
  created_at: timestamp,
  share_url: string // /poll/:id
}

// Vote
{
  id: string (uuid),
  poll_id: string (FK),
  option_index: number, // index wybranej opcji
  ip_address: string,
  user_agent: string,
  voted_at: timestamp
}

// Vote Record (prevention)
{
  poll_id: string,
  ip_address: string,
  user_agent: string,
  voted_at: timestamp
}
```

### 3.3 API Endpoints

```
POST   /api/admin/auth          - weryfikacja PIN
POST   /api/admin/polls         - tworzenie ankiety
GET    /api/admin/polls         - lista wszystkich ankiet

GET    /api/polls/:id           - pobieranie ankiety
POST   /api/polls/:id/vote      - oddanie głosu
GET    /api/polls/:id/results   - wyniki (polling endpoint)
```

### 3.4 Routing

```
/admin              - panel admina (PIN gate)
/admin/new          - tworzenie nowej ankiety
/admin/polls        - lista ankiet

/poll/:id           - publiczny widok ankiety + głosowanie
/poll/:id/results   - publiczne wyniki (lub w tym samym widoku)
```

---

## 4. User Flows

### 4.1 Admin Flow
1. Wchodzi na `/admin`
2. Podaje 4-cyfrowy PIN
3. Widzi dashboard z listą ankiet
4. Klika "Utwórz nową ankietę"
5. Wypełnia pytanie + 3-5 opcji
6. Dostaje sharable link: `https://app.com/poll/abc123`
7. Kopiuje i udostępnia mieszkańcom

### 4.2 Voter Flow
1. Otwiera link `https://app.com/poll/abc123`
2. Widzi pytanie i opcje
3. Wybiera jedną opcję
4. Klika "Zagłosuj"
5. Widzi natychmiastowe wyniki (procenty + liczby)
6. Wyniki aktualizują się co 1s (polling)

### 4.3 Double Vote Attempt
1. User próbuje zagłosować ponownie
2. System wykrywa IP + User Agent
3. Wyświetla komunikat: "Już zagłosowałeś w tej ankiecie"
4. Pokazuje aktualne wyniki (read-only)

---

## 5. UI/UX Requirements

### 5.1 Responsive Design
- Mobile-first approach
- Breakpoints: 640px (mobile), 1024px (desktop)
- Touch-friendly buttons (min 44x44px)

### 5.2 Admin Panel
- Minimalistyczny design
- Lista ankiet w formie cards
- Copy-to-clipboard dla share links
- Szybki dostęp do wyników

### 5.3 Voting Interface
- Czytelne pytanie (duża czcionka)
- Opcje jako duże, klikalne karty/buttony
- Loading state podczas głosowania
- Smooth transition do wyników

### 5.4 Results Display
- Progress bars dla każdej opcji
- Procenty + liczba głosów
- Total votes counter
- Subtle animation przy update (polling)

---

## 6. Poza Scope (MVP)

Następujące funkcjonalności **NIE** są częścią MVP:

- ❌ Edycja ankiet
- ❌ Usuwanie ankiet
- ❌ Zamykanie ankiet (lifecycle)
- ❌ Eksport wyników (CSV/PDF)
- ❌ Zaawansowana analityka
- ❌ Multi-question surveys
- ❌ User authentication (poza admin PIN)
- ❌ Email notifications
- ❌ Scheduled polls
- ❌ Custom branding

---

## 7. Success Metrics (PoC)

### Must Have
- ✅ Admin może utworzyć ankietę w <30s
- ✅ Voter może zagłosować w <10s
- ✅ Wyniki widoczne natychmiast po głosowaniu
- ✅ Double voting prevention działa (IP + UA)
- ✅ Responsive na mobile i desktop
- ✅ Sharable link działa

### Nice to Have
- ✅ Smooth UX (loading states, transitions)
- ✅ Error handling (network errors, invalid poll ID)
- ✅ Accessibility basics (semantic HTML, keyboard nav)

---

## 8. Deployment Strategy

**Target:** Vercel (Next.js native)
- Push to GitHub
- Connect Vercel
- Auto-deploy on push
- Environment variables dla PIN + DB

**Database:**
- MVP: SQLite (local file)
- Production: Vercel Postgres lub Supabase

**Estimated Deploy Time:** <5 minut

---

## 9. Known Limitations & Trade-offs

### IP-based Voting
**Limitation:** Cała rodzina/biuro z jednego IP = jeden głos  
**Trade-off:** Prostota implementacji vs. dokładność  
**Mitigation:** User Agent fingerprinting dodaje rozróżnienie urządzeń

### Polling vs WebSockets
**Limitation:** 1s polling = więcej requestów  
**Trade-off:** Prostota vs. efektywność  
**Mitigation:** Dla 100-500 userów to akceptowalne

### Hardcoded PIN
**Limitation:** Jeden PIN dla wszystkich adminów  
**Trade-off:** Zero auth complexity vs. security  
**Mitigation:** PoC only - production wymaga proper auth

### No Poll Lifecycle
**Limitation:** Ankiety zawsze "active"  
**Trade-off:** Prostota vs. kontrola  
**Mitigation:** Future feature - draft/active/closed states

---

## 10. Next Steps (Post-MVP)

1. **ICP Definition** - dla kogo dokładnie budujemy
2. **Technical Implementation** - setup projektu
3. **Core Features** - voting + results
4. **Admin Panel** - tworzenie ankiet
5. **Polish & Deploy** - UX improvements + Vercel

---

## Appendix: Environment Variables

```env
# Admin Access
ADMIN_PIN=1234

# Database
DATABASE_URL=file:./dev.db  # SQLite for MVP

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**Wersja:** 1.0  
**Data:** 2025-11-12  
**Status:** Draft - Ready for ICP Definition
