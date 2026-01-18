<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        @click="!loading && $emit('close')"
    ></div>

    <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/50 bg-[#0a0a0a] p-6 shadow-[0_0_50px_rgba(184,79,246,0.2)] transition-all">

      <button
          @click="$emit('close')"
          :disabled="loading"
          class="absolute right-4 top-4 text-white/30 transition-colors hover:text-white disabled:opacity-0 z-10"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="mb-5 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
          <span class="material-symbols-outlined text-2xl text-primary">person_add</span>
        </div>
        <h2 class="text-xl font-black uppercase tracking-widest text-white neon-text">
          Create Account
        </h2>
        <p class="text-xs text-secondary/80">Join the elite players club</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-3">

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">First Name</label>
            <input
                v-model="name"
                @input="validateName"
                type="text"
                placeholder="John"
                class="w-full rounded-lg border bg-black/50 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                :class="errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Last Name</label>
            <input
                v-model="surname"
                @input="validateSurname"
                type="text"
                placeholder="Doe"
                class="w-full rounded-lg border bg-black/50 py-2.5 px-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                :class="errors.surname ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Username</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-base">account_circle</span>
              <input
                  v-model="username"
                  @input="validateUsername"
                  type="text"
                  placeholder="Player1"
                  class="w-full rounded-lg border bg-black/50 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                  :class="errors.username ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Date of Birth</label>
            <input
                v-model="dateOfBirth"
                @input="validateAge"
                type="date"
                class="w-full rounded-lg border bg-black/50 py-2.5 px-3 text-sm text-white placeholder-white/50 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)] appearance-none"
                :class="errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Email Address</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-base">mail</span>
            <input
                v-model="email"
                @input="validateEmail"
                type="email"
                placeholder="user@example.com"
                class="w-full rounded-lg border bg-black/50 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                :class="errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
            />
          </div>
          <p v-if="errors.email" class="text-[10px] text-red-400 font-bold ml-1">{{ errors.email }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Password</label>
            <div class="relative group">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-base">lock</span>
              <input
                  v-model="password"
                  @input="validatePassword"
                  type="password"
                  placeholder="******"
                  class="w-full rounded-lg border bg-black/50 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                  :class="errors.password ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-primary">Confirm</label>
            <div class="relative group">
              <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base transition-colors"
                  :class="(confirmPassword && !errors.confirmPassword) ? 'text-green-400' : 'text-white/30'"
              >
                {{ (confirmPassword && !errors.confirmPassword) ? 'check_circle' : 'lock_reset' }}
              </span>
              <input
                  v-model="confirmPassword"
                  @input="validateConfirmPassword"
                  type="password"
                  placeholder="Repeat"
                  class="w-full rounded-lg border bg-black/50 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:shadow-[0_0_15px_rgba(184,79,246,0.3)]"
                  :class="errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'"
              />
            </div>
          </div>
        </div>

        <div v-if="hasErrors || globalError" class="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-center">
          <p class="text-[10px] font-bold text-red-400">
            {{ globalError || getFirstError }}
          </p>
        </div>

        <button
            type="submit"
            :disabled="loading || hasErrors || !isFormFilled"
            class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 py-3.5 font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(184,79,246,0.6)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <span v-if="!loading" class="relative z-10 flex items-center justify-center gap-2 text-sm">
            Create Account
            <span class="material-symbols-outlined text-lg">rocket_launch</span>
          </span>
          <span v-else class="relative z-10 flex items-center justify-center gap-2 text-sm">
            <span class="animate-spin material-symbols-outlined text-lg">sync</span>
            Creating...
          </span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close'])
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const auth = useAuthStore()

const name = ref('')
const surname = ref('')
const username = ref('')
const email = ref('')
const dateOfBirth = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const globalError = ref('')

const errors = reactive({
  name: '',
  surname: '',
  username: '',
  email: '',
  dateOfBirth: '',
  password: '',
  confirmPassword: ''
})

const hasErrors = computed(() => Object.values(errors).some(msg => msg.length > 0))

const isFormFilled = computed(() =>
    name.value && surname.value && username.value && email.value &&
    dateOfBirth.value && password.value && confirmPassword.value
)

const getFirstError = computed(() => Object.values(errors).find(msg => msg.length > 0) || '')


const validateName = () => {
  errors.name = name.value.trim().length >= 2 ? '' : 'Name too short'
}
const validateSurname = () => {
  errors.surname = surname.value.trim().length >= 2 ? '' : 'Surname too short'
}
const validateUsername = () => {
  errors.username = username.value.trim().length >= 3 ? '' : 'Username min 3 chars'
}
const validateEmail = () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.email = re.test(email.value) ? '' : 'Invalid email format'
}
const validateAge = () => {
  if (!dateOfBirth.value) return
  const today = new Date()
  const birthDate = new Date(dateOfBirth.value)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  errors.dateOfBirth = age >= 18 ? '' : 'Must be 18+'
}
const validatePassword = () => {
  errors.password = password.value.length >= 6 ? '' : 'Password min 6 chars'
  if (confirmPassword.value) validateConfirmPassword()
}
const validateConfirmPassword = () => {
  errors.confirmPassword = password.value === confirmPassword.value ? '' : 'Passwords do not match'
}

async function handleRegister() {
  validateName(); validateSurname(); validateUsername(); validateEmail();
  validateAge(); validatePassword(); validateConfirmPassword();

  if (hasErrors.value || !isFormFilled.value) return

  loading.value = true
  globalError.value = ''

  try {
    const isoDate = new Date(dateOfBirth.value).toISOString()

    const res = await fetch(`${API}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
        dateOfBirth: isoDate,
        name: name.value,
        surname: surname.value
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
    globalError.value = e.message || 'Server error'
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