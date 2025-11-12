# Design System - Quick Poll Creator

## Target Audience
**Maria, 47, Kierownik Działu Komunikacji Społecznej**
- Przeciążona pracą, nie-techniczna
- Potrzebuje narzędzi które "po prostu działają"
- Musi wyglądać profesjonalnie przed radą miasta

## Emotional Goals

**First 10s:** "To wygląda poważnie i profesjonalnie" (nie startup toy, nie Google Forms)  
**Creating poll:** "Wow, to naprawdę proste" (zero zagubienia)  
**Watching results:** "Mieszkańcy głosują! To działa!" (ekscytacja + zaufanie)  
**Showing boss:** "Nie wstydzę się tego pokazać" (profesjonalny output)

---

## Colors

```css
/* Primary - Trust Blue */
--primary-600: #2563eb;  /* Buttons, links */
--primary-700: #1d4ed8;  /* Hover */
--primary-50:  #eff6ff;  /* Backgrounds */

/* Feedback */
--success-600: #16a34a;  /* "Zagłosowano" */
--warning-600: #d97706;  /* "Już głosowałeś" */
--error-600:   #dc2626;  /* Errors */

/* Neutrals */
--gray-900: #111827;  /* Headings */
--gray-700: #374151;  /* Body text */
--gray-500: #6b7280;  /* Secondary */
--gray-300: #d1d5db;  /* Borders */
--gray-100: #f3f4f6;  /* Subtle bg */
--gray-50:  #f9fafb;  /* Page bg */
```

**Rationale:** Niebieski = zaufanie, instytucje, stabilność. Nie za jasny (nie startup), nie za ciemny (nie korporacja).

---

## Typography

```css
/* Font */
font-family: 'Inter', system-ui, sans-serif;

/* Scale */
--text-4xl: 2.25rem;  /* Page titles */
--text-2xl: 1.5rem;   /* Poll question */
--text-lg:  1.125rem; /* Important text */
--text-base: 1rem;    /* Default */
--text-sm:  0.875rem; /* Secondary */

/* Weights */
--font-normal:   400;
--font-semibold: 600;  /* Buttons, labels */
--font-bold:     700;  /* Headings */
```

**Rationale:** Inter = czytelny, profesjonalny, doskonały na ekranach.

---

## Spacing & Layout

```css
/* Base: 4px */
--space-2: 0.5rem;   /* 8px - tight */
--space-4: 1rem;     /* 16px - default */
--space-6: 1.5rem;   /* 24px - cards */
--space-8: 2rem;     /* 32px - sections */
--space-12: 3rem;    /* 48px - page spacing */

/* Containers */
--container-sm: 640px;   /* Forms */
--container-md: 768px;   /* Poll page */
--container-lg: 1024px;  /* Dashboard */
```

**Philosophy:** Więcej whitespace = więcej clarity. Szczególnie dla nie-technicznych użytkowników.

---

## Components

### Buttons

```css
/* Primary */
background: var(--primary-600);
color: white;
padding: 0.75rem 1.5rem;
border-radius: 0.5rem;
font-weight: 600;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);

/* Hover */
background: var(--primary-700);
transform: translateY(-1px);
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
```

**Usage:** "Utwórz ankietę", "Zagłosuj"

### Cards

```css
background: white;
border-radius: 0.75rem;
padding: 1.5rem;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
border: 1px solid var(--gray-200);

/* Hover (if interactive) */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
transform: translateY(-2px);
```

### Progress Bars (Results)

```css
/* Container */
background: var(--gray-100);
border-radius: 9999px;
height: 2rem;  /* Duży = czytelny */

/* Fill */
background: var(--primary-600);
transition: width 0.5s ease-out;  /* Smooth */
```

### Forms

```css
/* Input */
border: 1px solid var(--gray-300);
border-radius: 0.5rem;
padding: 0.75rem 1rem;

/* Focus */
border-color: var(--primary-600);
outline: 2px solid var(--primary-50);
```

---

## Responsive

```css
/* Breakpoints */
--screen-sm: 640px;   /* Phones */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktop */

/* Touch targets: min 44x44px */
```

---

## Icons

**Library:** Lucide React (minimalistyczny, profesjonalny)

```tsx
import { Plus, Copy, Share2, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
```

---

## Tone of Voice

**Characteristics:** Jasny, pewny, pomocny, profesjonalny

```
✅ "Ankieta utworzona!"
✅ "Link skopiowany"
✅ "Głos oddany pomyślnie"

❌ "Nie udało się utworzyć ankiety. Spróbuj ponownie."
❌ "Już zagłosowałeś w tej ankiecie"

💡 "Link możesz udostępnić na Facebooku, emailem lub SMS-em"
💡 "Wyniki aktualizują się automatycznie co sekundę"
```

**Do:** "Utwórz ankietę", "Zagłosuj", "Zobacz wyniki"  
**Don't:** "Submit", "OK", "Click here"

---

## Key Screens

### Admin Dashboard
```
Header: "Twoje ankiety"
[+ Utwórz nową ankietę] (Primary button)

Grid of poll cards:
┌──────────────────────┐
│ Pytanie ankiety...   │
│ 🗳️ 234 głosy         │
│ [Kopiuj] [Wyniki]   │
└──────────────────────┘
```

### Poll Voting (Before)
```
Pytanie ankiety?

○ Opcja 1
○ Opcja 2
○ Opcja 3

[Zagłosuj] (disabled until selection)

👥 234 osób już zagłosowało
```

### Poll Results (After)
```
Pytanie ankiety?

████████░░ Opcja 1    45% (105)
██████░░░░ Opcja 2    30% (70)
█████░░░░░ Opcja 3    25% (59)

✅ Dziękujemy za głos!
Wyniki aktualizują się na żywo

👥 234 głosy
```

---

## Accessibility

- **Contrast:** WCAG AA (4.5:1 minimum)
- **Keyboard:** Tab order, focus visible, Enter/Space
- **Screen readers:** Semantic HTML, ARIA labels
- **Touch:** 44x44px minimum

---

## Performance

- Font display: swap (avoid FOIT)
- Lazy load below fold
- Code splitting (Next.js auto)
- Purge unused CSS

---

## Brand Personality

**If our app was a person:**
- 35-40 lat (doświadczony, nie przestarzały)
- Konsultant samorządowy
- Kompetentny, pomocny, profesjonalny, pewny siebie
- "Pomogę Ci to zrobić" nie "Musisz to zrobić"

---

## Competitive Edge

**vs Google Forms:** Profesjonalny + live results + dedicated UI  
**vs SurveyMonkey:** Prostszy + szybszy + polski  
**vs Mentimeter:** Bardziej formal + dla instytucji + trwałe linki

---

**Status:** Ready for implementation  
**Date:** 2025-11-12
