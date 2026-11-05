import { ref, onBeforeUnmount } from 'vue'

// Shell breakpoints. Keep in sync with the media queries in App.vue / AppSidebar.vue.
const MOBILE_QUERY = '(max-width: 768px)'
const TABLET_QUERY = '(min-width: 769px) and (max-width: 1279px)'

// Reactive viewport tier. Listeners are removed when the calling component unmounts.
export function useBreakpoint() {
  const mobileMql = window.matchMedia(MOBILE_QUERY)
  const tabletMql = window.matchMedia(TABLET_QUERY)
  const isMobile = ref(mobileMql.matches)
  const isTablet = ref(tabletMql.matches)

  const onMobile = (e) => { isMobile.value = e.matches }
  const onTablet = (e) => { isTablet.value = e.matches }
  mobileMql.addEventListener('change', onMobile)
  tabletMql.addEventListener('change', onTablet)

  onBeforeUnmount(() => {
    mobileMql.removeEventListener('change', onMobile)
    tabletMql.removeEventListener('change', onTablet)
  })

  return { isMobile, isTablet }
}
