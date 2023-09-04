<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import ComparisonDashboardV1 from "/@src/components/pages/dashboards/lifestyle/ComparisonDashboardV1.vue";

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Comparisons')

const isLoaderActive = ref(true)

useHead({
  title: 'CrazeSocial - Comparisons',
})
</script>

<template>
  <div class="page-content-inner">
    <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg"></div>
    </Teleport>
    
      <ComparisonDashboardV1 />
  </div>
</template>
