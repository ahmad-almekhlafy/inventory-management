// Single source of truth for navigation: used by the sidebar and the header title.
// Same order as the old top nav. Reports had no i18n key, so it keeps a plain label.
export const navItems = [
  { to: '/', labelKey: 'nav.overview', icon: 'dashboard' },
  { to: '/inventory', labelKey: 'nav.inventory', icon: 'inventory' },
  { to: '/orders', labelKey: 'nav.orders', icon: 'orders' },
  { to: '/spending', labelKey: 'nav.finance', icon: 'finance' },
  { to: '/demand', labelKey: 'nav.demandForecast', icon: 'trends' },
  { to: '/reports', label: 'Reports', icon: 'reports' }
]
