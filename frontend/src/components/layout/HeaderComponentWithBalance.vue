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
            class="text-white text-sm font-medium leading-normal transition-colors hover:text-primary flex items-center gap-"
        >
          <span class="material-symbols-outlined text-lg">leaderboard</span>
          Leaderboard
        </router-link>
      </div>

      <div class="flex items-center gap-4 pl-6">

        <div class=" lg:block rounded-lg bg-[#1b1b1b] px-4 py-2 text-sm font-semibold text-white border border-white/10">
          {{ auth.balance ?? 0 }}$
        </div>

        <router-link
            to="/panel"
            class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 hover:shadow-glow-primary"
        >
          <span class="material-symbols-outlined text-lg mr-2">person</span>
          <span class="truncate">Panel</span>
        </router-link>

        <button
            @click="handleLogout"
            class="flex items-center justify-center rounded-lg h-10 px-4 border border-red-500/50 text-red-500 text-sm font-bold transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
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

.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
</style>