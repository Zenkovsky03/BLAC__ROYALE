<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        @click="!loading && $emit('close')"
    ></div>

    <div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border border-primary/50 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(184,79,246,0.2)] transition-all">

      <button
          @click="$emit('close')"
          :disabled="loading"
          class="absolute right-4 top-4 text-white/30 transition-colors hover:text-white disabled:opacity-0"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div v-if="viewState === 'login'">
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
            <span class="material-symbols-outlined text-3xl text-primary">lock_person</span>
          </div>
          <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">System Access</h2>
          <p class="mt-2 text-sm text-secondary/80">Enter credentials to proceed</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">Email Address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                  mail
                </span>
              </div>
              <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  :disabled="loading"
                  placeholder="user@example.com"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)] disabled:opacity-50"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="text-xs font-bold uppercase tracking-wider text-primary">Password</label>
              <button type="button" @click="switchToRecovery" class="text-xs text-white/50 hover:text-primary transition-colors" :disabled="loading">Forgot Password?</button>
            </div>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                  key
                </span>
              </div>
              <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  :disabled="loading"
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)] disabled:opacity-50"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-bold text-red-400 animate-pulse">{{ errorMessage }}</div>

          <button type="submit" :disabled="loading" class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50">
            <span v-if="!loading" class="relative z-10 flex items-center justify-center gap-2">Initialize Session <span class="material-symbols-outlined">login</span></span>
            <span v-else class="relative z-10 flex items-center justify-center gap-2"><span class="animate-spin material-symbols-outlined">sync</span> Authenticating...</span>
          </button>
        </form>
      </div>

      <div v-else-if="viewState === 'email'">
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
            <span class="material-symbols-outlined text-3xl text-primary">lock_reset</span>
          </div>
          <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">Password Recovery</h2>
          <p class="mt-2 text-sm text-secondary/80">Enter your email to receive a reset code</p>
        </div>

        <form @submit.prevent="handleRecoveryRequest" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">Email Address</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                  mail
                </span>
              </div>
              <input
                  v-model="recoveryForm.email"
                  type="email"
                  required
                  :disabled="loading"
                  placeholder="user@example.com"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)] disabled:opacity-50"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-bold text-red-400">{{ errorMessage }}</div>

          <button type="submit" :disabled="loading" class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50">
            <span v-if="!loading" class="relative z-10 flex items-center justify-center gap-2">Send Code <span class="material-symbols-outlined">send</span></span>
            <span v-else class="relative z-10 flex items-center justify-center gap-2"><span class="animate-spin material-symbols-outlined">sync</span> Sending...</span>
          </button>

          <div class="text-center">
            <button type="button" @click="viewState = 'login'; errorMessage = ''" class="text-xs text-white/50 hover:text-white transition-colors" :disabled="loading">Back to Login</button>
          </div>
        </form>
      </div>

      <div v-else-if="viewState === 'reset'">
        <div class="mb-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
            <span class="material-symbols-outlined text-3xl text-primary">key</span>
          </div>
          <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">Set New Password</h2>
          <p class="mt-2 text-sm text-green-400">Code sent! Check your email.</p>
        </div>

        <form @submit.prevent="handleFinalReset" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">Reset Code</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 transition-colors text-xl">
                  vpn_key
                </span>
              </div>
              <input
                  v-model="resetForm.token"
                  type="text"
                  required
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary font-mono tracking-widest text-center"
                  placeholder="Paste Code Here"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">New Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 transition-colors text-xl">
                  lock
                </span>
              </div>
              <input
                  v-model="resetForm.password"
                  type="password"
                  required
                  minlength="8"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary"
                  placeholder="Min. 8 chars"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">Confirm</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 transition-colors text-xl">
                  lock_reset
                </span>
              </div>
              <input
                  v-model="resetForm.confirm"
                  type="password"
                  required
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary"
                  placeholder="Repeat Password"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-bold text-red-400">{{ errorMessage }}</div>
          <div v-if="successMessage" class="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center text-xs font-bold text-green-400">{{ successMessage }}</div>

          <button type="submit" :disabled="loading" class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50">
            <span v-if="!loading">Change Password</span>
            <span v-else class="flex items-center justify-center gap-2"><span class="material-symbols-outlined animate-spin">sync</span> Processing...</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

// Stan widoku: 'login' | 'email' | 'reset'
const viewState = ref('login')

// Formularze
const loginForm = reactive({ email: '', password: '' })
const recoveryForm = reactive({ email: '' })
const resetForm = reactive({ token: '', password: '', confirm: '' })

// UI
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const emit = defineEmits(['close', 'login'])
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const auth = useAuthStore()

// Przełącznik widoków
const switchToRecovery = () => {
  viewState.value = 'email'
  errorMessage.value = ''
  successMessage.value = ''
  recoveryForm.email = loginForm.email // Przepisz email jeśli już wpisany
}

// 1. LOGOWANIE
async function handleLogin() {
  errorMessage.value = ''
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }
  loading.value = true

  try {
    await new Promise(r => setTimeout(r, 800))
    const res = await fetch(`${API}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.message || 'Login failed')

    auth.loginSuccess(data.token, data.loggedInUser)
    await auth.fetchBalance()
    emit('login', { token: data.token, user: data.loggedInUser })
  } catch (e: any) {
    errorMessage.value = e.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}

// 2. WYSŁANIE MAILA Z KODEM
async function handleRecoveryRequest() {
  errorMessage.value = ''
  if (!recoveryForm.email) return

  loading.value = true
  try {
    // Endpoint: PATCH request-password-reset
    const res = await fetch(`${API}/api/users/reset/request-password-reset`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: recoveryForm.email })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Request failed')

    viewState.value = 'reset'
  } catch (e: any) {
    errorMessage.value = e.message
  } finally {
    loading.value = false
  }
}

// 3. FINALNE RESETOWANIE HASŁA
async function handleFinalReset() {
  errorMessage.value = ''
  successMessage.value = ''

  if (resetForm.password !== resetForm.confirm) {
    errorMessage.value = "Passwords do not match."
    return
  }
  if (!resetForm.token) {
    errorMessage.value = "Please enter the code from your email."
    return
  }

  loading.value = true
  try {
    // Endpoint: PATCH resetPassword
    const res = await fetch(`${API}/api/users/reset/resetPassword`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetForm.token.trim(),
        newPassword: resetForm.password
      })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Failed to reset password')

    successMessage.value = 'Password changed successfully!'

    setTimeout(() => {
      viewState.value = 'login'
      loginForm.email = recoveryForm.email
      loginForm.password = ''
      successMessage.value = ''
    }, 2000)

  } catch (e: any) {
    errorMessage.value = e.message
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