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

        <div v-if="!gameStarted" class="flex flex-col gap-8">

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

          <div class="rounded-xl bg-white/5 p-6 border border-white/10 space-y-6">
            <div class="flex justify-between items-end mb-2">
              <label class="setting-label text-primary">Define Range Difficulty</label>
              <div class="text-xs text-secondary/70 uppercase tracking-widest">Target Range: {{ min }} - {{ max }}</div>
            </div>

            <div class="range-group">
              <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                <span>Min Start</span>
                <span class="text-primary">{{ min }}</span>
              </div>
              <input type="range" min="1" :max="max - 1" v-model.number="min" class="cyber-range" />
            </div>

            <div class="range-group">
              <div class="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                <span>Max End</span>
                <span class="text-primary">{{ max }}</span>
              </div>
              <input type="range" :min="min + 1" max="100" v-model.number="max" class="cyber-range" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="digital-readout bg-black/40 p-4 rounded-xl border border-blue-500/30">
              <span class="label">MULTIPLIER</span>
              <span class="value text-blue-400">x{{ multiplier.toFixed(2) }}</span>
            </div>
            <div class="digital-readout bg-black/40 p-4 rounded-xl border border-purple-500/30">
              <span class="label">WIN CHANCE</span>
              <span class="value text-primary">{{ winChance }}%</span>
            </div>
          </div>

          <button @click="startGame" class="cyber-button-start w-full">
            LOCK RANGE & START
          </button>
        </div>

        <div v-else class="flex flex-col items-center gap-8 py-4">

          <div class="text-center space-y-2">
            <h3 class="text-white/60 text-sm uppercase tracking-widest">Guess the number between</h3>
            <div class="text-2xl font-black text-white flex gap-4 justify-center items-center">
              <span class="bg-white/10 px-3 py-1 rounded text-primary">{{ min }}</span>
              <span class="text-white/30">-</span>
              <span class="bg-white/10 px-3 py-1 rounded text-primary">{{ max }}</span>
            </div>
          </div>

          <div class="w-full relative py-4">
            <input type="range" :min="min" :max="max" v-model.number="chosenNumber" class="cyber-range large-thumb" :disabled="playPressed" />

            <div class="flex justify-between mt-2 text-xs font-mono text-white/30">
              <span>{{ min }}</span>
              <span>{{ max }}</span>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative border-2 border-primary bg-black/80 w-32 h-32 flex items-center justify-center rounded-2xl shadow-[0_0_30px_rgba(184,79,246,0.4)]">
              <span class="text-5xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                {{ chosenNumber }}
              </span>
            </div>
            <div class="text-center mt-4 text-xs font-bold uppercase tracking-widest text-primary">Your Choice</div>
          </div>

          <div v-if="result" class="w-full text-center p-4 rounded-xl border animate-in fade-in zoom-in duration-300"
               :class="isWin ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'">
            <div class="text-lg font-bold uppercase tracking-widest mb-1">{{ isWin ? 'Victory!' : 'Defeat' }}</div>
            <div class="text-sm opacity-90">{{ result }}</div>
          </div>

          <div class="flex gap-4 w-full">
            <button
                @click="playGame"
                class="cyber-button-start flex-1"
                :disabled="playPressed"
                :class="{ 'grayscale opacity-50 cursor-not-allowed': playPressed }"
            >
              {{ playPressed ? 'REVEALING...' : 'PLAY' }}
            </button>

            <button
                @click="resetGame"
                class="cyber-button-reset w-16 flex items-center justify-center"
                title="Reset Settings"
            >
              <span class="material-symbols-outlined">restart_alt</span>
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
                <div class="bg-primary/20 p-2 rounded-lg text-primary">
                  <span class="material-symbols-outlined">linear_scale</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Define Range</h4>
                  <p class="text-sm">Set the Min and Max values. A smaller range (e.g., 1-10) gives a huge multiplier but is harder to hit!</p>
                </div>
              </div>

              <div class="flex gap-4 items-start">
                <div class="bg-blue-400/20 p-2 rounded-lg text-blue-400">
                  <span class="material-symbols-outlined">touch_app</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Pick Your Number</h4>
                  <p class="text-sm">Choose one specific number within your defined range using the main slider.</p>
                </div>
              </div>

              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400">
                  <span class="material-symbols-outlined">emoji_events</span>
                </div>
                <div>
                  <h4 class="font-bold text-white mb-1">3. Win Big</h4>
                  <p class="text-sm">Click PLAY. If the RNG lands on your exact number, you win the Bet × Multiplier!</p>
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

