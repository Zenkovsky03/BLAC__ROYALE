<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">

    <div class="relative my-8 flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">💣</span>
          <div class="flex flex-col">
            <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow leading-none">
              Casino Mines
            </h2>
            <span class="text-xs text-primary font-bold tracking-[0.2em] uppercase">Provably Fair</span>
          </div>
        </div>
        <button @click="$emit('close')" class="group rounded-full bg-white/5 p-2 transition-all hover:bg-red-500/20">
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">

        <div v-if="!gameStarted" class="flex flex-col gap-8 animate-in fade-in zoom-in duration-300">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">payments</span> Bet Amount:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="betAmount" class="setting-select">
                  <option :value="10">$10</option>
                  <option :value="25">$25</option>
                  <option :value="50">$50</option>
                  <option :value="100">$100</option>
                </select>
              </div>
            </div>

            <div class="setting-group">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">grid_on</span> Grid Size:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="gridSize" class="setting-select">
                  <option :value="3">3 x 3</option>
                  <option :value="4">4 x 4</option>
                  <option :value="5">5 x 5</option>
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

          <div class="flex flex-col items-center gap-4 mt-4">
            <button
                @click="startGame"
                :disabled="betAmount > (props.balance || 0) || isProcessing"
                class="cyber-button-start mx-auto w-full max-w-md transition-all"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': betAmount > (props.balance || 0) || isProcessing }"
            >
              <span v-if="isProcessing" class="material-symbols-outlined animate-spin">sync</span>
              <span v-else class="material-symbols-outlined text-3xl">play_arrow</span>
              {{ isProcessing ? 'STARTING...' : 'START GAME' }}
            </button>

            <div v-if="betAmount > (props.balance || 0)" class="text-red-500 font-bold uppercase tracking-wider text-sm animate-pulse">
              Insufficient Funds! (Available: ${{ displayBalance }})
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div class="grid grid-cols-3 gap-4 rounded-xl bg-[#111] p-4 border border-white/10 shadow-inner relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

            <div class="digital-readout z-10">
              <span class="label text-white/50">BET</span>
              <span class="value text-white">${{ betAmount }}</span>
            </div>
            <div class="digital-readout z-10 border-x border-white/10">
              <span class="label text-primary font-bold">MULTIPLIER</span>
              <span class="value text-3xl text-primary drop-shadow-[0_0_10px_rgba(184,79,246,0.8)]">x{{ currentMultiplier.toFixed(2) }}</span>
            </div>
            <div class="digital-readout z-10">
              <span class="label text-green-400/70">CURRENT PROFIT</span>
              <span class="value text-green-400">${{ (betAmount * currentMultiplier).toFixed(2) }}</span>
            </div>
          </div>

          <div class="game-board-container relative">
            <div class="minesweeper-grid" :style="gridStyle">
              <div
                  v-for="(cell, idx) in cells"
                  :key="idx"
                  class="minesweeper-cell group"
                  :class="getCellClasses(cell)"
                  @click="revealCell(idx)"
              >
                <div class="cell-content">
                  <div v-if="cell.revealed && !cell.isBomb" class="icon-wrapper diamond-anim">
                    <span class="text-4xl filter drop-shadow-[0_0_15px_#00f6ff]">💎</span>
                  </div>

                  <div v-if="cell.revealed && cell.isBomb" class="icon-wrapper bomb-anim">
                    <span class="text-4xl filter drop-shadow-[0_0_20px_#ef4444]">💀</span>
                  </div>
                </div>

                <div v-if="!cell.revealed && !gameOver" class="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
            </div>

            <div v-if="isProcessing" class="absolute inset-0 z-50 cursor-wait"></div>
          </div>

          <div class="h-10 flex items-center justify-center">
            <div v-if="lastResult" class="text-2xl font-black tracking-widest uppercase animate-bounce-in"
                 :class="lastResult.includes('Over') ? 'text-red-500 text-shadow-red' : 'text-green-400 text-shadow-green'">
              {{ lastResult }}
            </div>
          </div>

          <div class="flex gap-4 justify-center">
            <button
                v-if="!gameOver"
                @click="cashOut"
                :disabled="currentMultiplier <= 1 || isProcessing"
                class="cyber-button-cashout flex-1 max-w-[280px] h-[60px]"
                :class="{ 'opacity-50 grayscale cursor-not-allowed': currentMultiplier <= 1 || isProcessing, 'pulse-green-btn': currentMultiplier > 1 }"
            >
              <div class="flex flex-col items-center leading-none">
                <span class="text-lg font-bold">CASH OUT</span>
                <span v-if="currentMultiplier > 1" class="text-xs opacity-90">${{ (betAmount * currentMultiplier).toFixed(2) }}</span>
              </div>
            </button>

            <button
                v-if="gameOver"
                @click="resetGame"
                class="cyber-button-reset flex-1 max-w-[280px] h-[60px]"
            >
              <span class="material-symbols-outlined mr-2">restart_alt</span>
              PLAY AGAIN
            </button>
          </div>
        </div>

        <div class="mt-8 border-t border-white/10 pt-6">
          <details class="group rounded-xl bg-black/40 border border-white/5 overflow-hidden transition-all open:border-primary/30">
            <summary class="flex cursor-pointer items-center justify-between p-4 font-bold text-white hover:bg-white/5 select-none transition-colors">
              <div class="flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                <span class="material-symbols-outlined text-primary">calculate</span>
                How Multiplier Works?
              </div>
              <span class="material-symbols-outlined transition-transform group-open:rotate-180 text-white/50">expand_more</span>
            </summary>

            <div class="p-6 pt-2 text-white/80 space-y-4 bg-[#080808] text-sm">
              <p class="mb-4">
                In Casino Mines, there are no numbers. It's pure probability. The more bombs you choose, the harder it is to find a diamond, but the payout is massive.
              </p>

              <div class="grid gap-3 p-4 rounded bg-white/5 border border-white/10">
                <h4 class="font-bold text-primary mb-1">🧮 The Formula:</h4>
                <div class="font-mono text-xs text-green-400 bg-black p-2 rounded">
                  Multiplier = Previous_Mult * (1 / Probability) * 0.99
                </div>

                <div class="space-y-2 mt-2">
                  <div class="flex justify-between border-b border-white/10 pb-1">
                    <span>Example:</span>
                    <span class="text-white/50">25 Tiles, 5 Bombs</span>
                  </div>
                  <div class="flex justify-between">
                    <span>1st Click Safe:</span>
                    <span class="text-green-400">20/25 safe (80%) -> x1.23</span>
                  </div>
                  <div class="flex justify-between">
                    <span>2nd Click Safe:</span>
                    <span class="text-green-400">19/24 safe (79%) -> x1.54</span>
                  </div>
                  <div class="flex justify-between">
                    <span>...</span>
                    <span>...</span>
                  </div>
                  <div class="flex justify-between font-bold text-red-400">
                    <span>HITTING A BOMB:</span>
                    <span>LOSS (x0.00)</span>
                  </div>
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
import { useAuthStore } from '@/stores/auth'
import confetti from 'canvas-confetti'

