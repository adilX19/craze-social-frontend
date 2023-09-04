<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Plans')

const isLoaderActive = ref(true)

useHead({
  title: 'Plans',
})
</script>

<template>
  <div class="page-content-inner">
    <PlanCardsGridV4 />
  </div>
</template>
