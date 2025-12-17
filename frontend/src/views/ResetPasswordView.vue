<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">

    <div class="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#b84ff6]/10 rounded-full blur-[120px]"></div>

    <div class="relative w-full max-w-md rounded-2xl border border-primary/50 bg-[#0f0f0f] p-8 shadow-[0_0_50px_rgba(184,79,246,0.2)]">

      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_20px_rgba(184,79,246,0.4)]">
          <span class="material-symbols-outlined text-3xl text-primary">key</span>
        </div>
        <h1 class="text-3xl font-black uppercase text-white mb-2 neon-text">Reset Password</h1>
        <p class="text-gray-400 text-sm">Enter the code sent to your email.</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-6">

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Reset Code</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors">vpn_key</span>
            <input
                v-model="token"
                type="text"
                required
                class="w-full rounded-xl bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder-white/20 font-mono tracking-widest text-center"
                placeholder="Paste code here"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">New Password</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors">lock</span>
            <input
                v-model="password"
                type="password"
                required
                minlength="8"
                class="w-full rounded-xl bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder-white/20"
                placeholder="Min. 8 characters"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wider text-primary">Confirm Password</label>
          <div class="relative group">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors">lock_reset</span>
            <input
                v-model="confirmPassword"
                type="password"
                required
                class="w-full rounded-xl bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-white focus:border-primary outline-none transition-all placeholder-white/20"
                placeholder="Repeat password"
            />
          </div>
        </div>

        <div v-if="message" :class="success ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'" class="p-3 rounded-lg border text-center text-sm font-bold">
          {{ message }}
        </div>

        <button
            :disabled="loading"
            type="submit"
            class="w-full rounded-xl bg-gradient-to-r from-primary to-purple-600 py-4 font-bold uppercase tracking-widest text-white hover:shadow-[0_0_20px_rgba(184,79,246,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <span v-if="!loading">Set New Password</span>
          <span v-else class="flex items-center justify-center gap-2"><span class="material-symbols-outlined animate-spin">sync</span> Processing...</span>
        </button>

        <router-link to="/home" class="block text-center text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white mt-4 transition-colors">
          Back to Login
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Token jest teraz edytowalny przez użytkownika (wkleja go z maila)
const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref('');
const success = ref(false);

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

onMounted(() => {
  // Jeśli jednak w przyszłości zrobisz link, to ten kod automatycznie wpisze token w pole input
  if (route.query.token) {
    token.value = route.query.token as string;
  }
});

async function handleReset() {
  if (password.value !== confirmPassword.value) {
    message.value = "Passwords do not match.";
    success.value = false;
    return;
  }

  if (!token.value) {
    message.value = "Please paste the code from your email.";
    success.value = false;
    return;
  }

  loading.value = true;
  message.value = '';

  try {
    // Wysyłamy ręcznie wpisany token i hasło
    const res = await fetch(`${API}/api/users/reset/resetPassword`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value.trim(), // Usuwamy spacje
        newPassword: password.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');

    success.value = true;
    message.value = 'Password changed! Redirecting...';

    setTimeout(() => router.push('/home'), 2000);

  } catch (e: any) {
    success.value = false;
    message.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(184, 79, 246, 0.6);
}
</style>