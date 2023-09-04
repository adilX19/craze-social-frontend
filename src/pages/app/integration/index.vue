<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ref } from 'vue'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Integrations')

const isLoaderActive = ref(true)

useHead({
  title: 'Integration',
})
</script>

<template>
  <div class="page-content-inner">
    <CardsGridV4 />
  </div>
</template>
