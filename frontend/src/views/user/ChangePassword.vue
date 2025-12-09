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
          <input v-model="currentPassword" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="current-password" type="password" placeholder="Enter your current password" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="new-password">New Password</label>
          <input v-model="newPassword" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="new-password" type="password" placeholder="Enter your new password" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="confirm-password">Confirm New Password</label>
          <input v-model="confirmPassword" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="confirm-password" type="password" placeholder="Confirm your new password" />
        </div>
      </div>

      <div class="flex justify-end">
        <button class="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105 shadow-glow-primary-strong" type="submit">
          Save Changes
        </button>
      </div>
    </form>

  </PanelSectionLayout>
</template>

<script setup>
import { ref } from 'vue';
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const handleSubmit = () => {
  alert('Password change submitted!');
};
</script>