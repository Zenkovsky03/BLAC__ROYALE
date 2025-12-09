<template>
  <section class="px-4 sm:px-6 lg:px-8 py-10">
    <div class="grid grid-cols-1 gap-6 rounded-xl border border-primary/30 bg-background-dark/50 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:grid-cols-3 lg:gap-8 lg:p-8">

      <div class="flex flex-col gap-6 lg:col-span-1">

        <div class="flex items-center gap-4">
          <router-link to="/panel" class="cursor-pointer transition-transform duration-300 hover:scale-105 hover:opacity-80">
            <img
                alt="User Avatar"
                class="h-16 w-16 rounded-full border-2 border-primary shadow-glow-primary"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsZLYQAYUqMhZbUIuTqO7srsKXNp6yrj2QIqxVWUG4F_vuZvC7_tR_PMij_Gvcv8txeRgQxzOja4eap-mAqCMpUFznhghXbr8p7I32hOQphTp1IZNr8HWSiwmvxLqc_1WB0A4zW4fxmNKxV1d8HFcDdv8oZimsK1Vv5-Od5sPS_uHMEiBC4DjOedVJRdL9n78hAl6nohVLOPiOCv-w_ojSi8Td18iZhLfSA-vH8gh2K2DtwUe6INEh4SwmSh04qu4K4majW8f_5Ro"
            />
          </router-link>

          <div>
            <p class="text-sm text-secondary">{{ auth.user?.username || 'Gracz' }}</p>
            <h1 class="text-2xl font-bold tracking-wider text-white">User Panel</h1>
          </div>
        </div>

        <AccountSidebar :active-page="activePage" />
      </div>

      <div class="flex flex-col gap-6 lg:col-span-2">
        <slot />
      </div>

    </div>
  </section>
</template>

<script setup>
import AccountSidebar from '@/views/user/AccountSidebar.vue';
import { useAuthStore } from '@/stores/auth'; // 1. Import

const auth = useAuthStore(); // 2. Inicjalizacja
defineProps({
  activePage: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
</style>