<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(async () => {
  auth.hydrateFromStorage()

  if (auth.isAuthenticated) {
    await auth.fetchUser()
    await auth.fetchBalance()
  }
})
</script>

<template>
  <router-view />
</template>