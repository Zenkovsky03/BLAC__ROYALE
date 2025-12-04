<template>
  <div class="group flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-white/5 p-6 text-center transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:shadow-glow-primary cursor-pointer"
       @click="handleGameClick">
    <div class="text-5xl text-primary">{{ game.icon }}</div>
    <h3 class="text-xl font-bold text-white">{{ game.name }}</h3>
    <p class="text-sm text-white/70">{{ game.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
    validator: (game) => game.name && game.icon && game.description
  }
})

</script>

<style scoped>
.shadow-glow-primary {
  box-shadow: 0 0 20px 5px rgba(249, 0, 255, 0.5), 0 0 8px 2px rgba(249, 0, 255, 0.6) inset;
}
</style>