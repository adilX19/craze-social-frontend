<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import InstagramDashboardV1 from "/@src/components/pages/dashboards/lifestyle/InstagramDashboardV1.vue";

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Instagram')

const isLoaderActive = ref(true)

useHead({
  title: 'Main Dashboard - My app',
})
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg"></div>
    </Teleport>

      <InstagramDashboardV1 />
  </div>
</template>
