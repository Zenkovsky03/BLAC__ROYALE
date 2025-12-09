<template>
  <PanelSectionLayout active-page="profile">

    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Personal Information</h2>
      <p class="text-sm text-white/70">Manage your personal details and contact information to keep your account up-to-date.</p>
    </div>

    <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="username">Username</label>
          <div class="relative">
            <input v-model="username" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 pr-10 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="username" type="text" />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer hover:text-secondary">edit</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="email">Email Address</label>
          <div class="relative">
            <input v-model="email" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 pr-10 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="email" type="email" />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer hover:text-secondary">edit</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="dob">Date of Birth</label>
          <input v-model="dob" disabled class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50" id="dob" type="text" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-secondary/80" for="country">Country</label>
          <div class="relative">
            <select v-model="country" class="block w-full appearance-none rounded-md border-white/20 bg-background-dark px-3 py-2 text-white transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="country">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Japan</option>
            </select>
            <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">expand_more</span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5 sm:col-span-2">
          <label class="text-sm font-medium text-secondary/80" for="phone">Phone Number</label>
          <div class="relative">
            <input v-model="phone" class="block w-full rounded-md border-white/20 bg-background-dark px-3 py-2 pr-10 text-white placeholder-white/50 transition duration-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50" id="phone" type="tel" />
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 cursor-pointer hover:text-secondary">edit</span>
          </div>
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
import {ref} from 'vue';
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';

const username = ref('CyberRonin_88');
const email = ref('ronin@cybernet.io');
const dob = ref('05/15/1988');
const country = ref('United States');
const phone = ref('+1-555-0100-1234');

const handleSubmit = () => {
  alert('Personal information saved!');
};
</script>