<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">

    <div class="relative my-8 flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">💣</span>
          <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow">
            Minesweeper
          </h2>
        </div>
        <button @click="$emit('close')" class="group rounded-full bg-white/5 p-2 transition-all hover:bg-red-500/20">
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">

        <div v-if="!gameStarted" class="flex flex-col gap-8">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">payments</span> Bet Amount:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="betAmount" class="setting-select">
                  <option value="10">$10</option>
                  <option value="25">$25</option>
                  <option value="50">$50</option>
                  <option value="100">$100</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">grid_on</span> Grid Size:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="gridSize" class="setting-select">
                  <option v-for="n in [2,3,4,5]" :key="n" :value="n">{{ n }} x {{ n }}</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <label class="setting-label text-red-400"><span class="material-symbols-outlined text-sm">bomb</span> Bombs:</label>
              <div class="select-wrapper neon-border-red">
                <select v-model="bombs" class="setting-select !text-red-400">
                  <option v-for="n in bombOptions" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
            </div>
          </div>

          <button @click="startGame" class="cyber-button-start mx-auto w-full max-w-md">
            <span class="material-symbols-outlined text-3xl">play_arrow</span>
            START GAME
          </button>
        </div>

        <div v-else>
          <div class="mb-6 grid grid-cols-3 gap-4 rounded-xl bg-black/40 p-4 border border-white/10 shadow-inner">
            <div class="digital-readout">
              <span class="label">BET</span>
              <span class="value text-blue-400">${{ betAmount }}</span>
            </div>
            <div class="digital-readout">
              <span class="label">MULTIPLIER</span>
              <span class="value text-primary animate-pulse">x{{ multiplier.toFixed(2) }}</span>
            </div>
            <div class="digital-readout">
              <span class="label">BALANCE</span>
              <span class="value text-green-400">${{ balance.toFixed(2) }}</span>
            </div>
          </div>

          <div class="minesweeper-grid-container p-4 rounded-2xl bg-black/60 border border-white/5 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
            <div class="minesweeper-grid" :style="gridStyle">
              <div
                  v-for="(cell, idx) in cells"
                  :key="idx"
                  class="minesweeper-cell group"
                  :class="cellClass(cell)"
                  @click="revealCell(idx)"
              >
                <div class="cell-content">
                  <span v-if="cell.revealed && !cell.bomb" class="multiplier-text">
                    x{{ cell.multiplier }}
                  </span>
                  <span v-if="cell.revealed && cell.bomb" class="bomb-icon animate-bounce">
                    💀
                  </span>
                </div>
                <div v-if="!cell.revealed" class="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
            </div>
          </div>

          <div v-if="lastResult" class="my-4 text-center text-2xl font-bold tracking-wider" :class="lastResult.includes('lost') ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]'">
            {{ lastResult }}
          </div>

          <div class="flex gap-4 mt-6 justify-center">
            <button
                @click="cashOut"
                :disabled="!canCashOut || cashOutPressed"
                class="cyber-button-cashout flex-1 max-w-[200px]"
                :class="{ 'pulse-green': canCashOut && !cashOutPressed, '!grayscale opacity-50 cursor-not-allowed': !canCashOut || cashOutPressed }"
            >
              <span class="material-symbols-outlined">payments</span>
              CASH OUT
              <span v-if="canCashOut && !cashOutPressed" class="text-sm ml-1">(${{ (betAmount * multiplier).toFixed(2) }})</span>
            </button>
            <button @click="resetGame" class="cyber-button-reset flex-1 max-w-[200px]">
              <span class="material-symbols-outlined">restart_alt</span>
              RESET
            </button>
          </div>
        </div>

        <div class="mt-10 border-t border-white/10 pt-6">
          <details class="group rounded-xl bg-white/5 border border-white/10 overflow-hidden transition-all open:border-primary/50 open:shadow-[0_0_20px_rgba(184,79,246,0.2)]">
            <summary class="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 select-none transition-colors">
              <div class="flex items-center gap-2 text-lg uppercase tracking-wider">
                <span class="material-symbols-outlined text-primary">info</span>
                How to Play
              </div>
              <span class="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div class="p-6 pt-2 text-secondary/90 space-y-4 bg-black/40">
              <div class="flex gap-4 items-start">
                <div class="bg-primary/20 p-2 rounded-lg text-primary"><span class="material-symbols-outlined">settings</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Setup</h4>
                  <p class="text-sm">Choose your Bet Amount, Grid Size, and number of Bombs. More bombs = higher multipliers but higher risk!</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-blue-400/20 p-2 rounded-lg text-blue-400"><span class="material-symbols-outlined">ads_click</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Reveal Tiles</h4>
                  <p class="text-sm">Click on tiles to reveal them. Each safe tile increases your current multiplier.</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400"><span class="material-symbols-outlined">payments</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">3. Cash Out or Risk It</h4>
                  <p class="text-sm">Cash out at any time to take your current winnings. If you hit a bomb (💀), you lose the entire bet!</p>
                </div>
              </div>
            </div>
          </details>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])

// === STATE ===
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

