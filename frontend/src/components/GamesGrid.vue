<template>
  <section class="flex flex-col gap-8 px-4 sm:px-6 lg:px-8" id="games">
    <h2 class="text-white text-2xl font-bold leading-tight tracking-[-0.015em] px-4 pt-5 md:text-3xl">Enter the Arena</h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <GameCard
          v-for="game in games"
          :key="game.id"
          :game="game"
          @click="$emit('gameClick', game)"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import GameCard from './GameCard.vue'

defineEmits(['gameClick'])

const games = ref([
  {
    id: 'roulette',
    name: 'Roulette',
    icon: '🎲',
    description: 'Spin the wheel in this classic European-style game of chance.'
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: '💣',
    description: 'A thrilling game of logic and chance. Don\'t hit the mines!'
  },
  {
    id: 'slot',
    name: 'Slot',
    icon: '🎰',
    description: 'Classic three-reel system with a futuristic cyberpunk twist.'
  },
  {
    id: 'slider',
    name: 'Slider',
    icon: '🎯',
    description: 'Test your reflexes and precision to hit the jackpot.'
  },
  {
    id: 'coinflip',
    name: 'Coinflip',
    icon: '🪙',
    description: 'The ultimate 50/50. Choose heads or tails and double your bet.'
  }
])
</script>
