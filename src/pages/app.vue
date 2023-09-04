<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <AppLayout>
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
        <component :is="Component" :key="route.fullPath" />
    </RouterView>
  </AppLayout>
</template>
