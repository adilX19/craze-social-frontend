<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Main Dashboard')

useHead({
  title: 'Main Dashboard - My app',
})
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]" :disabled="$route.name === 'app'">
      <div v-if="$route.name !== 'app'" class="lifestyle-dashboard-bg"></div>
    </Teleport>

    <PersonalDashboardV2 />
    <!-- <PersonalDashboardV1 /> -->
  </div>
</template>
