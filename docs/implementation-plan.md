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

## Phase 2: Core Components Library (8 min)

### Tasks
- [ ] `Button` component (primary, secondary, ghost variants)
- [ ] `Input` component (text input with label, error states)
- [ ] `Card` component (container z shadow, padding)
- [ ] `ProgressBar` component (dla wyników)
- [ ] `LoadingSpinner` component
- [ ] `ErrorMessage` component

### Component Specs
```typescript
// Button: primary (blue), secondary (gray), ghost (transparent)
// Input: label, placeholder, error message, onChange
// Card: children, className, padding variants
// ProgressBar: value (0-100), label, color
```

### Deliverable
✅ Reusable components gotowe w `/components/ui/`

---

## Phase 3: Admin PIN Gate Screen (5 min)

### Tasks
- [ ] `/admin` page
- [ ] PIN input (4 cyfry, numeric only)
- [ ] Walidacja (hardcoded: 1234)
- [ ] Error state: "Nieprawidłowy PIN"
- [ ] Success → redirect do `/admin/new`
- [ ] Mobile responsive

### UI Requirements
- Centered layout
- Large PIN input (numeric keyboard on mobile)
- Clear error messaging
- Loading state podczas walidacji

### Deliverable
✅ `/admin` - działający PIN gate (mock validation)

---

## Phase 4: Create Poll Screen (10 min)

### Tasks
- [ ] `/admin/new` page
- [ ] Form layout:
  - Input: Pytanie (required, max 200 chars)
  - Dynamic inputs: Opcje (3-5, add/remove buttons)
  - Button: Utwórz ankietę
- [ ] Client-side validation:
  - Pytanie nie może być puste
  - Min 3 opcje, max 5
  - Opcje nie mogą być puste
- [ ] Success state → pokazuje sharable link
- [ ] Copy to clipboard functionality
- [ ] Mobile responsive

### UI Requirements
- Clean form layout
- Add/remove option buttons (+ / -)
- Character counter dla pytania
- Disabled state gdy form invalid
- Success modal z linkiem do ankiety

### Deliverable
✅ `/admin/new` - formularz tworzenia ankiety (mock data, localStorage)

---

## Phase 5: Public Voting Screen (10 min)

### Tasks
- [ ] `/poll/[id]` page
- [ ] Layout:
  - Header: Logo/tytuł
  - Pytanie (large, centered)
  - Opcje (clickable cards/buttons)
  - Button: Zagłosuj (disabled until option selected)
- [ ] States:
  - Loading (fetching poll)
  - Voting (opcje aktywne)
  - Voted (pokazuje wyniki)
  - Already voted (pokazuje wyniki + info)
  - Error (poll not found)
- [ ] Mobile responsive (touch-friendly)

### UI Requirements
- Large, touch-friendly option cards
- Visual feedback on selection (border/background)
- Smooth transition voting → results
- Clear "Already voted" message

### Deliverable
✅ `/poll/[id]` - voting interface (mock data, localStorage dla voted state)

---

## Phase 6: Results Display (8 min)

### Tasks
- [ ] Results view (w tym samym `/poll/[id]`)
- [ ] Layout:
  - Pytanie (top)
  - Progress bars dla każdej opcji
  - Procenty + liczba głosów
  - Total votes counter
  - "Twój głos" indicator
- [ ] Mock polling (useEffect, 1s interval)
- [ ] Animacje (smooth progress bar updates)
- [ ] Mobile responsive

### UI Requirements
- Progress bars z labels (opcja + procent)
- Highlight wybranej opcji
- Total votes prominent
- Smooth animations (transition)

### Deliverable
✅ Results display z mock live updates

---

## Phase 7: Polish & Responsive (4 min)

### Tasks
- [ ] Mobile responsive check (wszystkie ekrany)
- [ ] Loading states consistency
- [ ] Error states consistency
- [ ] Animations polish (transitions, hover states)
- [ ] Accessibility basics:
  - Semantic HTML
  - Keyboard navigation
  - Focus states
  - ARIA labels gdzie potrzeba
- [ ] Manual test full flow:
  - Admin: PIN → create poll → copy link
  - Voter: open link → vote → see results
  - Voter 2: try to vote again → see "already voted"

### Deliverable
✅ Frontend complete - gotowy do pokazania klientowi

---

## Phase 8: Backend Integration (10 min)

**NOTE: Robimy dopiero po zatwierdzeniu UI przez klienta**

### Tasks
- [ ] Setup Prisma with SQLite
- [ ] Define schema (Poll, Vote models)
- [ ] Run migrations
- [ ] API Routes:
  - `POST /api/admin/polls` - create poll
  - `GET /api/polls/[id]` - get poll
  - `POST /api/polls/[id]/vote` - submit vote (IP + UA check)
  - `GET /api/polls/[id]/results` - get results
- [ ] Replace mock data z API calls
- [ ] IP + User Agent double voting prevention
- [ ] Error handling (network, validation)

### Deliverable
✅ Full-stack app działa end-to-end

---

## Phase 9: Final Testing & Deploy (5 min)

### Tasks
- [ ] End-to-end test (full user flow)
- [ ] Mobile test (iOS + Android)
- [ ] Edge cases:
  - Invalid poll ID
  - Network errors
  - Concurrent votes
- [ ] Deploy to Vercel
- [ ] Test production URL
- [ ] Share with stakeholders

### Deliverable
✅ PoC live w produkcji

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
