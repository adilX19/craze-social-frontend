<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import ProfilesDashboardV1 from "/@src/components/pages/dashboards/lifestyle/ProfilesDashboardV1.vue";

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profiles Insights')

const isLoaderActive = ref(true)

useHead({
  title: 'Insights - Profiles',
})
</script>

<template>
  <div class="page-content-inner">
      <ProfilesDashboardV1 />
  </div>
</template>
