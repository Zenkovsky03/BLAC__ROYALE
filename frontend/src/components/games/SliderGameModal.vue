<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">

    <div class="relative my-8 flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🎚️</span>
          <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow">
            Neon Slider
          </h2>
        </div>
        <button @click="$emit('close')" class="group rounded-full bg-white/5 p-2 transition-all hover:bg-red-500/20">
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6">

        <div class="flex flex-col gap-8">

          <div class="grid grid-cols-2 gap-4 items-end">
            <div class="setting-group w-full">
              <label class="setting-label"><span class="material-symbols-outlined text-sm">payments</span> Bet Amount:</label>
              <div class="select-wrapper neon-border-blue">
                <select v-model="betAmount" class="setting-select" :disabled="isRolling">
                  <option :value="10">$10</option>
                  <option :value="25">$25</option>
                  <option :value="50">$50</option>
                  <option :value="100">$100</option>
                </select>
              </div>
            </div>

            <div class="digital-readout bg-black/40 p-3 rounded-xl border border-white/10 h-[58px] flex justify-center">
              <span class="label">BALANCE</span>
              <span class="value text-green-400">${{ displayBalance }}</span>
            </div>
          </div>

          <div class="rounded-xl bg-white/5 p-6 border border-white/10 space-y-6 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none"
                 :style="{ background: `linear-gradient(90deg, transparent ${min}%, #00f6ff ${min}%, #00f6ff ${max}%, transparent ${max}%)` }">
            </div>

            <div class="flex justify-between items-end mb-2 relative z-10">
              <label class="setting-label text-primary">Define Winning Range</label>
              <div class="text-xs text-secondary/70 uppercase tracking-widest">Range: {{ min }} - {{ max }}</div>
            </div>

            <div class="range-group relative z-10">
              <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                <span>Min</span>
                <span class="text-primary">{{ min }}</span>
              </div>
              <input type="range" min="0" :max="max - 5" v-model.number="min" class="cyber-range" :disabled="isRolling" />
            </div>

            <div class="range-group relative z-10">
              <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                <span>Max</span>
                <span class="text-primary">{{ max }}</span>
              </div>
              <input type="range" :min="min + 5" max="100" v-model.number="max" class="cyber-range" :disabled="isRolling" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="digital-readout bg-black/40 p-4 rounded-xl border border-blue-500/30">
              <span class="label">CHANCE</span>
              <span class="value text-blue-400">{{ winChance }}%</span>
            </div>
            <div class="digital-readout bg-black/40 p-4 rounded-xl border border-purple-500/30">
              <span class="label">MULTIPLIER</span>
              <span class="value text-primary">x{{ estimatedMultiplier }}</span>
            </div>
            <div class="digital-readout bg-black/40 p-4 rounded-xl border border-green-500/30">
              <span class="label">PAYOUT</span>
              <span class="value text-green-400">${{ (betAmount * estimatedMultiplier).toFixed(2) }}</span>
            </div>
          </div>

          <div class="w-full relative py-6 px-2 bg-black rounded-xl border border-white/20">
            <div class="absolute top-1/2 left-2 right-2 h-2 -translate-y-1/2 bg-[#222] rounded-full overflow-hidden">
              <div class="h-full bg-primary/30"
                   :style="{ marginLeft: `${min}%`, width: `${max - min}%` }"></div>
            </div>

            <div class="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                 :style="{ left: `${resultPosition}%` }">
              <div class="relative -translate-x-1/2">
                <div class="w-1 h-8 bg-white shadow-[0_0_15px_white]"></div>
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xl font-black"
                     :class="isWin ? 'text-green-400' : 'text-white'">
                  {{ Math.round(resultPosition) }}
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-6 text-xs font-mono text-white/30">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          <div v-if="lastResult" class="text-center animate-in fade-in zoom-in duration-300">
            <div class="text-xl font-black uppercase tracking-widest"
                 :class="isWin ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'text-red-500'">
              {{ lastResult }}
            </div>
          </div>

          <div class="flex flex-col items-center gap-2">
            <button
                @click="playGame"
                :disabled="isRolling || betAmount > (props.balance || 0)"
                class="cyber-button-start w-full"
                :class="{ 'grayscale opacity-50 cursor-not-allowed': isRolling || betAmount > (props.balance || 0) }"
            >
              {{ isRolling ? 'ROLLING...' : 'ROLL DICE' }}
            </button>
            <div v-if="betAmount > (props.balance || 0)" class="text-red-500 font-bold uppercase tracking-wider text-sm animate-pulse">
              Insufficient Funds!
            </div>
          </div>

        </div>

        <div class="mt-4 border-t border-white/10 pt-6">
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
                <div class="bg-primary/20 p-2 rounded-lg text-primary"><span class="material-symbols-outlined">linear_scale</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Set Range</h4>
                  <p class="text-sm">Adjust Min and Max sliders. Smaller range = Lower Chance = <strong>Higher Payout</strong>.</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400"><span class="material-symbols-outlined">casino</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Roll</h4>
                  <p class="text-sm">Click Roll. If the random number lands inside your blue range, you win!</p>
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