const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

// Funkcja confetti przy wygranej w minesweeper
function fireMinesweeperConfetti() {
  // Konfetti w kolorach związanych z kopalnią i diamentami
  confetti({
    particleCount: 100,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#00f6ff', '#ffd700', '#c0c0c0', '#87ceeb', '#98fb98', '#dda0dd']
  })

  // Dodatkowy burst z lewej strony
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 45,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#00f6ff', '#ffd700', '#c0c0c0']
    })
  }, 200)

  // Dodatkowy burst z prawej strony
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 45,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#87ceeb', '#98fb98', '#dda0dd']
    })
  }, 400)
}

// === STATE ===
const betAmount = ref(10)
const gridSize = ref(5)
const bombs = ref(3)
const gameStarted = ref(false)
const gameOver = ref(false)
const isProcessing = ref(false)
const lastResult = ref('')
const currentMultiplier = ref(1.0)
const cells = ref([])

// === COMPUTED ===
const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

const bombOptions = computed(() => {
  const maxBombs = (gridSize.value * gridSize.value) - 1
  const options = []
  // Ograniczamy wybór bomb dla sensownej gry
  for (let i = 1; i <= Math.min(maxBombs, 24); i++) options.push(i)
  return options
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
  gap: '10px' // Stały odstęp
}))

// === HELPERS ===
function parseMapString(mapStr) {
  if (!mapStr) return []
  return mapStr.split('').map(char => {
    if (char === '?') return { revealed: false, isBomb: false }
    if (char === '.') return { revealed: true, isBomb: true } // Tylko przy przegranej
    return { revealed: true, isBomb: false } // Cyfra = Bezpieczne
  })
}

function getCellClasses(cell) {
  const base = 'bg-[#1a1a1a] border border-white/5 rounded-lg shadow-lg relative overflow-hidden transition-all duration-200'

  if (!cell.revealed) {
    return `${base} cursor-pointer hover:bg-[#252525] hover:border-primary/30 hover:shadow-[0_0_15px_rgba(184,79,246,0.1)] active:scale-95`
  }

  if (cell.isBomb) {
    return `${base} bg-red-900/20 border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.4)]`
  }

  // Safe cell (Diamond)
  return `${base} bg-cyan-900/10 border-cyan-500/50 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]`
}

