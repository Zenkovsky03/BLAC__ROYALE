<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-background-dark border border-secondary/30 rounded-xl p-6 w-full max-w-xl shadow-glow-secondary max-h-[90vh] overflow-y-auto my-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-secondary">🎚️ Slider Game</h2>
        <button @click="$emit('close')" class="text-white/60 hover:text-white text-3xl">×</button>
      </div>
      <div v-if="!gameStarted" class="flex flex-col gap-6 mb-8">
        <div class="flex gap-4 items-center">
          <label class="text-white font-medium">Bet Amount:</label>
          <select v-model="betAmount" class="bg-background-dark border border-secondary/30 text-white px-3 py-2 rounded">
            <option value="10">$10</option>
            <option value="25">$25</option>
            <option value="50">$50</option>
            <option value="100">$100</option>
          </select>
        </div>
        <div class="flex flex-col gap-2 items-center w-full">
          <label class="text-white font-medium">Select Range:</label>
          <div class="flex flex-col gap-2 w-full">
            <div class="flex gap-2 items-center w-full">
              <span class="text-secondary font-bold">Min: {{ min }}</span>
              <input type="range" min="1" :max="max-1" v-model.number="min" class="slider-range" />
            </div>
            <div class="flex gap-2 items-center w-full">
              <span class="text-secondary font-bold">Max: {{ max }}</span>
              <input type="range" :min="min+1" max="100" v-model.number="max" class="slider-range" />
            </div>
          </div>
        </div>
        <div class="text-white">Multiplier: <span class="font-bold text-secondary">x{{ multiplier.toFixed(2) }}</span></div>
        <button @click="startGame" class="spin-button">SET RANGE</button>
      </div>
      <div v-else>
        <div class="flex flex-col gap-4 mb-6">
          <div class="text-white">Choose your number:</div>
          <input type="range" :min="min" :max="max" v-model.number="chosenNumber" class="slider-range" :disabled="playPressed" />
          <div class="text-secondary text-2xl font-bold">{{ chosenNumber }}</div>
        </div>
        <button @click="playGame" class="spin-button mb-4" :disabled="playPressed" :class="{ 'disabled-btn': playPressed }">PLAY</button>
        <button @click="resetGame" class="spin-button">RESET</button>
        <div v-if="result" class="result-display mt-6">{{ result }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])
const betAmount = ref(10)
const min = ref(1)
const max = ref(100)
const chosenNumber = ref(1)
const gameStarted = ref(false)
const result = ref('')
const playPressed = ref(false)

const multiplier = computed(() => {
  return (max.value - min.value + 1)
})

function startGame() {
  if (min.value >= max.value) return
  chosenNumber.value = min.value
  result.value = ''
  gameStarted.value = true
}

function playGame() {
  if (playPressed.value) return
  playPressed.value = true
  const winNumber = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value
  if (chosenNumber.value === winNumber) {
    const payout = betAmount.value * multiplier.value
    emit('balanceChange', payout)
    result.value = `🎉 You won! Number was ${winNumber}. You win $${payout.toFixed(2)}!`
  } else {
    emit('balanceChange', -betAmount.value)
    result.value = `😢 You lost! Number was ${winNumber}. Try again!`
  }
}

function resetGame() {
  gameStarted.value = false
  result.value = ''
  min.value = 1
  max.value = 100
  betAmount.value = 10
  chosenNumber.value = 1
  playPressed.value = false
}
</script>

<style scoped>
.slider-range {
  width: 100%;
  accent-color: #00f6ff;
  margin-top: 1rem;
}
.spin-button {
  background: linear-gradient(90deg, #00f6ff 0%, #f900ff 100%);
  color: #0c011f;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 20px 5px rgba(0,246,255,0.3);
  transition: transform 0.2s;
  margin-top: 1rem;
}
.result-display {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #00f6ff;
  text-align: center;
}
.disabled-btn {
  background: #444 !important;
  color: #aaa !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}
</style>
