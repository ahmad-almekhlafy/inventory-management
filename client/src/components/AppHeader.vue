<template>
  <header class="app-header">
    <button
      class="menu-btn"
      type="button"
      aria-label="Open navigation menu"
      @click="$emit('open-drawer')"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </button>

    <h1 class="page-title">{{ title }}</h1>

    <div class="filters-slot">
      <slot name="filters" />
    </div>
    <div class="controls-slot">
      <slot name="controls" />
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { navItems } from '../composables/useNav'

export default {
  name: 'AppHeader',
  emits: ['open-drawer'],
  setup() {
    const route = useRoute()
    const { t } = useI18n()

    // Title comes from the same nav array/keys as the sidebar so it follows the locale
    const title = computed(() => {
      const item = navItems.find((n) => n.to === route.path)
      if (!item) return ''
      return item.labelKey ? t(item.labelKey) : item.label
    })

    return { title }
  }
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: var(--space-4);
  padding: 0 var(--content-pad);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.page-title {
  flex: 1;
  min-width: 0;
  height: var(--header-h);
  display: flex;
  align-items: center;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.controls-slot {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
  height: var(--header-h);
}

/* Filters sit in a slim second row so four selects never crowd the title */
.filters-slot {
  order: 3;
  flex-basis: 100%;
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: var(--space-2) 0;
  border-top: 1px solid var(--gray-100);
}

.menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-right: calc(var(--space-2) * -1);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--gray-600);
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-btn {
    display: inline-flex;
  }
  .profile-name-hide {
    display: none;
  }
}
</style>
