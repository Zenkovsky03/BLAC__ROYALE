<template>
  <section class="px-4 sm:px-6 lg:px-8">
    <div class="@container">
      <div class="@[480px]:p-0">
        <div
            class="flex min-h-[480px] flex-col gap-6 rounded-xl border border-primary/20 bg-cover bg-center bg-no-repeat p-8 text-center shadow-2xl shadow-primary/10 @[480px]:gap-8 items-center justify-center"
            :style="backgroundStyle"
        >
          <div class="flex flex-col gap-2">
            <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
              Enter the Realm of Blac Royale
            </h1>
            <h2 class="mx-auto max-w-lg text-secondary text-sm font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
              Claim Your 200% Welcome Bonus & 100 Free Spins. Your Cyberpunk Adventure Awaits.
            </h2>
          </div>
          <button
              class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 @[480px]:h-14 @[480px]:px-8 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-transform hover:scale-105 shadow-glow-primary-strong"
          >
            <span class="truncate">Play Now</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

defineEmits(['playNow'])

const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgba(12, 1, 31, 0.7) 0%, rgba(12, 1, 31, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDbQ2AuLVFuo0yIpLO_LzGXqx31EoMTpo-UMNsXYckaZfyudTnRcu-Gv-RwMFxvRqBF92JW6y4GGN-e3yxlsTYUcbxxwlku8e-ZqBG5xuTVffNle23z1hwXt9HHeQ44PlBhr_rds5x1dqB6bFSl595O9uarG6omYdBKGzaEc5XTA-4yUbsa24tPEeNj47AN8g2tKngLuiWr2C9AcX6D03wgQ7MEHRy8lqskbmQ-50QYvYzLqsnVtb9ohdfxL6W56ZuNd83xU7qBLk")`
}))
</script>

<style scoped>
.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}

.shadow-primary\/10 {
  box-shadow: 0 25px 50px -12px rgba(249, 0, 255, 0.1);
}
</style>
