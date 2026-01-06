<template>
  <PanelSectionLayout active-page="password">

    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Change Password</h2>
      <p class="text-sm text-white/70">For your security, we recommend choosing a strong password that you don't use elsewhere.</p>
    </div>

    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-4">

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="current-password">Current Password</label>
          <input
              v-model="currentPassword"
              required
              class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50"
              id="current-password"
              type="password"
              placeholder="Enter your current password"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="new-password">New Password</label>
          <input
              v-model="newPassword"
              required
              minlength="8"
              class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50"
              id="new-password"
              type="password"
              placeholder="Enter your new password"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="confirm-password">Confirm New Password</label>
          <input
              v-model="confirmPassword"
              required
              class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50"
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
          />
        </div>

        <div v-if="error" class="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center animate-pulse">
          {{ error }}
        </div>
        <div v-if="successMessage" class="p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold text-center">
          {{ successMessage }}
        </div>

      </div>

      <div class="flex justify-end">
        <button
            :disabled="loading"
            class="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105 shadow-glow-primary-strong disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
        >
          <span v-if="!loading">Save Changes</span>
          <span v-else class="material-symbols-outlined animate-spin text-sm">sync</span>
        </button>
      </div>
    </form>

  </PanelSectionLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';

const auth = useAuthStore();
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const loading = ref(false);
const error = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  // Reset komunikatów
  error.value = '';
  successMessage.value = '';

  // 1. Walidacja frontendowa
  if (newPassword.value !== confirmPassword.value) {
    error.value = "New passwords do not match!";
    return;
  }
  if (newPassword.value.length < 8) {
    error.value = "Password must be at least 8 characters long.";
    return;
  }

  loading.value = true;

  try {
    // 2. Zapytanie do API zgodnie ze zrzutem ekranu
    const res = await fetch(`${API}/api/users/changePassword`, {
      method: 'PATCH', //
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}` // Wymagane dla autoryzowanego usera
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value, //
        newPassword: newPassword.value          //
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to change password');
    }

    // 3. Sukces
    successMessage.value = data.message || "Password changed successfully!";

    // Wyczyść pola
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>