<template>
  <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
  >

  <div class="bg-background-dark border border-primary/30 rounded-xl p-6 w-full max-w-md shadow-glow-primary max-h-[90vh] overflow-y-auto my-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-primary">Login</h2>
        <button @click="$emit('close')" class="text-white/60 hover:text-white text-2xl">×</button>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Email</label>
          <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white placeholder-white/50 focus:border-primary focus:outline-none"
              placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Password</label>
          <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 bg-white/5 border border-primary/30 rounded-lg text-white placeholder-white/50 focus:border-primary focus:outline-none"
              placeholder="Enter your password"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-primary text-background-dark font-bold py-3 px-4 rounded-lg transition-transform hover:scale-105 shadow-glow-primary-strong"
        >
          Login
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

const API = import.meta.env.VITE_API_URL || '' // przy proxy może być ''

const auth = useAuthStore()

async function handleLogin() {
  if (!email.value || !password.value) {
    alert('Podaj email i hasło')
    return
  }
  loading.value = true
  try {
    const res = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    // Warto pobrać body raz (także przy błędzie), żeby mieć komunikat
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || 'Login failed')
    }

    // Oczekiwane z backendu: { token, loggedInUser }
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
.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5);
}

.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}
</style>
