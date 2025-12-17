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

      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
          <span class="material-symbols-outlined text-3xl text-primary">person_add</span>
        </div>

        <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">
          Create Account
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Join the elite players club</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">First Name</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                  badge
                </span>
              </div>
              <input
                  v-model="name"
                  type="text"
                  placeholder="John"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-primary">Last Name</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                  badge
                </span>
              </div>
              <input
                  v-model="surname"
                  type="text"
                  placeholder="Doe"
                  class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Username</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                account_circle
              </span>
            </div>
            <input
                v-model="username"
                type="text"
                required
                placeholder="CyberPlayer_01"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Email Address</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                mail
              </span>
            </div>
            <input
                v-model="email"
                type="email"
                required
                placeholder="user@example.com"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Date of Birth</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                calendar_month
              </span>
            </div>
            <input
                v-model="dateOfBirth"
                type="date"
                required
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/50 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)] appearance-none"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Password</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-white/50 group-focus-within:text-primary transition-colors text-xl">
                lock
              </span>
            </div>
            <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Confirm Password</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span
                  class="material-symbols-outlined transition-colors text-xl"
                  :class="(confirmPassword && password === confirmPassword) ? 'text-green-400' : 'text-white/50 group-focus-within:text-primary'"
              >
                {{ (confirmPassword && password === confirmPassword) ? 'check_circle' : 'lock_reset' }}
              </span>
            </div>
            <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-bold text-red-400 animate-pulse">
          {{ errorMessage }}
        </div>

        <button
            type="submit"
            :disabled="loading || password !== confirmPassword"
            class="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading" class="relative z-10 flex items-center justify-center gap-2">
            Register Account
            <span class="material-symbols-outlined">rocket_launch</span>
          </span>
          <span v-else class="relative z-10 flex items-center justify-center gap-2">
            <span class="animate-spin material-symbols-outlined">sync</span>
            Creating...
          </span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

// Pola formularza
const name = ref('')
const surname = ref('')
const username = ref('')
const email = ref('')
const dateOfBirth = ref('')
const password = ref('')
const confirmPassword = ref('')

// Stan UI
const loading = ref(false)
const errorMessage = ref('')

const emit = defineEmits(['close'])
const API = import.meta.env.VITE_API_URL || ''
const auth = useAuthStore()

// Obliczanie wieku
function getAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function handleRegister() {
  errorMessage.value = '';

  if (!email.value || !password.value || !dateOfBirth.value || !username.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  // WERYFIKACJA WIEKU (18+)
  const age = getAge(dateOfBirth.value);
  if (age < 18) {
    errorMessage.value = 'You must be at least 18 years old to register.';
    return;
  }

  loading.value = true
  try {
    const isoDate = new Date(dateOfBirth.value).toISOString();

    const res = await fetch(`${API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
        dateOfBirth: isoDate,
        name: name.value || undefined,
        surname: surname.value || undefined
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Registration failed')
    }

    const user = data.loggedInUser || data.newUser

    if (data.token && user) {
      auth.loginSuccess(data.token, user)
      await auth.fetchBalance()
    }

    emit('close')
  } catch (e: any) {
    errorMessage.value = e.message || 'Registration error.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(184, 79, 246, 0.6);
}

/* Stylizacja inputa daty dla ciemnego motywu */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>