// === COMPUTED ===
const bombOptions = computed(() => {
  const maxBombs = gridSize.value * gridSize.value - 1
  return Array.from({length: maxBombs}, (_, i) => i + 1)
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`
}))

// === GAME LOGIC ===
function startGame() {
  const totalCells = gridSize.value * gridSize.value
  const bombIndices = new Set()
  while (bombIndices.size < bombs.value) {
    bombIndices.add(Math.floor(Math.random() * totalCells))
  }

  // Calculate multiplier based on risk
  const safeCells = totalCells - bombs.value
  // Simple incremental multiplier logic for demonstration (can be made exponential)
  const stepMultiplier = 1 + (bombs.value / totalCells) * 0.5;

  cells.value = Array.from({length: totalCells}, (_, i) => ({
    bomb: bombIndices.has(i),
    revealed: false,
    // We store the POTENTIAL new multiplier if this cell is clicked next
    multiplierStep: stepMultiplier
  }))

  revealedCount.value = 0
  multiplier.value = 1
  lastResult.value = ''
  canCashOut.value = false
  gameStarted.value = true
}

function cellClass(cell) {
  return {
    'is-revealed': cell.revealed,
    'is-bomb': cell.bomb && cell.revealed,
    'is-safe': !cell.bomb && cell.revealed
  }
}

function revealCell(idx) {
  if (cells.value[idx].revealed || lastResult.value || cashOutPressed.value) return

  const cell = cells.value[idx]
  cell.revealed = true

  if (cell.bomb) {
    // GAME OVER
    lastResult.value = '💀 You hit a bomb! You lost.'
    multiplier.value = 0
    canCashOut.value = false
    // Reveal all other bombs
    cells.value.forEach(c => { if(c.bomb) c.revealed = true })
    emit('balanceChange', -betAmount.value)
  } else {
    // SUCCESS
    revealedCount.value++
    // Increase multiplier incrementally based on risk factor
    multiplier.value = multiplier.value * cell.multiplierStep
    // Update cell's displayed multiplier to be the ONE YOU JUST ACHIEVED
    cell.multiplier = multiplier.value.toFixed(2)

    canCashOut.value = true
  }
}

function cashOut() {
  if (!canCashOut.value || multiplier.value === 0 || cashOutPressed.value) return
  cashOutPressed.value = true
  const payout = betAmount.value * multiplier.value
  emit('balanceChange', payout)
  lastResult.value = `💰 CASHED OUT: $${payout.toFixed(2)}!`
  canCashOut.value = false
  // Reveal remaining grid to show where bombs were
  cells.value.forEach(c => c.revealed = true)
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
/* --- SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(184, 79, 246, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(184, 79, 246, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(184, 79, 246, 0.6);
}

/* --- NEON TEXT & BORDERS --- */
.neon-text-glow {
  text-shadow: 0 0 15px rgba(184, 79, 246, 0.7);
}
.neon-border-blue {
  border: 1px solid rgba(0, 246, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset;
  transition: all 0.3s;
}
.neon-border-blue:focus-within {
  border-color: #00f6ff;
  box-shadow: 0 0 20px rgba(0, 246, 255, 0.5) inset, 0 0 10px rgba(0, 246, 255, 0.5);
}
.neon-border-red {
  border: 1px solid rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2) inset;
  transition: all 0.3s;
}
.neon-border-red:focus-within {
  border-color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5) inset, 0 0 10px rgba(239, 68, 68, 0.5);
}

/* --- SETTINGS INPUTS --- */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
}
.select-wrapper {
  position: relative;
  background: rgba(0,0,0,0.4);
  border-radius: 0.75rem;
  overflow: hidden;
}
.setting-select {
  width: 100%;
  background: transparent;
  color: #fff;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: monospace;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}
.select-wrapper::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: currentColor;
  opacity: 0.7;
  font-size: 0.8rem;
}

/* --- DIGITAL READOUTS --- */
.digital-readout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}
.digital-readout .label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
}
.digital-readout .value {
  font-family: monospace;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 10px currentColor;
}

/* --- GRID CELLS --- */
.minesweeper-grid {
  display: grid;
  gap: 0.75rem;
}
.minesweeper-cell {
  aspect-ratio: 1;
  position: relative;
  background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
}
.minesweeper-cell:hover:not(.is-revealed) {
  transform: translateY(-2px);
  border-color: rgba(0, 246, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 246, 255, 0.3);
}
.minesweeper-cell .cell-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* REVEALED STATES */
.minesweeper-cell.is-revealed {
  cursor: default;
  transform: none !important;
}
.minesweeper-cell.is-revealed .cell-content {
  opacity: 1;
  transform: scale(1);
}

/* SAFE CELL */
.minesweeper-cell.is-safe {
  background: linear-gradient(135deg, rgba(0, 246, 255, 0.2), rgba(249, 0, 255, 0.2));
  border-color: #00f6ff;
  box-shadow: 0 0 30px rgba(0, 246, 255, 0.4) inset, 0 0 15px rgba(0, 246, 255, 0.5);
}
.multiplier-text {
  font-weight: 900;
  font-size: 1.3rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 0 15px #00f6ff;
}

/* BOMB CELL */
.minesweeper-cell.is-bomb {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.4), #4a0000);
  border-color: #ef4444;
  box-shadow: 0 0 40px rgba(239, 68, 68, 0.6) inset, 0 0 25px rgba(239, 68, 68, 0.8);
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
.bomb-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 10px #ef4444);
}

/* --- BUTTONS --- */
.cyber-button-start, .cyber-button-cashout, .cyber-button-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0.75rem;
  transition: all 0.3s;
}

.cyber-button-start {
  background: linear-gradient(90deg, #00f6ff, #b84ff6);
  color: #0a0a0a;
  font-size: 1.2rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5);
}
.cyber-button-start:hover {
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 0 40px rgba(184, 79, 246, 0.8);
}

.cyber-button-cashout {
  background: linear-gradient(90deg, #22c55e, #16a34a);
  color: white;
  border: 1px solid #4ade80;
}

.cyber-button-reset {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
}
.cyber-button-reset:hover {
  border-color: white;
  color: white;
  background: rgba(255,255,255,0.05);
}

/* --- ANIMATIONS --- */
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.pulse-green {
  animation: pulse-green 1.5s infinite;
}
@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
</style>