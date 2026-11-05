# SaaS Design System Reference

The defaults below produce a calm, professional, product-grade look. If the project already defines a palette or brand colors, keep its values and map them onto these token names. The names and the scale matter more than the exact hex codes.

## Contents
1. Tokens (paste into `:root`)
2. Spacing rules
3. Typography
4. Component specs: sidebar, header, page header, cards, tables, buttons, badges, inputs, modals
5. Icons
6. Dark sidebar variant

---

## 1. Tokens

```css
:root {
  /* Spacing: 4px base. Use only these values. */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Neutrals (slate) */
  --gray-50:  #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  /* Semantic */
  --color-bg: var(--gray-50);          /* app background */
  --color-surface: #ffffff;            /* cards, header, sidebar */
  --color-border: var(--gray-200);
  --color-border-strong: var(--gray-300);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-500);
  --color-text-subtle: var(--gray-400);

  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-soft: #eff6ff;

  --color-success: #16a34a;  --color-success-soft: #f0fdf4;
  --color-warning: #d97706;  --color-warning-soft: #fffbeb;
  --color-danger:  #dc2626;  --color-danger-soft:  #fef2f2;
  --color-info:    #2563eb;  --color-info-soft:    #eff6ff;

  /* Radius */
  --radius-sm: 6px;   /* inputs, buttons, badges */
  --radius-md: 8px;   /* nav items, small cards */
  --radius-lg: 12px;  /* cards, modals */

  /* Elevation: keep it subtle. Borders do most of the work. */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-md: 16px;
  --text-lg: 20px;
  --text-xl: 24px;

  /* Layout */
  --sidebar-w: 240px;
  --sidebar-w-collapsed: 64px;
  --header-h: 60px;
  --content-max-w: 1440px;
  --content-pad: var(--space-8);

  /* Z-index */
  --z-sidebar: 40;
  --z-header: 30;
  --z-dropdown: 50;
  --z-drawer-backdrop: 60;
  --z-drawer: 70;
  --z-modal: 100;

  --transition: 150ms ease;
}

@media (max-width: 768px) {
  :root { --content-pad: var(--space-4); }
}
```

Base styles:

