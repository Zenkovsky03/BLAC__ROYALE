<template>
  <PanelSectionLayout active-page="notifications">

    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Notifications Settings</h2>
      <p class="text-sm text-white/70">Customize how we communicate with you. Choose your preferred channels and the types of notifications you want to receive.</p>
    </div>

    <form class="flex flex-col gap-8" @submit.prevent>
      <div class="flex flex-col gap-6 rounded-lg border border-white/20 bg-background-dark/50 p-6">
        <h3 class="font-bold text-secondary/80">Notification Types</h3>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">

          <div class="flex items-center justify-between">
            <label class="text-sm text-white" for="promo-offers">Promotional Offers</label>
            <label class="relative inline-flex cursor-pointer items-center">
              <input checked class="peer sr-only switch-checkbox" id="promo-offers" type="checkbox" />
              <div class="h-6 w-11 rounded-full border border-white/30 bg-white/10 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"></div>
              <div class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white/50 transition-transform switch-handle peer-checked:shadow-glow-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm text-white" for="game-updates">Game Updates</label>
            <label class="relative inline-flex cursor-pointer items-center">
              <input checked class="peer sr-only switch-checkbox" id="game-updates" type="checkbox" />
              <div class="h-6 w-11 rounded-full border border-white/30 bg-white/10 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50"></div>
              <div class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white/50 transition-transform switch-handle peer-checked:shadow-glow-primary"></div>
            </label>
          </div>

        </div>
      </div>

      <div class="flex flex-col gap-6 rounded-lg border border-white/20 bg-background-dark/50 p-6">
        <h3 class="font-bold text-secondary/80">Preferred Channels</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex items-center gap-3">
            <input checked class="h-5 w-5 rounded border-white/30 bg-transparent text-primary transition duration-300 focus:ring-2 focus:ring-primary/50" id="email-channel" type="checkbox" />
            <label class="text-sm text-white" for="email-channel">Email</label>
          </div>
          <div class="flex items-center gap-3">
            <input checked class="h-5 w-5 rounded border-white/30 bg-transparent text-primary transition duration-300 focus:ring-2 focus:ring-primary/50" id="inapp-channel" type="checkbox" />
            <label class="text-sm text-white" for="inapp-channel">In-App Notifications</label>
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
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';
</script>

<style scoped>
/* Te style są unikalne dla switchy, więc mogą tu zostać */
.switch-checkbox:checked {
  background-color: #f900ff;
  border-color: #f900ff;
}
.switch-checkbox:checked + div + .switch-handle {
  transform: translateX(1.25rem);
  background-color: #0c011f;
}
</style>