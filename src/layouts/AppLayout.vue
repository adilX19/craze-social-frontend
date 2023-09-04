<script setup lang="ts">
import { ref, watchPostEffect, watch } from 'vue'
import { useRoute } from 'vue-router'

import type { SidebarTheme } from '/@src/components/navigation/desktop/Sidebar.vue'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import {useI18n} from "vue-i18n";
import {useStorage} from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    theme?: SidebarTheme
    defaultSidebar?: string
    closeOnChange?: boolean
    openOnMounted?: boolean
    nowrap?: boolean
  }>(),
  {
    defaultSidebar: 'dashboard',
    theme: 'default',
  }
)

const viewWrapper = useViewWrapper()
const route = useRoute()
const isMobileSidebarOpen = ref(false)
const isDesktopSidebarOpen = ref(props.openOnMounted)
const activeMobileSubsidebar = ref(props.defaultSidebar)
const hoverTab = ref(-1)

function switchSidebar(id: string) {
  if (id === activeMobileSubsidebar.value) {
    isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
  } else {
    isDesktopSidebarOpen.value = true
    activeMobileSubsidebar.value = id
  }
}


const { locale, t } = useI18n()

/**
 * We use the same storage key as we use in the /src/i18n.ts file
 * so if user reload the page, the selected language will be the same
 */
const defaultLocale = useStorage('locale', navigator?.language || 'en')

/**
 * Each time we change the locale, we persit it in the storage
 */
watch(locale, () => {
  defaultLocale.value = locale.value
})


/**
 * watchPostEffect callback will be executed each time dependent reactive values has changed
 */
watchPostEffect(() => {
  viewWrapper.setPushed(isDesktopSidebarOpen.value ?? false)
})
watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false

    if (props.closeOnChange && isDesktopSidebarOpen.value) {
      isDesktopSidebarOpen.value = false
    }
  }
)

</script>

<template>
  <div class="sidebar-layout">
    <div class="app-overlay"></div>

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <RouterLink :to="{ name: 'about' }" class="navbar-item is-brand">
          <AnimatedLogo width="38px" height="38px" />
        </RouterLink>

        <div class="brand-end">
          <NotificationsMobileDropdown />
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <!-- HOME/DASHBOARD PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="t('crazeDashboard')">
          <a
             :class="[$route.name === 'app' && 'is-active']"
             :data-content="t('crazeDashboard')"
             tabindex="0"
             @click="$router.push({ name: 'app' })"
             @mouseenter="hoverTab = 0"
             @mouseleave="hoverTab = -1"
          >
            <i
                aria-hidden="true"
                class="iconify sidebar-svg"
                data-icon="feather:home"
            ></i>
          </a>
        </li>

        <!-- PROFILES PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Profiles'">
          <a
             :class="[$route.name === 'app-profiles' && 'is-active']"
             :data-content="'Profiles'"
             tabindex="0"
             @click="$router.push({ name: 'app-profiles' })"
             @mouseenter="hoverTab = 0"
             @mouseleave="hoverTab = -1"
          >
            <i class="iconify" style="font-size: 22px;" data-icon="feather:user" aria-hidden="true"></i>
          </a>
        </li>

        <!-- COMPARISONS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Comparisons'">
          <a
              :class="[$route.name === 'app-instagram' && 'is-active']"
              :data-content="'Comparisons'"
              tabindex="1"
              @click="$router.push({ name: 'app-instagram' })"
              @mouseenter="hoverTab = 1"
              @mouseleave="hoverTab = -1"
          >
            <i class="iconify sidebar-svg" style="font-size: 22px;" data-icon="feather:users" aria-hidden="true"></i>
          </a>
        </li>

        <!-- INFLUENECERS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Influencers'">
          <a
              :class="[$route.name === 'app-tiktok' && 'is-active']"
              :data-content="'Influencers'"
              tabindex="2"
              @click="$router.push({ name: 'app-tiktok' })"
              @mouseenter="hoverTab = 2"
              @mouseleave="hoverTab = -1"
          >
             <i class="lnir lnir-search sidebar-svg" style="font-size: 22px;" aria-hidden="true"></i>
          </a>
        </li>

        <!-- PREDICTIVE ANALYSIS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Predictive Analysis'">
          <a
              :class="[$route.name === 'app-influencers' && 'is-active']"
              :data-content="'Predictive Analysis'"
              tabindex="3"
              @click="$router.push({ name: 'app-influencers' })"
              @mouseenter="hoverTab = 3"
              @mouseleave="hoverTab = -1"
          >
             <i class="fas fa-star" aria-hidden="true"></i>
          </a>
        </li>
      </template>
    </MobileSidebar>

    <!-- Mobile subsidebar links -->