```css
body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

## 2. Spacing rules

- Page container: `padding: var(--content-pad)`, `max-width: var(--content-max-w)`, `margin: 0 auto`.
- Gap between page sections and cards: `var(--space-6)`.
- Card padding: `var(--space-6)` (`var(--space-4)` for dense stat tiles).
- Gap between a heading and its content: `var(--space-4)`.
- Form field gap: `var(--space-4)`. Label-to-input gap: `var(--space-2)`.
- Use `gap` on grid/flex containers instead of margins on children. Margins on children cause the uneven spacing this redesign is meant to remove.

## 3. Typography

| Use | Size | Weight | Color |
|---|---|---|---|
| Page title (header) | `--text-lg` | 600 | `--color-text` |
| Section / card title | `--text-md` | 600 | `--color-text` |
| Body, table cells | `--text-base` | 400 | `--color-text` |
| Secondary text | `--text-sm` | 400 | `--color-text-muted` |
| Labels, table headers, sidebar section labels | `--text-xs` | 600, uppercase, `letter-spacing: 0.04em` | `--color-text-muted` |
| KPI numbers | `--text-xl` | 600, `font-variant-numeric: tabular-nums` | `--color-text` |

Use `tabular-nums` anywhere numbers line up in columns (tables, KPIs).

## 4. Component specs

### Sidebar
- `background: var(--color-surface)`, `border-right: 1px solid var(--color-border)`, `padding: var(--space-4) var(--space-3)`.
- Brand block at the top: height `var(--header-h)` so it lines up with the header, product name at `--text-md`/600, optional subtitle at `--text-xs` muted.
- Nav item: `display: flex; align-items: center; gap: var(--space-3); height: 36px; padding: 0 var(--space-3); border-radius: var(--radius-md); color: var(--gray-600); font-weight: 500;`
  - hover: `background: var(--gray-100); color: var(--color-text)`
  - active: `background: var(--color-primary-soft); color: var(--color-primary)`, icon in the same color
- 2px gap between items, `var(--space-6)` between groups.
- Collapsed: hide labels and section titles, center icons, keep the same 36px item height.

### Header
- `height: var(--header-h)`, `background: var(--color-surface)`, `border-bottom: 1px solid var(--color-border)`, `position: sticky; top: 0; z-index: var(--z-header)`.
- `padding: 0 var(--content-pad)`, flex with `justify-content: space-between`, `gap: var(--space-4)`.
- Inline filter selects: height 32px, `--text-sm`, compact label above or placeholder-style label inside.

### Page header (inside content, optional)
- Title is already in the app header, so the page header usually holds only a short description and page-level actions. Remove duplicated `<h2>` page titles from views, or demote them to a description line.

### Cards
```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  padding: var(--space-6);
}
```
Card header: title on the left, actions or links on the right, `margin-bottom: var(--space-4)`.

### Tables
- Header row: `--text-xs` uppercase muted, `background: var(--gray-50)`, `border-bottom: 1px solid var(--color-border)`.
- Cells: `padding: var(--space-3) var(--space-4)`, `border-bottom: 1px solid var(--gray-100)`. No vertical borders.
- Row hover: `background: var(--gray-50)`. Right-align numeric columns.
- Put the table inside a card with `padding: 0; overflow: hidden` so the corners stay rounded. If the table can overflow horizontally, give it its own `overflow-x: auto` wrapper.

### Buttons
| Variant | Style |
|---|---|
| Primary | `background: var(--color-primary); color: #fff` (hover `--color-primary-hover`) |
| Secondary | `background: var(--color-surface); border: 1px solid var(--color-border-strong); color: var(--color-text)` (hover `--gray-50`) |
| Ghost | transparent, `color: var(--gray-600)` (hover `--gray-100`) |
| Danger | `background: var(--color-danger); color: #fff` |

All buttons: `height: 34px` (28px for small), `padding: 0 var(--space-4)`, `border-radius: var(--radius-sm)`, `font-weight: 500`, `--text-sm`, `transition: background var(--transition)`.

### Badges / status pills
`display: inline-flex; padding: 2px var(--space-2); border-radius: 999px; font-size: var(--text-xs); font-weight: 600;` with each status's `-soft` background and full-strength text color. Map statuses consistently (delivered/success = green, in progress/shipped = blue, pending/warning = amber, failed/backordered/critical = red) and use the same mapping on every page.

### Inputs and selects
`height: 34px; padding: 0 var(--space-3); border: 1px solid var(--color-border-strong); border-radius: var(--radius-sm); background: var(--color-surface); font-size: var(--text-sm);` On focus: `border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft)`.

### Modals
- Backdrop: `rgba(15, 23, 42, 0.45)`, `z-index: var(--z-modal)`.
- Panel: `--radius-lg`, `--shadow-lg`, `max-width: 560px` (720-900px for detail views), header/body/footer separated by borders, `padding: var(--space-6)`.
- Footer buttons right-aligned, secondary before primary.

## 5. Icons

Use inline SVG (24x24 viewBox, `stroke="currentColor"`, `stroke-width="1.75"`, `fill="none"`, rendered at 18px), so icons inherit the nav item's color in every state. Keep one icon map in the sidebar component. Don't use emojis as icons, and don't add an icon library without asking.

Paths for common nav concepts (Lucide-style, MIT):

```js
const icons = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  inventory: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  orders: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  finance: '<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  trends: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  reports: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  collapse: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
}
```

Render with `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="icons[item.icon]" aria-hidden="true" />`. `v-html` is safe here only because the strings are static constants. Never feed it user data.

## 6. Dark sidebar variant (optional)

If the user wants more contrast between navigation and content, use `background: var(--gray-900)` for the sidebar, nav text `var(--gray-400)`, hover `background: var(--gray-800); color: #fff`, and active `background: var(--gray-800); color: #fff` with a 2px primary-colored indicator on the left. Keep the header and content light.
