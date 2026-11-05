<template>
  <aside class="sidebar" :class="{ collapsed, 'drawer-open': drawerOpen, overlay }">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">C</div>
      <div class="brand-text">
        <span class="brand-name">{{ t('nav.companyName') }}</span>
        <span class="brand-sub">{{ t('nav.subtitle') }}</span>
      </div>
    </div>

    <nav class="nav" aria-label="Main navigation">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :active-class="item.to === '/' ? '' : 'active'"
        exact-active-class="active"
        :title="collapsed ? labelFor(item) : undefined"
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          v-html="icons[item.icon]"
        />
        <span class="nav-label">{{ labelFor(item) }}</span>
      </router-link>
    </nav>

    <button
      class="collapse-btn"
      type="button"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="String(!collapsed)"
      @click="$emit('toggle-collapse')"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        :class="{ flipped: collapsed }"
        v-html="icons.collapse"
      />
      <span class="nav-label">Collapse</span>
    </button>
  </aside>
</template>

<script>
import { useI18n } from '../composables/useI18n'
import { navItems } from '../composables/useNav'

// Static trusted constants only: these strings are rendered with v-html
const icons = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  inventory: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  orders: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  finance: '<line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  trends: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  reports: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
  collapse: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'
}

export default {
  name: 'AppSidebar',
  props: {
    collapsed: { type: Boolean, default: false },
    drawerOpen: { type: Boolean, default: false },
    overlay: { type: Boolean, default: false }
  },
  emits: ['toggle-collapse', 'close-drawer'],
  setup() {
    const { t } = useI18n()
    const labelFor = (item) => (item.labelKey ? t(item.labelKey) : item.label)
    return { t, icons, navItems, labelFor }
  }
}
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: 0 var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  z-index: var(--z-sidebar);
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: var(--header-h);
  flex-shrink: 0;
  margin: 0 calc(var(--space-3) * -1);
  padding: 0 var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.brand-mark {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--gray-900);
  color: #fff;
  font-weight: 600;
  font-size: var(--text-sm);
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-sub {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
}

.nav-item,
.collapse-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 36px;
  padding: 0 var(--space-3);
  border-radius: var(--radius-md);
  color: var(--gray-600);
  font-family: inherit;
  font-size: var(--text-base);
  font-weight: 500;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--transition), color var(--transition);
}

.nav-item svg,
.collapse-btn svg {
  flex-shrink: 0;
}

.nav-item:hover,
.collapse-btn:hover {
  background: var(--gray-100);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* Keyboard focus ring drawn inside: the sidebar clips overflow */
.nav-item:focus-visible,
.collapse-btn:focus-visible {
  outline-offset: -2px;
}

.collapse-btn svg.flipped {
  transform: rotate(180deg);
}

/* Collapsed rail (desktop only): hide text, center icons */
.sidebar.collapsed:not(.drawer-open) .nav-label,
.sidebar.collapsed:not(.drawer-open) .brand-text {
  display: none;
}

.sidebar.collapsed:not(.drawer-open) .nav-item,
.sidebar.collapsed:not(.drawer-open) .collapse-btn {
  justify-content: center;
  padding: 0;
}

.sidebar.collapsed:not(.drawer-open) .brand {
  justify-content: center;
  padding: 0;
}

/* Tablet: fixed rail width. Expanding is an overlay that grows past the
   64px grid column, so the content column never reflows. */
@media (min-width: 769px) and (max-width: 1279px) {
  .sidebar {
    width: var(--sidebar-w-collapsed);
    transition: width 200ms ease, box-shadow 200ms ease;
  }

  .sidebar.overlay {
    width: var(--sidebar-w);
    z-index: var(--z-drawer);
    box-shadow: 4px 0 16px rgba(15, 23, 42, 0.08);
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: var(--sidebar-w);
    transform: translateX(-100%);
    transition: transform 200ms ease;
    z-index: var(--z-drawer);
    box-shadow: var(--shadow-lg);
  }

  .sidebar.drawer-open {
    transform: translateX(0);
  }

  .collapse-btn {
    display: none;
  }
}
</style>