<!--    <Transition name="slide-x">-->
<!--      <DashboardsMobileSubsidebar-->
<!--        v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'dashboard'"-->
<!--      />-->
<!--    </Transition>-->

    <Sidebar :theme="props.theme" :is-open="isDesktopSidebarOpen">
      <template #links>
        <!-- HOME/DASHBOARD PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="t('crazeDashboard')">
          <a
             :class="[$route.name === 'app' && 'is-active']"
             :data-content="t('crazeDashboard')"
             tabindex="0"
             @click="$router.push({ name: 'app' })"
             @mouseenter="hoverTab = 0"
             @mouseleave="hoverTab = -1"
          >
            <i
                aria-hidden="true"
                class="iconify sidebar-svg"
                data-icon="feather:home"
            ></i>
          </a>
        </li>

        <!-- PROFILES PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Profiles'">
          <a
             :class="[$route.name === 'app-profiles' && 'is-active']"
             :data-content="'Profiles'"
             tabindex="0"
             @click="$router.push({ name: 'app-profiles' })"
             @mouseenter="hoverTab = 0"
             @mouseleave="hoverTab = -1"
          >
            <i class="iconify sidebar-svg" style="font-size: 22px;" data-icon="feather:user" aria-hidden="true"></i>
          </a>
        </li>

        <!-- COMPARISONS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Comparisons'">
          <a
              :class="[$route.name === 'app-comparisons' && 'is-active']"
              :data-content="'Comparisons'"
              tabindex="1"
              @click="$router.push({ name: 'app-comparisons' })"
              @mouseenter="hoverTab = 1"
              @mouseleave="hoverTab = -1"
          >
            <i class="iconify sidebar-svg" style="font-size: 22px;" data-icon="feather:users" aria-hidden="true"></i>
          </a>
        </li>

        <!-- INFLUENECERS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Influencers'">
          <a
              :class="[$route.name === 'app-influencers' && 'is-active']"
              :data-content="'Influencers'"
              tabindex="2"
              @click="$router.push({ name: 'app-influencers' })"
              @mouseenter="hoverTab = 2"
              @mouseleave="hoverTab = -1"
          >
             <i class="fas fa-star sidebar-svg" style="font-size: 18px;" aria-hidden="true"></i>
          </a>
        </li>

        <!-- PREDICTIVE ANALYSIS PAGE LINK -->
        <li class="has-tooltip-arrow has-tooltip-right" :data-tooltip="'Insights - Predictive Analysis'">
          <a
              :class="[$route.name === 'app-influencers' && 'is-active']"
              :data-content="'Predictive Analysis'"
              tabindex="3"
              @click="$router.push({ name: 'app-influencers' })"
              @mouseenter="hoverTab = 3"
              @mouseleave="hoverTab = -1"
          >
             <i class="lnir lnir-idea-alt sidebar-svg" style="font-size: 22px;" aria-hidden="true"></i>
          </a>
        </li>
      </template>
      <template #bottom-links>
        <li :style="{ height: '120px' }">
          <UserProfileDropdown up />
        </li>
      </template>
    </Sidebar>

    <Transition name="slide-x">
      <DashboardsSubsidebar
        v-if="isDesktopSidebarOpen && activeMobileSubsidebar === 'dashboard'"
        @close="isDesktopSidebarOpen = false"
      />
    </Transition>

    <LanguagesPanel />

    <VViewWrapper>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <VPageContent v-else class="is-relative">
          <div class="page-title has-text-centered">
            <!-- Sidebar Trigger -->
<!--            <div-->
<!--              class="vuero-hamburger nav-trigger push-resize"-->
<!--              tabindex="0"-->
<!--              @keydown.space.prevent="isDesktopSidebarOpen = !isDesktopSidebarOpen"-->
<!--              @click="isDesktopSidebarOpen = !isDesktopSidebarOpen"-->
<!--            >-->
<!--              <span class="menu-toggle has-chevron">-->
<!--                <span :class="[isDesktopSidebarOpen && 'active']" class="icon-box-toggle">-->
<!--                  <span class="rotate">-->
<!--                    <i aria-hidden="true" class="icon-line-top"></i>-->
<!--                    <i aria-hidden="true" class="icon-line-center"></i>-->
<!--                    <i aria-hidden="true" class="icon-line-bottom"></i>-->
<!--                  </span>-->
<!--                </span>-->
<!--              </span>-->
<!--            </div>-->

            <div class="title-wrap">
              <h1 class="title is-4">{{ viewWrapper.pageTitle }}</h1>
            </div>

            <Toolbar class="desktop-toolbar" />
          </div>

          <slot></slot>
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>

<style lang="scss">
.main-sidebar .sidebar-inner .icon-menu {
  overflow-y: clip;
}
</style>