// State
const betAmount = ref(10)
const min = ref(1)
const max = ref(100)
const chosenNumber = ref(50) // Domyślnie środek
const gameStarted = ref(false)
const result = ref('')
const playPressed = ref(false)
const isWin = ref(false)

// Computed
const rangeSize = computed(() => max.value - min.value + 1)

// Mnożnik: Im mniejszy zakres, tym trudniej trafić (jeśli zgadujemy 1 liczbę).
const multiplier = computed(() => rangeSize.value)

const winChance = computed(() => {
  return ((1 / rangeSize.value) * 100).toFixed(2)
})

// Logic
function startGame() {
  if (min.value >= max.value) return
  // Resetujemy wybór do środka nowego zakresu
  chosenNumber.value = Math.floor((min.value + max.value) / 2)
  result.value = ''
  isWin.value = false
  playPressed.value = false
  gameStarted.value = true
}

function playGame() {
  if (playPressed.value) return
  playPressed.value = true

  // Symulacja opóźnienia dla napięcia (500ms)
  setTimeout(() => {
    const winNumber = Math.floor(Math.random() * (max.value - min.value + 1)) + min.value

    if (chosenNumber.value === winNumber) {
      isWin.value = true
      const payout = betAmount.value * multiplier.value
      emit('balanceChange', payout)
      result.value = `Winning Number: ${winNumber}. You won $${payout.toFixed(2)}!`
    } else {
      isWin.value = false
      emit('balanceChange', -betAmount.value)
      result.value = `Winning Number: ${winNumber}. Better luck next time.`
    }
  }, 600)
}

function resetGame() {
  gameStarted.value = false
  result.value = ''
  isWin.value = false
  min.value = 1
  max.value = 100
  betAmount.value = 10
  playPressed.value = false
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

/* Thumb (Uchwyt) - Webkit */
.cyber-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #00f6ff;
  border-radius: 2px; /* Kwadratowy, techniczny wygląd */
  cursor: pointer;
  box-shadow: 0 0 10px #00f6ff;
  border: 2px solid white;
  transform: translateY(-7px); /* Centrowanie względem linii */
  transition: transform 0.1s, box-shadow 0.2s;
}

.cyber-range::-webkit-slider-thumb:hover {
  transform: translateY(-7px) scale(1.2);
  box-shadow: 0 0 20px #00f6ff;
}

/* Wersja dla dużego suwaka w grze */
.cyber-range.large-thumb {
  height: 10px;
  background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
}
.cyber-range.large-thumb::-webkit-slider-thumb {
  width: 30px;
  height: 30px;
  background: #b84ff6;
  box-shadow: 0 0 15px #b84ff6;
  border-radius: 50%; /* Okrągły dla głównego */
  transform: translateY(-11px);
}
.cyber-range.large-thumb::-webkit-slider-thumb:hover {
  transform: translateY(-11px) scale(1.1);
  box-shadow: 0 0 25px #b84ff6;
}

/* --- RESZTA STYLÓW --- */
.neon-text-glow {
  text-shadow: 0 0 15px rgba(184, 79, 246, 0.7);
}
.neon-border-blue {
  border: 1px solid rgba(0, 246, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset;
}

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

.cyber-button-start {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #00f6ff, #b84ff6);
  color: #0a0a0a;
  font-size: 1.1rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5);
  transition: all 0.3s;
}
.cyber-button-start:not(:disabled):hover {
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 0 40px rgba(184, 79, 246, 0.8);
}

.cyber-button-reset {
  background: transparent;
  border: 2px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  border-radius: 0.75rem;
  transition: all 0.3s;
}
.cyber-button-reset:hover {
  border-color: white;
  color: white;
  background: rgba(255,255,255,0.05);
}

.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 79, 246, 0.3); border-radius: 10px; }
</style>