const props = defineProps({ balance: Number })
const emit = defineEmits(['close', 'balanceChange'])

const auth = useAuthStore()
const API = import.meta.env.VITE_API_URL || ''

// State
const betAmount = ref(10)
const min = ref(25)
const max = ref(75)
const isRolling = ref(false)
const lastResult = ref('')
const isWin = ref(false)
const resultPosition = ref(50) // Pozycja suwaka wyniku (0-100)

// Computed
const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

const rangeSize = computed(() => max.value - min.value)
const winChance = computed(() => rangeSize.value)

// Estymacja mnożnika (Taka sama logika jak w poprawionym backendzie)
const estimatedMultiplier = computed(() => {
  if (rangeSize.value === 0) return 0
  const houseEdge = 0.98
  return ((100 / rangeSize.value) * houseEdge).toFixed(2)
})

// Logic
async function playGame() {
  if (isRolling.value) return
  if (betAmount.value > (props.balance || 0)) return

  isRolling.value = true
  lastResult.value = ''
  isWin.value = false

  // Efekt "szukania" wyniku przed zatrzymaniem
  const interval = setInterval(() => {
    resultPosition.value = Math.random() * 100
  }, 50)

  try {
    const res = await fetch(`${API}/api/games/play-slider`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        bet: betAmount.value,
        min: min.value,
        max: max.value
      })
    })

    const data = await res.json()

    // Zatrzymaj losową animację
    clearInterval(interval)

    if (!res.ok) throw new Error(data.error || 'Game Error')

    const winningNumber = data.num // Liczba z backendu
    const winAmount = data.winAmount

    // Animacja do docelowej liczby
    resultPosition.value = winningNumber

    // Opóźnienie na pokazanie wyniku
    setTimeout(async () => {
      // Pobierz stan konta z bazy (backend już zaktualizował)
      await auth.fetchBalance()

      if (winAmount > 0) {
        isWin.value = true
        lastResult.value = `HIT! ${winningNumber} is in range! WON $${winAmount}`
      } else {
        isWin.value = false
        lastResult.value = `MISS. ${winningNumber} is outside.`
      }

      isRolling.value = false
    }, 500)

  } catch (error) {
    clearInterval(interval)
    console.error(error)
    lastResult.value = 'Error connecting to server'
    isRolling.value = false
  }
}

function resetGame() {
  lastResult.value = ''
  isWin.value = false
  resultPosition.value = 50
}
</script>

<style scoped>
/* --- SUWAKI CYBERPUNK --- */
.cyber-range {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #1a1a1a;
  border-radius: 3px;
  outline: none;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
  transition: all 0.3s;
}

.cyber-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #00f6ff;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: 0 0 10px #00f6ff;
  border: 2px solid white;
  transform: translateY(-7px);
  transition: transform 0.1s, box-shadow 0.2s;
}

.cyber-range::-webkit-slider-thumb:hover {
  transform: translateY(-7px) scale(1.2);
  box-shadow: 0 0 20px #00f6ff;
}

/* --- NEON & GLOW --- */
.neon-text-glow { text-shadow: 0 0 15px rgba(184, 79, 246, 0.7); }
.neon-border-blue { border: 1px solid rgba(0, 246, 255, 0.5); box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset; }

/* --- INPUTS --- */
.setting-group { display: flex; flex-direction: column; gap: 0.75rem; }
.setting-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
.select-wrapper { position: relative; background: rgba(0,0,0,0.4); border-radius: 0.75rem; overflow: hidden; }
.setting-select { width: 100%; background: transparent; color: #fff; padding: 1rem; font-size: 1.1rem; font-weight: bold; font-family: monospace; outline: none; appearance: none; cursor: pointer; }
.select-wrapper::after { content: '▼'; position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); pointer-events: none; color: currentColor; opacity: 0.7; font-size: 0.8rem; }

/* --- READOUTS --- */
.digital-readout { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; }
.digital-readout .label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
.digital-readout .value { font-family: monospace; font-size: 1.5rem; font-weight: 700; text-shadow: 0 0 10px currentColor; }

/* --- BUTTONS --- */
.cyber-button-start {
  display: flex; align-items: center; justify-content: center; padding: 1rem 2rem;
  font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 0.75rem;
  background: linear-gradient(90deg, #00f6ff, #b84ff6); color: #0a0a0a; font-size: 1.1rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5); transition: all 0.3s;
}
.cyber-button-start:not(:disabled):hover { transform: scale(1.02) translateY(-2px); box-shadow: 0 0 40px rgba(184, 79, 246, 0.8); }

.cyber-button-reset {
  background: transparent; border: 2px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7);
  border-radius: 0.75rem; transition: all 0.3s;
}
.cyber-button-reset:hover { border-color: white; color: white; background: rgba(255,255,255,0.05); }

.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }
</style>