<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import InfluencersDashboardV1 from "/@src/components/pages/dashboards/lifestyle/InfluencersDashboardV1.vue";

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Influencers')

const isLoaderActive = ref(true)

useHead({
  title: 'Main Dashboard - My app',
})
</script>

<template>
  <div class="page-content-inner">
    <!-- <Teleport to="[data-teleport-bg]">
      <div class="lifestyle-dashboard-bg">
        
      </div>
    </Teleport> -->

      <InfluencersDashboardV1 />
  </div>
</template>
