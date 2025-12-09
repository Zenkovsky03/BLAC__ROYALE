<template>
  <nav class="flex flex-col gap-2">

    <router-link
        to="/panel/profile"
        :class="[
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        activePage === 'profile'
          ? 'bg-primary/10 border border-primary/50 text-primary shadow-glow-primary'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      ]"
    >
      <span class="material-symbols-outlined text-xl">person</span>
      <span>Personal Information</span>
    </router-link>

    <router-link
        to="/panel/password"
        :class="[
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        activePage === 'password'
          ? 'bg-primary/10 border border-primary/50 text-primary shadow-glow-primary'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      ]"
    >
      <span class="material-symbols-outlined text-xl">lock</span>
      <span>Change Password</span>
    </router-link>

    <router-link
        to="/panel/notifications"
        :class="[
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        activePage === 'notifications'
          ? 'bg-primary/10 border border-primary/50 text-primary shadow-glow-primary'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      ]"
    >
      <span class="material-symbols-outlined text-xl">notifications</span>
      <span>Notifications</span>
    </router-link>

    <router-link
        to="/panel/security"
        :class="[
        'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        activePage === 'security'
          ? 'bg-primary/10 border border-primary/50 text-primary shadow-glow-primary'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      ]"
    >
      <span class="material-symbols-outlined text-xl">security</span>
      <span>Security Settings</span>
    </router-link>

  </nav>
</template>

<script setup>
defineProps({
  activePage: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.shadow-glow-primary {
  box-shadow: 0 0 10px 2px rgba(249, 0, 255, 0.3);
}
</style>