// === LOGIC ===
async function startGame() {
  if (betAmount.value > (props.balance || 0)) return
  isProcessing.value = true
  lastResult.value = ''

  try {
    const res = await fetch(`${API}/api/Sapper/start-sapper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ bombsCount: bombs.value, betAmount: betAmount.value, mapSize: gridSize.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    cells.value = parseMapString(data.map)
    gameStarted.value = true
    gameOver.value = false
    currentMultiplier.value = 1.0
    await auth.fetchBalance()
  } catch (e) { console.error(e) } finally { isProcessing.value = false }
}

async function revealCell(index) {
  if (gameOver.value || isProcessing.value || cells.value[index].revealed) return
  isProcessing.value = true
  const row = Math.floor(index / gridSize.value)
  const col = index % gridSize.value

  try {
    const res = await fetch(`${API}/api/Sapper/play-sapper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ X: row, Y: col })
    })
    const data = await res.json()

    // Zawsze aktualizujemy mapę
    cells.value = parseMapString(data.map)

    if (data.message === 'Game lost.') {
      gameOver.value = true
      lastResult.value = '💀 GAME OVER'
      currentMultiplier.value = 0
      await auth.fetchBalance()
    } else {
      if (data.multiplier) currentMultiplier.value = data.multiplier
    }
  } catch (e) { console.error(e) } finally { isProcessing.value = false }
}

async function cashOut() {
  if (gameOver.value || isProcessing.value) return
  isProcessing.value = true
  try {
    const res = await fetch(`${API}/api/Sapper/resign-sapper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    gameOver.value = true
    if (data.map && data.map.map) cells.value = parseMapString(data.map.map)

    const winAmount = (betAmount.value * currentMultiplier.value).toFixed(2)
    lastResult.value = `💰 WON $${winAmount}`

    // Confetti przy wygranej w minesweeper! 🎉
    setTimeout(() => {
      fireMinesweeperConfetti();
    }, 300);

    await auth.fetchBalance()
  } catch (e) { console.error(e) } finally { isProcessing.value = false }
}

function resetGame() {
  gameStarted.value = false
  gameOver.value = false
  cells.value = []
  currentMultiplier.value = 1.0
  lastResult.value = ''
}
</script>

<style scoped>
/* --- SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }

/* --- NEON & UTILS --- */
.neon-text-glow { text-shadow: 0 0 15px rgba(184, 79, 246, 0.7); }
.text-shadow-green { text-shadow: 0 0 15px rgba(34, 197, 94, 0.8); }
.text-shadow-red { text-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }

.neon-border-blue { border: 1px solid rgba(0, 246, 255, 0.5); box-shadow: 0 0 10px rgba(0, 246, 255, 0.1) inset; }
.neon-border-red { border: 1px solid rgba(239, 68, 68, 0.5); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1) inset; }

/* --- INPUTS --- */
.setting-group { display: flex; flex-direction: column; gap: 0.5rem; }
.setting-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #fff; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
.select-wrapper { position: relative; background: rgba(0,0,0,0.6); border-radius: 0.5rem; overflow: hidden; }
.setting-select { width: 100%; background: transparent; color: #fff; padding: 0.8rem; font-weight: bold; outline: none; appearance: none; cursor: pointer; }
.select-wrapper::after { content: '▼'; position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); pointer-events: none; color: #fff; font-size: 0.7rem; }

/* --- HUD --- */
.digital-readout { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.digital-readout .label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 2px; }
.digital-readout .value { font-family: monospace; font-weight: 700; }

/* --- GRID --- */
.game-board-container {
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  border-radius: 1rem;
}
.minesweeper-grid {
  display: grid;
  width: 100%;
  aspect-ratio: 1; /* Kwadratowa plansza */
}
.minesweeper-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- ANIMACJE IKON --- */
.diamond-anim { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.bomb-anim { animation: shake 0.5s ease-in-out; }

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  75% { transform: translateX(5px) rotate(5deg); }
}

/* --- BUTTONS --- */
.cyber-button-start {
  background: linear-gradient(90deg, #00f6ff, #b84ff6);
  color: #000;
  font-weight: 900;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 20px rgba(184, 79, 246, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.cyber-button-start:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 30px rgba(184, 79, 246, 0.7); }

.cyber-button-cashout {
  background: linear-gradient(135deg, #22c55e, #15803d);
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
  transition: all 0.2s;
}
.cyber-button-cashout:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 0 25px rgba(34, 197, 94, 0.5); }

.cyber-button-reset {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  color: white;
  font-weight: bold;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
.cyber-button-reset:hover { border-color: white; background: rgba(255,255,255,0.05); }

.pulse-green-btn { animation: pulse-green-shadow 2s infinite; }
@keyframes pulse-green-shadow {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
</style>