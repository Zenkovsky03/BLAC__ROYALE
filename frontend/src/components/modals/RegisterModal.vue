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
          <span class="material-symbols-outlined text-3xl text-primary">person_add</span>
        </div>

        <h2 class="text-2xl font-black uppercase tracking-widest text-white neon-text">
          Create Account
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Join the elite players club</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Username</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              badge
            </span>
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
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              mail
            </span>
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
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              calendar_month
            </span>
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
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-primary transition-colors">
              lock
            </span>
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
            <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                :class="(confirmPassword && password === confirmPassword) ? 'text-green-400' : 'text-white/50 group-focus-within:text-primary'"
            >
              {{ (confirmPassword && password === confirmPassword) ? 'check_circle' : 'lock_reset' }}
            </span>
            <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                class="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-primary focus:shadow-[0_0_20px_rgba(184,79,246,0.3)]"
            />
          </div>
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
            <span class="animate-spin material-symbols-outlined">progress_activity</span>
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

const email = ref('')
const username = ref('')
const dateOfBirth = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const emit = defineEmits(['close'])

const API = import.meta.env.VITE_API_URL || ''

const auth = useAuthStore()

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
  if (!email.value || !password.value || !dateOfBirth.value) {
    alert('Please fill in all fields.')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  // WERYFIKACJA WIEKU (18+)
  const age = getAge(dateOfBirth.value);
  if (age < 18) {
    alert('You must be at least 18 years old to register.');
    return;
  }

  loading.value = true
  try {
    // Wysyłamy sformatowaną datę (ISO) do backendu
    const isoDate = new Date(dateOfBirth.value).toISOString();

    const res = await fetch(`${API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        username: username.value || undefined,
        password: password.value,
        dateOfBirth: isoDate // Dodane pole
      })
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data?.message || 'Registration failed')
    }

    const user = data.loggedInUser || data.newUser

    auth.loginSuccess(data.token, user)
    await auth.fetchBalance()

    emit('close')
  } catch (e: any) {
    alert(e?.message || 'Registration error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(184, 79, 246, 0.6);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
  cursor: pointer;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>