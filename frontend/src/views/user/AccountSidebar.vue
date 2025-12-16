<template>
  <nav class="flex flex-col gap-2">

    <router-link
        to="/panel/profile"
        :class="getItemClass('profile')"
    >
      <span class="material-symbols-outlined text-xl">person</span>
      <span>Personal Information</span>
    </router-link>

    <router-link
        to="/panel/password"
        :class="getItemClass('password')"
    >
      <span class="material-symbols-outlined text-xl">lock</span>
      <span>Change Password</span>
    </router-link>

    <router-link
        to="/panel/notifications"
        :class="getItemClass('notifications')"
    >
      <span class="material-symbols-outlined text-xl">notifications</span>
      <span>Notifications</span>
    </router-link>

    <router-link
        to="/panel/security"
        :class="getItemClass('security')"
    >
      <span class="material-symbols-outlined text-xl">security</span>
      <span>Security Settings</span>
    </router-link>

    <div class="my-2 border-t border-white/10"></div>

    <router-link
        to="/home"
        class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
    >
      <span class="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
      <span>Back to Casino</span>
    </router-link>

  </nav>
</template>

<script setup>
const props = defineProps({
  activePage: {
    type: String,
    required: true
  }
});

// Funkcja pomocnicza do klas (żeby nie powtarzać kodu)
const getItemClass = (pageName) => {
  return [
    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    props.activePage === pageName
        ? 'bg-primary/10 border border-primary/50 text-primary shadow-glow-primary'
        : 'text-white/70 hover:bg-white/5 hover:text-white'
  ];
};
</script>

<style scoped>
.shadow-glow-primary {
  box-shadow: 0 0 10px 2px rgba(249, 0, 255, 0.3);
}
</style>