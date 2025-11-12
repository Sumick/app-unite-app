# Implementation Plan - Quick Poll Creator

## Timeline: 40 minut (PoC)

---

## Phase 1: Project Setup (5 min) ✅

### Tasks
- [x] Init Next.js 15 project (App Router)
- [x] Setup TailwindCSS + configure design tokens
- [x] Configure TypeScript
- [x] Setup folder structure
- [x] Install dependencies (Prisma, UUID, Lucide React)
- [x] Git init + first commit

### Design System Setup
Configure `tailwind.config.ts` with design tokens:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '4xl': '2.25rem',
        '2xl': '1.5rem',
        'lg': '1.125rem',
        'base': '1rem',
        'sm': '0.875rem',
      },
      spacing: {
        '2': '0.5rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
      },
      borderRadius: {
        'md': '0.5rem',
        'lg': '0.75rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
```

Add Inter font to `app/layout.tsx`:
```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Deliverable
✅ Działający dev server na `localhost:3000` + design system skonfigurowany

---

## Phase 2: Database & Data Model (5 min)

### Tasks
- [ ] Setup Prisma with SQLite
- [ ] Define schema:
  - `Poll` model (id, question, options, createdAt)
  - `Vote` model (id, pollId, optionIndex, ipAddress, userAgent, votedAt)
- [ ] Run migrations
- [ ] Seed example poll (optional)

### Deliverable
✅ Database ready, models zdefiniowane

---

## Phase 3: API Routes (10 min)

### Tasks
- [ ] `POST /api/admin/polls` - tworzenie ankiety
- [ ] `GET /api/polls/[id]` - pobieranie ankiety
- [ ] `POST /api/polls/[id]/vote` - oddanie głosu
  - IP + User Agent check
  - Double voting prevention
- [ ] `GET /api/polls/[id]/results` - wyniki (polling endpoint)

### Deliverable
✅ Backend działa, można testować przez Postman/curl

---

## Phase 4: Admin Panel (8 min)

### Tasks
- [ ] `/admin` - PIN gate (hardcoded: 1234)
- [ ] `/admin/new` - formularz tworzenia ankiety
  - Input: pytanie
  - Input: 3-5 opcji (dynamic fields)
  - Button: Utwórz ankietę
- [ ] Po utworzeniu → redirect do `/poll/[id]` + copy link

### Deliverable
✅ Admin może tworzyć ankiety

---

## Phase 5: Public Voting Interface (8 min)

### Tasks
- [ ] `/poll/[id]` - widok ankiety
  - Wyświetl pytanie
  - Wyświetl opcje (radio buttons / cards)
  - Button: Zagłosuj
- [ ] Po głosowaniu → wyświetl wyniki
- [ ] Polling co 1s (useEffect) - live updates
- [ ] Error handling:
  - Poll not found
  - Already voted
  - Network errors

### Deliverable
✅ Voter może zagłosować i zobaczyć wyniki

---

## Phase 6: Results Display (3 min)

### Tasks
- [ ] Progress bars dla każdej opcji
- [ ] Procenty + liczba głosów
- [ ] Total votes counter
- [ ] Auto-refresh co 1s

### Deliverable
✅ Live results działają

---

## Phase 7: Polish & Testing (1 min)

### Tasks
- [ ] Mobile responsive check
- [ ] Loading states
- [ ] Basic styling (TailwindCSS)
- [ ] Quick manual test:
  - Utwórz ankietę
  - Zagłosuj z 2 urządzeń
  - Sprawdź double voting prevention
  - Sprawdź live updates

### Deliverable
✅ PoC gotowy do demo

---

## Out of Scope (MVP)

❌ Lista ankiet w admin panelu  
❌ Edycja/usuwanie ankiet  
❌ Export wyników (CSV/PDF)  
❌ Custom branding  
❌ Multi-language  
❌ Analytics  
❌ Email notifications  

---

## Tech Stack Summary

```
Frontend: Next.js 14 (App Router) + React + TailwindCSS
Backend: Next.js API Routes
Database: SQLite (Prisma ORM)
Deployment: Vercel
Auth: Hardcoded PIN (1234)
```

---

## Environment Variables

```env
# .env.local
ADMIN_PIN=1234
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Folder Structure

```
app-unite-rekrutacja-app/
├── docs/
│   ├── specification.md
│   ├── icp.md
│   ├── implementation-plan.md
│   └── progress.md
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── page.tsx (PIN gate)
│   │   │   └── new/
│   │   │       └── page.tsx (create poll)
│   │   ├── poll/
│   │   │   └── [id]/
│   │   │       └── page.tsx (voting + results)
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   └── polls/
│   │   │   │       └── route.ts
│   │   │   └── polls/
│   │   │       └── [id]/
│   │   │           ├── route.ts (GET poll)
│   │   │           ├── vote/
│   │   │           │   └── route.ts
│   │   │           └── results/
│   │   │               └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx (landing)
│   └── lib/
│       └── prisma.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Next Steps

1. ✅ Docs gotowe (specification, ICP, plan)
2. ⏳ **Zacznij implementację** → Phase 1: Project Setup
3. ⏳ Update `progress.md` po każdej fazie
