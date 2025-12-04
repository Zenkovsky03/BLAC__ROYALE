<template>
  <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-background-dark border border-secondary/30 rounded-xl p-6 w-full max-w-2xl shadow-glow-secondary max-h-[90vh] overflow-y-auto my-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-secondary">💣 Minesweeper</h2>
        <button @click="$emit('close')" class="text-white/60 hover:text-white text-3xl">×</button>
      </div>
      <div v-if="!gameStarted" class="flex flex-col gap-6 mb-8">

        <div class="flex gap-4 items-center">
          <label class="text-white font-medium">Bet Amount:</label>
          <div class="select-wrapper">
            <select v-model="betAmount" class="bg-background-dark border border-secondary/30 text-white px-3 py-2 rounded">
              <option value="10">$10</option>
              <option value="25">$25</option>
              <option value="50">$50</option>
              <option value="100">$100</option>
            </select>
          </div>
        </div>

        <div class="flex gap-4 items-center">
          <label class="text-white font-medium">Grid Size:</label>
          <div class="select-wrapper">
            <select v-model="gridSize" class="bg-background-dark border border-secondary/30 text-white px-3 py-2 rounded">
              <option v-for="n in [2,3,4,5]" :key="n" :value="n">{{ n }} x {{ n }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-4 items-center">
          <label class="text-white font-medium">Bombs:</label>
          <div class="select-wrapper">
            <select v-model="bombs" class="bg-background-dark border border-secondary/30 text-white px-3 py-2 rounded">
              <option v-for="n in bombOptions" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>

        <button @click="startGame" class="spin-button">START</button>
      </div>
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <div class="text-white">Bet: <span class="font-bold text-secondary">${{ betAmount }}</span></div>
          <div class="text-white">Multiplier: <span class="font-bold text-secondary">x{{ multiplier.toFixed(2) }}</span></div>
          <div class="text-white">Balance: <span class="font-bold text-secondary">${{ balance.toFixed(2) }}</span></div>
        </div>
        <div class="minesweeper-grid" :style="gridStyle">
          <div v-for="(cell, idx) in cells" :key="idx" class="minesweeper-cell" :class="cellClass(cell)" @click="revealCell(idx)">
            <span v-if="cell.revealed && !cell.bomb">x{{ cell.multiplier }}</span>
            <span v-if="cell.revealed && cell.bomb">💣</span>
          </div>
        </div>
        <div class="flex gap-4 mt-6 justify-center">
          <button @click="cashOut" :disabled="!canCashOut || cashOutPressed" class="spin-button" :class="{ 'disabled-btn': !canCashOut || cashOutPressed }">CASH OUT</button>
          <button @click="resetGame" class="spin-button">RESET</button>
        </div>
        <div v-if="lastResult" class="result-display mt-6">{{ lastResult }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])
const betAmount = ref(10)
const gridSize = ref(3)
const bombs = ref(1)
const gameStarted = ref(false)
const cells = ref([])
const revealedCount = ref(0)
const multiplier = ref(1)
const lastResult = ref('')
const canCashOut = ref(false)
const cashOutPressed = ref(false)

const bombOptions = computed(() => {
  const maxBombs = gridSize.value * gridSize.value - 1
  return Array.from({length: maxBombs}, (_, i) => i + 1)
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`
}))

function startGame() {
  // Generate bombs
  const totalCells = gridSize.value * gridSize.value
  const bombIndices = new Set()
  while (bombIndices.size < bombs.value) {
    bombIndices.add(Math.floor(Math.random() * totalCells))
  }
  // Calculate probability-based multiplier
  const probability = (totalCells - bombs.value) / totalCells
  const baseMultiplier = 1 / probability
  cells.value = Array.from({length: totalCells}, (_, i) => ({
    bomb: bombIndices.has(i),
    revealed: false,
    multiplier: baseMultiplier.toFixed(2)
  }))
  revealedCount.value = 0
  multiplier.value = 1
  lastResult.value = ''
  canCashOut.value = false
  gameStarted.value = true
}

function cellClass(cell) {
  return {
    revealed: cell.revealed,
    bomb: cell.bomb && cell.revealed
  }
}

function revealCell(idx) {
  if (cells.value[idx].revealed || lastResult.value) return
  cells.value[idx].revealed = true
  if (cells.value[idx].bomb) {
    lastResult.value = '💣 You hit a bomb! You lost.'
    multiplier.value = 0
    canCashOut.value = false
    emit('balanceChange', -betAmount.value)
  } else {
    revealedCount.value++
    multiplier.value *= parseFloat(cells.value[idx].multiplier)
    canCashOut.value = true
  }
}

function cashOut() {
  if (!canCashOut.value || multiplier.value === 0 || cashOutPressed.value) return
  cashOutPressed.value = true
  const payout = betAmount.value * multiplier.value
  emit('balanceChange', payout)
  lastResult.value = `You cashed out $${payout.toFixed(2)}!`
  canCashOut.value = false
}
function resetGame() {
  gameStarted.value = false
  cells.value = []
  revealedCount.value = 0
  multiplier.value = 1
  lastResult.value = ''
  canCashOut.value = false
  cashOutPressed.value = false
}
</script>

<style scoped>
.select-wrapper {
  position: relative;
}

.select-wrapper select {

  -webkit-appearance: none;

  -moz-appearance: none;

  appearance: none;

  padding-right: 2.5rem;
}


.select-wrapper::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: #00f6ff;
  font-size: 0.8rem;
}


.minesweeper-grid {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
}
.minesweeper-cell {
  background: #222;
  color: #fff;
  border-radius: 0.5rem;
  padding: 2rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  border: 2px solid #444;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, transform 0.4s;
  box-shadow: 0 0 12px 2px #00f6ff44;
}
.minesweeper-cell.revealed {
  background: linear-gradient(90deg, #00f6ff 0%, #f900ff 100%);
  color: #0c011f;
  border-color: #00f6ff;
  box-shadow: 0 0 24px 4px #00f6ffcc;
}
.minesweeper-cell.bomb {
  background: #ff0055;
  color: #fff;
  border-color: #ff0055;
  box-shadow: 0 0 24px 4px #ff0055cc;
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
}
.disabled-btn {
  background: #444 !important;
  color: #aaa !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
}
.result-display {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #00f6ff;
  text-align: center;
}
</style>
