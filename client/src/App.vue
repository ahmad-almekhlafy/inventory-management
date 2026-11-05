<template>
  <div class="app-shell" :class="{ collapsed: shellCollapsed }">
    <AppSidebar
      :collapsed="effectiveCollapsed"
      :drawer-open="drawerOpen"
      :overlay="overlayOpen"
      @toggle-collapse="toggleCollapse"
      @close-drawer="drawerOpen = false"
    />
    <div
      v-if="drawerOpen"
      class="drawer-backdrop"
      aria-hidden="true"
      @click="drawerOpen = false"
    ></div>
    <div
      v-if="overlayOpen"
      class="overlay-backdrop"
      aria-hidden="true"
      @click="overlayOpen = false"
    ></div>

    <div class="app-column">
      <AppHeader @open-drawer="drawerOpen = true">
        <template #filters>
          <FilterBar />
        </template>
        <template #controls>
          <LanguageSwitcher />
          <ProfileMenu
            @show-profile-details="showProfileDetails = true"
            @show-tasks="showTasks = true"
          />
        </template>
      </AppHeader>
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import { useBreakpoint } from './composables/useBreakpoint'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher,
    AppSidebar,
    AppHeader
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])
    const route = useRoute()

    const sidebarCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
    const drawerOpen = ref(false)

    const overlayOpen = ref(false)
    const { isMobile, isTablet } = useBreakpoint()

    // sidebarCollapsed is only the saved desktop preference. The tier decides
    // what is actually shown, so there is a single source of truth per tier.
    // Tablet: always a rail, unless the transient overlay is open.
    const effectiveCollapsed = computed(() => {
      if (isMobile.value) return false
      if (isTablet.value) return !overlayOpen.value
      return sidebarCollapsed.value
    })
    // Content column width: the overlay floats above the content, so on tablet
    // the column stays at rail width even while the overlay is open.
    const shellCollapsed = computed(() => isTablet.value || sidebarCollapsed.value)

    const toggleCollapse = () => {
      if (isTablet.value) {
        // Temporary expand only: must not overwrite the saved desktop preference
        overlayOpen.value = !overlayOpen.value
        return
      }
      sidebarCollapsed.value = !sidebarCollapsed.value
      localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
    }

    const closeTransient = () => {
      drawerOpen.value = false
      overlayOpen.value = false
    }

    // Close the drawer/overlay after navigating so it never covers the new page
    watch(() => route.fullPath, closeTransient)
    // Crossing a breakpoint resets transient state so nothing is left stuck open
    watch([isMobile, isTablet], closeTransient)

    const onKeydown = (e) => {
      if (e.key === 'Escape') closeTransient()
    }
    onMounted(() => window.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      effectiveCollapsed,
      shellCollapsed,
      overlayOpen,
      drawerOpen,
      toggleCollapse,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask
    }
  }
}
</script>

<style>
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  --color-bg: var(--gray-50);
  --color-surface: #ffffff;
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
  --color-danger: #dc2626;   --color-danger-soft: #fef2f2;
  --color-info: #2563eb;     --color-info-soft: #eff6ff;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-base: 14px;
  --text-md: 16px;
  --text-lg: 20px;
  --text-xl: 24px;

  --sidebar-w: 240px;
  --sidebar-w-collapsed: 64px;
  --header-h: 60px;
  --content-max-w: 1440px;
  --content-pad: var(--space-8);

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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Shell */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
  min-height: 100vh;
  transition: grid-template-columns 200ms ease;
}

.app-shell.collapsed {
  grid-template-columns: var(--sidebar-w-collapsed) minmax(0, 1fr);
}

.app-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: var(--content-max-w);
  margin: 0 auto;
  padding: var(--content-pad);
}

.drawer-backdrop {
  display: none;
}

/* Tablet overlay backdrop: sits above the header, below the expanded sidebar */
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.2);
  z-index: var(--z-drawer-backdrop);
}

@media (max-width: 768px) {
  .app-shell,
  .app-shell.collapsed {
    grid-template-columns: minmax(0, 1fr);
  }
  .drawer-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: var(--z-drawer-backdrop);
  }
}

/* Page header: the app header already shows the page title, so the view's
   h2 is kept for screen readers only and the description stays visible. */
.page-header {
  margin-bottom: var(--space-6);
}

.page-header h2 {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.page-header:not(:has(p)) {
  display: none;
}

.page-header p {
  color: var(--color-text-muted);
  font-size: var(--text-base);
}

/* Cards and stat tiles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.stat-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-sm);
}

.stat-label {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: var(--space-2);
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.stat-card.warning .stat-value { color: var(--color-warning); }
.stat-card.success .stat-value { color: var(--color-success); }
.stat-card.danger .stat-value { color: var(--color-danger); }
.stat-card.info .stat-value { color: var(--color-info); }

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  margin-bottom: var(--space-6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-text);
}

/* Cards that hold a table go edge to edge so rows align with the card border */
.card:has(> .table-container),
.card:has(> table) {
  padding: 0;
  overflow: hidden;
}

.card:has(> .table-container) > .card-header,
.card:has(> table) > .card-header {
  margin-bottom: 0;
  padding: var(--space-4) var(--space-6);
}

/* Tables */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--gray-50);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

th {
  text-align: left;
  vertical-align: bottom;
  padding: var(--space-3);
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

td {
  white-space: nowrap;
  padding: var(--space-3);
  border-top: 1px solid var(--gray-100);
  color: var(--gray-700);
  font-size: var(--text-base);
}

tbody tr {
  transition: background-color var(--transition);
}

tbody tr:hover {
  background: var(--gray-50);
}

/* Badges: one status-to-color mapping for every page */
.badge {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 2px var(--space-2);
  border-radius: 999px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge.success, .badge.increasing { background: var(--color-success-soft); color: var(--color-success); }
.badge.warning, .badge.medium { background: var(--color-warning-soft); color: var(--color-warning); }
.badge.danger, .badge.decreasing, .badge.high { background: var(--color-danger-soft); color: var(--color-danger); }
.badge.info, .badge.low { background: var(--color-info-soft); color: var(--color-info); }
.badge.stable { background: var(--gray-100); color: var(--gray-600); }

.loading {
  text-align: center;
  padding: var(--space-12);
  color: var(--color-text-muted);
  font-size: var(--text-base);
}

.error {
  background: var(--color-danger-soft);
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin: var(--space-4) 0;
  font-size: var(--text-base);
}
</style>
