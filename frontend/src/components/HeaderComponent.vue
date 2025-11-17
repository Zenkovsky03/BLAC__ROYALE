<template>
  <header class="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-4 text-white">
      <div class="size-8 text-primary">
        <img src="../../assets/logo_prototype.jpeg" alt="">
      </div>
      <h2 class="text-white text-2xl font-black leading-tight tracking-wider uppercase">Blac Royale</h2>
    </div>
    <div class="flex-1 justify-end gap-8 md:flex">
      <div class="flex items-center gap-9">
        <a class="text-white text-sm font-medium leading-normal transition-colors hover:text-primary" href="#games">Games</a>
        <a class="text-white text-sm font-medium leading-normal transition-colors hover:text-primary" href="#leaderboard">Leaderboard</a>
      </div>
      <div class="flex gap-2">
        <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-primary/20 hover:text-white hover:shadow-glow-primary"
        >
          <span class="truncate">Sign Up</span>
        </button>
        <button
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:bg-primary/20 hover:text-white hover:shadow-glow-primary"
        >
          <span class="truncate">Login</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.shadow-glow-primary-strong {
  box-shadow: 0 0 25px 8px rgba(249, 0, 255, 0.7), 0 0 10px 3px rgba(249, 0, 255, 0.7) inset;
}

.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
</style>
