<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-background-dark border border-secondary/30 rounded-xl p-6 w-full max-w-md shadow-glow-secondary max-h-[90vh] overflow-y-auto my-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-secondary">🪙 Coinflip</h2>
        <button @click="$emit('close')" class="text-white/60 hover:text-white text-3xl">×</button>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <label class="text-white font-medium">Bet:</label>
          <select v-model="betAmount" class="bg-background-dark border border-secondary/30 text-white px-3 py-2 rounded">
            <option :value="5">$5</option>
            <option :value="10">$10</option>
            <option :value="25">$25</option>
            <option :value="50">$50</option>
            <option :value="100">$100</option>
          </select>
          <div class="text-white/70 text-sm">Balance: <span class="text-secondary font-bold">$ {{ displayBalance }}</span></div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-white font-medium">Choose side:</div>
          <div class="flex gap-3">
            <button @click="selectedSide = 'heads'" :class="['choice-btn', { active: selectedSide === 'heads' }]" :disabled="playPressed">Heads</button>
            <button @click="selectedSide = 'tails'" :class="['choice-btn', { active: selectedSide === 'tails' }]" :disabled="playPressed">Tails</button>
          </div>
        </div>

        <div class="flex items-center justify-center mt-4 mb-4">
          <div class="coin-scene">
            <div class="coin" :class="{ flipping: playPressed, 'result-heads': coinResult === 'heads', 'result-tails': coinResult === 'tails' }">
              <div class="coin-face coin-front">H</div>
              <div class="coin-face coin-back">T</div>
            </div>
          </div>
        </div>

        <div v-if="result" class="result-display mt-2 text-center">{{ result }}</div>

        <div class="flex items-center justify-center gap-3 mt-4">
          <button @click="flipCoin" class="spin-button" :disabled="playPressed">{{ result ? 'PLAY AGAIN' : 'FLIP' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])

const betAmount = ref(10)
const selectedSide = ref<'heads'|'tails'>('heads')
const playPressed = ref(false)
const result = ref('')
const flippedSide = ref('')
const coinResult = ref<'heads'|'tails'|''>('')

const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

function flipCoin() {
  if (playPressed.value) return
  playPressed.value = true
  result.value = ''
  flippedSide.value = ''
  coinResult.value = '' // reset coin result to retrigger animation

  const bet = Number(betAmount.value)
  // small delay to simulate flip + show animation
  const ANIM_MS = 800
  setTimeout(() => {
    const flip = Math.random() < 0.5 ? 'heads' : 'tails'
    flippedSide.value = flip
    coinResult.value = flip
    if (selectedSide.value === flip) {
      const payout = bet * 2
      emit('balanceChange', payout)
      result.value = `🎉 You won! Flipped ${flip}. You win $${(payout).toFixed(2)}!`
    } else {
      emit('balanceChange', -bet)
      result.value = `😢 You lost! Flipped ${flip}. You lose $${bet.toFixed(2)}.`
    }
    // stop spinning after setting the result class so coin shows final face
    playPressed.value = false
  }, ANIM_MS)
}

function resetRound() {
  result.value = ''
  flippedSide.value = ''
  coinResult.value = ''
  playPressed.value = false
  selectedSide.value = 'heads'
  betAmount.value = 10
}
</script>

<style scoped>
.choice-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: #222;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.06);
}
.choice-btn.active {
  background: linear-gradient(90deg, #00f6ff 0%, #f900ff 100%);
  color: #0c011f;
  box-shadow: 0 0 18px rgba(0,246,255,0.15);
}
.spin-button {
  background: linear-gradient(90deg, #00f6ff 0%, #f900ff 100%);
  color: #0c011f;
  font-weight: bold;
  padding: 0.6rem 1.25rem;
  border-radius: 0.6rem;
}
.spin-button.secondary {
  background: #333;
  color: #fff;
}
.result-display {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #00f6ff;
}

/* Coin flip animation */
.coin-scene {
  perspective: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
}
.coin {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transform-style: preserve-3d;
}
.coin.flipping {
  animation: flipAnimation 0.8s ease-out forwards;
}
.coin.result-heads {
  transform: rotateY(0deg);
}
.coin.result-tails {
  transform: rotateY(180deg);
}
.coin-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: #0c011f;
  border-radius: 50%;
  backface-visibility: hidden;
}
.coin-front {
  background: radial-gradient(circle at 30% 30%, #ffd966, #f6b40a);
}
.coin-back {
  background: radial-gradient(circle at 30% 30%, #cfeaff, #7fb1ff);
  transform: rotateY(180deg);
}

@keyframes flipAnimation {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(3600deg); }
}

</style>
