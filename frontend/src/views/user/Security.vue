<template>
  <PanelSectionLayout active-page="security">

    <div class="flex flex-col gap-8">

      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold uppercase tracking-widest text-primary">Security Settings</h2>
        <p class="text-sm text-white/70">Enhance your account's protection by managing two-factor authentication, login activity, and linked devices.</p>
      </div>

      <div class="flex flex-col gap-6">

        <div class="flex flex-col gap-4 rounded-lg border border-white/20 bg-background-dark/50 p-4">
          <h3 class="font-semibold text-secondary">Two-Factor Authentication (2FA)</h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative flex h-6 w-6 items-center justify-center">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
                <span class="relative inline-flex h-3 w-3 rounded-full bg-secondary"></span>
              </div>
              <span class="text-sm font-medium text-white">2FA is currently <span class="text-secondary">Enabled</span></span>
            </div>
            <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-primary/20 hover:text-white hover:shadow-glow-primary">
              <span class="truncate">Disable 2FA</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-4 rounded-lg border border-white/20 bg-background-dark/50 p-4">
          <h3 class="font-semibold text-secondary">Recent Login Activity</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
              <tr class="border-b border-white/20 text-white/60">
                <th class="p-2 font-medium">Device</th>
                <th class="p-2 font-medium">Location</th>
                <th class="p-2 font-medium">Date</th>
                <th class="p-2 font-medium">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-b border-white/20">
                <td class="p-2">Chrome on Windows</td>
                <td class="p-2">Neo-Tokyo, JP</td>
                <td class="p-2">2099-05-20 12:45 UTC</td>
                <td class="p-2 text-secondary">Active Now</td>
              </tr>
              <tr>
                <td class="p-2">Safari on macOS</td>
                <td class="p-2">Cyberia, US</td>
                <td class="p-2">2099-05-19 08:12 UTC</td>
                <td class="p-2 text-white/70">Success</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end">
            <a class="text-sm font-medium text-primary hover:underline" href="#">View all activity</a>
          </div>
        </div>

        <div class="flex flex-col gap-4 rounded-lg border border-white/20 bg-background-dark/50 p-4">
          <h3 class="font-semibold text-secondary">Manage Linked Devices</h3>

          <div class="flex items-center justify-between border-b border-white/20 py-3">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary text-2xl">desktop_windows</span>
              <div>
                <p class="font-medium text-white">Desktop-RTX4090</p>
                <p class="text-xs text-white/60">Windows 11, Chrome - Last active today</p>
              </div>
            </div>
            <button class="text-sm font-medium text-primary/80 transition-colors hover:text-primary">Revoke</button>
          </div>

          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary text-2xl">phone_iphone</span>
              <div>
                <p class="font-medium text-white">CyberPhone-15 Pro</p>
                <p class="text-xs text-white/60">iOS 25.1, App - Last active 2 days ago</p>
              </div>
            </div>
            <button class="text-sm font-medium text-primary/80 transition-colors hover:text-primary">Revoke</button>
          </div>
        </div>

      </div>
    </div>
  </PanelSectionLayout>
</template>

<script setup>
import PanelSectionLayout from '@/views/user/PanelSectionLayout.vue';
</script>

<style scoped>

.shadow-glow-primary {
  box-shadow: 0 0 15px 5px rgba(249, 0, 255, 0.4);
}
</style>