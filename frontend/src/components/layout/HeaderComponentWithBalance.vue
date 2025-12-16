<script setup lang="ts">
import { computed, ref } from 'vue' // <--- 1. Import ref
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const emit = defineEmits(['open-wallet', 'open-panel'])

const auth = useAuthStore()
const router = useRouter()
const isLoggingOut = ref(false) // <--- 2. Nowa zmienna stanu

// Logika sprawdzania admina
const isAdmin = computed(() => {
  return auth.user?.role === 'ADMIN'
})

// --- POPRAWIONA FUNKCJA WYLOGOWANIA ---
async function handleLogout() {
  // 1. Włączamy tryb wylogowywania (zmienia wygląd przycisku)
  isLoggingOut.value = true

  // 2. Czekamy 1 sekundę (dla efektu animacji)
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 3. Dopiero teraz czyścimy dane i przenosimy
  auth.logout()
  router.push('/home')

  // (Opcjonalnie) Resetujemy stan, choć komponent i tak zniknie/przeładuje się
  isLoggingOut.value = false
}
</script>

<template>
  <header class="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 py-4 sm:px-6 lg:px-8">

    <div class="flex items-center gap-3 text-white">
      <router-link to="/home" class="flex items-center gap-3 transition-opacity hover:opacity-80">
        <div class="w-9 h-9 rounded-full overflow-hidden border border-[#b84ff6]/70 shadow-[0_0_15px_#b84ff6]">
          <img
              src="../../../assets/logo_prototype.png"
              alt="Logo"
              class="w-full h-full object-cover"
          />
        </div>

        <h2 class="text-2xl font-black leading-tight tracking-wider uppercase">
          BLAC ROYALE
        </h2>
      </router-link>
    </div>

    <div class="flex-1 justify-end gap-8 md:flex">
      <router-link
          :to="{ path: '/home', hash: '#games' }"
          class="text-white text-sm font-medium leading-normal transition-colors hover:text-primary flex items-center gap-2"
      >
        Games
      </router-link>

      <router-link
          to="/leaderboard"
          class="text-white text-sm font-medium leading-normal transition-colors hover:text-primary flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-lg">leaderboard</span>
        Leaderboard
      </router-link>
    </div>

    <div class="flex items-center gap-4 pl-6">

      <div
          @click="$emit('open-wallet')"
          class="cursor-pointer select-none lg:block rounded-lg bg-[#1b1b1b] px-4 py-2 text-sm font-semibold text-white border border-white/10 transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(184,79,246,0.3)] hover:scale-105"
      >
        {{ auth.balance ?? 0 }}$
      </div>

      <button
          @click="$emit('open-panel')"
          class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 hover:shadow-glow-primary"
          :class="isAdmin
            ? 'bg-gradient-to-r from-[#b84ff6] to-[#7c3aed] text-white border border-[#b84ff6]/50'
            : 'bg-primary text-background-dark'"
      >
        <span class="material-symbols-outlined text-lg mr-2">
          {{ isAdmin ? 'admin_panel_settings' : 'person' }}
        </span>
        <span class="truncate">
          {{ isAdmin ? 'Admin' : 'Panel' }}
        </span>
      </button>

      <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="flex items-center justify-center rounded-lg h-10 px-4 border border-red-500/50 text-red-500 text-sm font-bold transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500/5 min-w-[100px]"
      >
        <span v-if="!isLoggingOut">Logout</span>

        <span v-else class="flex items-center gap-2">
          <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
          <span class="text-xs">Bye...</span>
        </span>
      </button>

    </div>
  </header>
</template>

<style scoped>
.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}

.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
</style>