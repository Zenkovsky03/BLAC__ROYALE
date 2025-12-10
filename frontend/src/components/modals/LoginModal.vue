<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        @click="$emit('close')"
    ></div>

    <div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border border-primary/50 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(184,79,246,0.2)] transition-all">

      <button
          @click="$emit('close')"
          class="absolute right-4 top-4 text-white/30 transition-colors hover:text-white"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
          <span class="material-symbols-outlined text-3xl text-primary">lock_person</span>
        </div>

        <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">
          System Access
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Enter credentials to proceed</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Email Address</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              mail
            </span>
            <input
                v-model="email"
                type="email"
                required
                placeholder="user@example.com"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Password</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              key
            </span>
            <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading" class="relative z-10 flex items-center justify-center gap-2">
            Initialize Session
            <span class="material-symbols-outlined">login</span>
          </span>
          <span v-else class="relative z-10 flex items-center justify-center gap-2">
            <span class="animate-spin material-symbols-outlined">progress_activity</span>
            Authenticating...
          </span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const emit = defineEmits(['close'])

const API = import.meta.env.VITE_API_URL || ''

const auth = useAuthStore()

async function handleLogin() {
  if (!email.value || !password.value) {
    alert('Please enter both email and password.')
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || 'Login failed')
    }

    // Sukces
    auth.loginSuccess(data.token, data.loggedInUser)
    await auth.fetchBalance()

    emit('close')
  } catch (e: any) {
    alert(e?.message || 'Login error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(184, 79, 246, 0.6);
}
</style>