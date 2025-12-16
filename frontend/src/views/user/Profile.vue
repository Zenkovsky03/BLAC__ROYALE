<template>
  <PanelSectionLayout active-page="profile">

    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Personal Information</h2>
      <p class="text-sm text-white/70">Manage your personal details. Changing sensitive info may require re-login.</p>
    </div>

    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="username">Username</label>
          <div class="relative">
            <input
                v-model="form.username"
                class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 pr-10 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50"
                id="username"
                type="text"
                required
            />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer hover:text-secondary">edit</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="email">Email Address</label>
          <div class="relative">
            <input
                v-model="form.email"
                class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 pr-10 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50"
                id="email"
                type="email"
                required
            />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer hover:text-secondary">edit</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="role">Role</label>
          <input :value="auth.user?.role || 'PLAYER'" disabled class="block w-full rounded-md border-white/20 bg-background-dark/50 px-3 py-2 text-gray-400 cursor-not-allowed" id="role" type="text" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="id">User ID</label>
          <input :value="auth.user?.id" disabled class="block w-full rounded-md border-white/20 bg-background-dark/50 px-3 py-2 text-gray-400 cursor-not-allowed text-xs font-mono" id="id" type="text" />
        </div>

        <div v-if="error" class="sm:col-span-2 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center animate-pulse">
          {{ error }}
        </div>
        <div v-if="success" class="sm:col-span-2 p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold text-center">
          {{ success }}
        </div>

      </div>

      <div class="flex justify-end">
        <button
            :disabled="loading"
            class="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105 shadow-glow-primary-strong disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
        >
          <span v-if="!loading">Save Changes</span>
          <span v-else class="material-symbols-outlined animate-spin">sync</span>
        </button>
      </div>
    </form>

  </PanelSectionLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';

const auth = useAuthStore();
// Adres API - upewnij się, że pasuje do Twojego backendu (np. port 3000)
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const loading = ref(false);
const error = ref('');
const success = ref('');

const form = reactive({
  username: '',
  email: ''
});

// 1. Wczytaj obecne dane użytkownika do pól formularza
onMounted(() => {
  if (auth.user) {
    form.username = auth.user.username || '';
    form.email = auth.user.email || '';
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    // --- ZMIANA USERNAME ---
    // Sprawdzamy, czy użytkownik w ogóle zmienił nazwę w polu input
    if (form.username !== auth.user?.username) {

      const res = await fetch(`${API}/api/users/update-username`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}` // Ważne: wysyłamy token
        },
        body: JSON.stringify({ username: form.username })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to update username');
      }

      // Jeśli sukces -> Aktualizujemy nazwę w Store (dzięki temu zmieni się od razu w nagłówku)
      if (auth.user) {
        auth.user.username = form.username;
      }
    }

    // --- ZMIANA EMAIL (Opcjonalnie, jeśli endpoint update-email też masz) ---
    if (form.email !== auth.user?.email) {
      const resEmail = await fetch(`${API}/api/users/update-email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ email: form.email })
      });

      const dataEmail = await resEmail.json();
      if (!resEmail.ok) throw new Error(dataEmail.message || 'Failed to update email');

      if (auth.user) auth.user.email = form.email;
    }

    success.value = 'Profile updated successfully!';

  } catch (e: any) {
    error.value = e.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>