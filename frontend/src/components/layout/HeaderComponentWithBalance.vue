<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
function handleLogout() {
  auth.logout()
  router.push('/home')
}

</script>

<template>
  <header class="flex items-center justify-between py-4 px-6 bg-transparent">
    <!-- Lewa strona -->
    <div class="text-2xl font-bold">
      CASINO
    </div>

    <!-- Prawa strona -->
    <div class="flex items-center gap-4">
      <div class="rounded-lg bg-[#1b1b1b] px-4 py-2 text-lg font-semibold">
        Balance: {{ auth.balance ?? 0 }}$
      </div>

      <button
          @click="handleLogout"
          class="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-white font-semibold transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>



<style scoped>
.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}
</style>