<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">

    <div class="relative my-8 flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border-2 border-primary/50 bg-[#0a0a0a]/95 p-6 shadow-[0_0_60px_-15px_rgba(184,79,246,0.6)] md:p-10">

      <div class="mb-6 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🎡</span>
          <div class="flex flex-col">
            <h2 class="text-3xl font-black uppercase tracking-wider text-white neon-text-glow">
              Neon Roulette
            </h2>
            <span v-if="isTestMode" class="text-xs text-yellow-400 font-mono uppercase tracking-wider">
              🧪 TEST MODE
            </span>
          </div>
        </div>

        <button
            @click="$emit('close')"
            class="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-red-500/20"
        >
          <span class="material-symbols-outlined text-white/70 transition-colors group-hover:text-red-400">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-8 items-center pb-20">

        <div class="w-full flex flex-col lg:flex-row gap-8 items-center justify-center flex-shrink-0">

          <div class="relative flex-shrink-0">
            <div class="absolute inset-0 rounded-full bg-primary/20 blur-[60px] animate-pulse"></div>

            <div class="neon-roulette-casing relative z-10">
              <div class="neon-roulette-pin z-20" :class="{ 'jolt': pinJolt }"></div>

              <div ref="wheel" class="neon-roulette-wheel" :class="{ 'rotating': isSpinning }">
                <div class="neon-roulette-center">
                  <div v-for="(seg, i) in segments" :key="i" class="neon-roulette-segment" :style="segmentStyle(i, seg.color)">
                    <div class="neon-roulette-txt" :style="txtStyle(i)">{{ seg.label }}</div>
                  </div>
                  <div v-for="i in segments.length" :key="'div'+i" class="neon-roulette-divider" :style="dividerStyle(i-1)"></div>
                </div>
                <div class="neon-roulette-cap flex items-center justify-center">
                  <div class="w-8 h-8 rounded-full bg-primary animate-ping opacity-20 absolute"></div>
                  <div class="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6 w-full max-w-md">

            <div class="grid grid-cols-2 gap-4 items-end">
              <div class="setting-group">
                <label class="setting-label">
                  <span class="material-symbols-outlined text-sm">payments</span> Bet Amount:
                </label>
                <!-- Set fixed height to match the balance readout -->
                <div class="relative flex items-center h-[58px]">
                  <div class="absolute left-4 flex items-center justify-center pointer-events-none">
                    <span class="text-white/50 font-mono text-lg -translate-y-[1px]">$</span>
                  </div>

                  <input
                      v-model.number="betAmount"
                      type="number"
                      min="0.01"
                      :max="props.balance"
                      :disabled="isSpinning"
                      class="w-full h-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-16 text-white font-bold font-mono outline-none focus:border-[#00f6ff] focus:shadow-[0_0_15px_rgba(0,246,255,0.2)] transition-all placeholder-white/20 appearance-none"
                      placeholder="0.00"
                      @input="validateInput"
                  >

                  <div class="absolute right-2 inset-y-0 flex items-center">
                    <button
                        @click="betAmount = Math.floor(props.balance || 0)"
                        :disabled="isSpinning"
                        class="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-[#00f6ff] uppercase transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div class="digital-readout bg-black/40 px-4 rounded-xl border border-white/10 h-[58px] flex justify-between items-center">
                <span class="label leading-none font-bold text-xs text-white/40 tracking-wider">BALANCE</span>
                <span class="value text-green-400 leading-none font-mono text-xl -translate-y-[1px]">${{ displayBalance }}</span>
              </div>
            </div>

            <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-h-[80px] flex flex-col justify-center items-center">
              <span class="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Current Bet On</span>
              <div v-if="selectedNumber !== null" class="text-2xl font-black text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">filter_1</span> Number {{ selectedNumber }}
              </div>
              <div v-else-if="selectedColor" class="text-2xl font-black uppercase flex items-center gap-2" :class="selectedColor === 'red' ? 'text-red-500' : 'text-slate-400'">
                <span class="material-symbols-outlined">palette</span> {{ selectedColor }}
              </div>
              <div v-else-if="selectedGreen" class="text-2xl font-black text-green-500 flex items-center gap-2">
                <span class="material-symbols-outlined">eco</span> ZERO (Green)
              </div>
              <div v-else class="text-white/30 italic">Select a number or color below</div>
            </div>

            <div class="flex flex-col items-center gap-2">
              <button
                  @click="spin"
                  :disabled="isSpinning || !isValidBet"
                  class="cyber-button-start w-full transition-all"
                  :class="{ 'grayscale opacity-50 cursor-not-allowed': !isValidBet || isSpinning }"
              >
                <span v-if="isSpinning" class="material-symbols-outlined animate-spin">sync</span>
                <span v-else class="material-symbols-outlined">play_circle</span>
                {{ isSpinning ? 'SPINNING...' : 'SPIN WHEEL' }}
              </button>
              <div v-if="betAmount > (balance || 0)" class="text-red-500 font-bold uppercase tracking-wider text-xs animate-pulse">Insufficient Funds!</div>
            </div>

            <div v-if="lastResult" class="text-center animate-in fade-in slide-in-from-top-2">
              <div class="text-lg font-bold uppercase tracking-widest"
                   :class="lastResult.includes('WON') || lastResult.includes('VICTORY') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'text-red-500'">
                {{ lastResult }}
              </div>
            </div>

          </div>
        </div>

        <div class="w-full max-w-4xl bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden flex-shrink-0">
          <div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>

          <div class="relative z-10 flex flex-col gap-4">

            <div class="flex flex-wrap gap-4 justify-center mb-2">
              <button @click="selectColor('red')" class="table-btn bg-red-900/40 border-red-600/50 hover:bg-red-600 text-red-100 flex-grow md:flex-grow-0" :class="{ 'active': selectedColor === 'red' }">
                🔴 RED (x2)
              </button>
              <button @click="selectGreen()" class="table-btn bg-green-900/40 border-green-600/50 hover:bg-green-600 text-green-100 flex-grow md:flex-grow-0" :class="{ 'active': selectedGreen }">
                🟢 ZERO (x35)
              </button>
              <button @click="selectColor('black')" class="table-btn bg-slate-800/60 border-slate-500/50 hover:bg-slate-700 text-slate-100 flex-grow md:flex-grow-0" :class="{ 'active': selectedColor === 'black' }">
                ⚫ BLACK (x2)
              </button>
            </div>

            <div class="grid grid-cols-12 gap-2">
              <button
                  v-for="n in 36"
                  :key="n"
                  @click="selectNumber(n)"
                  class="number-btn"
                  :class="[
                    getNumberColor(n),
                    { 'active': selectedNumber === n }
                 ]"
              >
                {{ n }}
              </button>
            </div>

          </div>
        </div>

        <div class="w-full mt-4 border-t border-white/10 pt-6 flex-shrink-0">
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
                <div class="bg-primary/20 p-2 rounded-lg text-primary"><span class="material-symbols-outlined">casino</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">1. Pick Your Spot</h4>
                  <p class="text-sm">Bet on a specific Number (High Risk, x35 Payout) or a Color (Low Risk, x2 Payout).</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-blue-400/20 p-2 rounded-lg text-blue-400"><span class="material-symbols-outlined">rotate_right</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">2. Spin the Wheel</h4>
                  <p class="text-sm">Press SPIN. The neon wheel will determine the winning number.</p>
                </div>
              </div>
              <div class="flex gap-4 items-start">
                <div class="bg-green-400/20 p-2 rounded-lg text-green-400"><span class="material-symbols-outlined">emoji_events</span></div>
                <div>
                  <h4 class="font-bold text-white mb-1">3. Win</h4>
                  <p class="text-sm">If the ball lands on your selection, you win instantly!</p>
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

const props = defineProps({
  balance: Number,
  isTestMode: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'balanceChange'])

const auth = useAuthStore()
const API_URL = import.meta.env.VITE_API_URL || ''

// Funkcja confetti przy wygranej
function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#b84ff6', '#00f6ff', '#ff0055', '#00ff90', '#ffed4a']
  })

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#b84ff6', '#00f6ff', '#ff0055']
    })
  }, 200)

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#b84ff6', '#00f6ff', '#ff0055']
    })
  }, 400)
}

// --- STATE ---
const betAmount = ref(10)
const selectedNumber = ref(null)
const selectedColor = ref(null)
const selectedGreen = ref(false)
const isSpinning = ref(false)
const lastResult = ref('')
const wheel = ref(null)
const pinJolt = ref(false)

// --- COMPUTED ---
const displayBalance = computed(() => (props.balance ?? 0).toFixed(2))

const isValidBet = computed(() => {
  const isSelectionMade = selectedNumber.value !== null || selectedColor.value !== null || selectedGreen.value
  const hasEnoughMoney = betAmount.value <= (props.balance || 0)
  return isSelectionMade && hasEnoughMoney
})

// --- WALIDACJA INPUTA ---
function validateInput(e) {
  const target = e.target;
  const value = parseFloat(target.value);
  if (value < 0) {
    betAmount.value = 0;
  }
}

// --- CONFIG ---
const segmentCount = 37
const segmentAngle = 360 / segmentCount
const wheelRadius = 200

// Generowanie segmentów
const segments = Array.from({ length: segmentCount }, (_, i) => {
  let color, label
  if (i === 0) {
    color = '#00ff90'
    label = '0'
  } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i)) {
    color = '#ff0055'
    label = i.toString()
  } else {
    color = '#111111'
    label = i.toString()
  }
  return { label, color }
})

// --- STYLES HELPER ---
function segmentStyle(i, color) {
  const halfWidth = Math.ceil((wheelRadius * Math.PI) / segmentCount) / 2 + 1
  return {
    left: `calc(50% - ${halfWidth}px)`,
    top: '0',
    width: '0',
    borderStyle: 'solid',
    borderWidth: `0 ${halfWidth}px ${wheelRadius}px ${halfWidth}px`,
    borderColor: `transparent transparent ${color} transparent`,
    transformOrigin: '50% 100%',
    transform: `rotate(${i * segmentAngle}deg)`,
    position: 'absolute',
    height: `${wheelRadius}px`
  }
}

function txtStyle(i) {
  return {
    position: 'absolute',
    left: '50%',
    top: '15px',
    transform: `translate(-50%, 0)`,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center',
    textShadow: '0 0 4px black, 0 0 8px rgba(0,0,0,0.8)',
    zIndex: 10
  }
}

function dividerStyle(i) {
  return {
    position: 'absolute',
    left: '50%',
    top: '0',
    width: '1px',
    height: `${wheelRadius}px`,
    background: 'rgba(255,255,255,0.2)',
    transformOrigin: '50% 100%',
    transform: `rotate(${i * segmentAngle + (segmentAngle/2)}deg)`
  }
}

function getNumberColor(n) {
  if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)) {
    return 'bg-red-600/20 border-red-600/50 text-red-100 hover:bg-red-600'
  }
  return 'bg-slate-700/40 border-slate-500/30 text-slate-200 hover:bg-slate-700'
}

// --- ACTIONS ---
function selectNumber(n) {
  selectedNumber.value = n; selectedColor.value = null; selectedGreen.value = false; lastResult.value = '';
}
function selectColor(color) {
  selectedColor.value = color; selectedNumber.value = null; selectedGreen.value = false; lastResult.value = '';
}
function selectGreen() {
  selectedGreen.value = true; selectedNumber.value = null; selectedColor.value = null; lastResult.value = '';
}

// --- GŁÓWNA FUNKCJA SPIN ---
async function spin() {
  if (isSpinning.value) return

  // WALIDACJA INPUTA
  if (betAmount.value <= 0 || isNaN(betAmount.value)) {
    alert("Please enter a valid bet amount!");
    return;
  }

  if (betAmount.value > (props.balance || 0)) {
    alert("Insufficient funds!");
    return;
  }

  if (!isValidBet.value) {
    alert("Please select a bet (Color or Number)!");
    return;
  }

  isSpinning.value = true
  pinJolt.value = true
  lastResult.value = ''

  try {
    let winningNumber, gain

    if (props.isTestMode) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      winningNumber = Math.floor(Math.random() * 37)
      let isWin = false

      if (selectedNumber.value !== null) {
        isWin = winningNumber === selectedNumber.value
        gain = isWin ? betAmount.value * 35 : 0
      } else if (selectedGreen.value) {
        isWin = winningNumber === 0
        gain = isWin ? betAmount.value * 35 : 0
      } else if (selectedColor.value) {
        if (winningNumber === 0) {
          isWin = false
          gain = 0
        } else {
          const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(winningNumber)
          const isBlack = !isRed && winningNumber !== 0

          if (selectedColor.value === 'red' && isRed) isWin = true
          if (selectedColor.value === 'black' && isBlack) isWin = true
          gain = isWin ? betAmount.value * 2 : 0
        }
      }
    } else {
      let colorToSend = -1;
      if (selectedColor.value === 'red') colorToSend = 1;
      if (selectedColor.value === 'black') colorToSend = 0;

      let numberToSend = -1;
      if (selectedNumber.value !== null) numberToSend = selectedNumber.value;
      if (selectedGreen.value) numberToSend = 0;

      const res = await fetch(`${API_URL}/api/games/play-roulette`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          betAmount: betAmount.value,
          color: colorToSend,
          number: numberToSend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Server error');

      winningNumber = data.randomNumber;
      gain = data.gain;
    }

    const winningIndex = segments.findIndex(s => parseInt(s.label) === winningNumber);
    const spins = 5;
    const baseRotation = spins * 360;
    const targetRotation = baseRotation + (360 - (winningIndex * segmentAngle));
    const duration = 4000;
    const wheelEl = wheel.value;

    if (wheelEl) {
      wheelEl.style.transition = 'none';
      wheelEl.style.transform = `rotate(0deg)`;
      void wheelEl.offsetWidth;
      wheelEl.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
      wheelEl.style.transform = `rotate(${targetRotation}deg)`;

      setTimeout(async () => {
        isSpinning.value = false;
        pinJolt.value = false;

        if (!props.isTestMode && auth.fetchBalance) {
          await auth.fetchBalance();
        } else if (props.isTestMode) {
          const balanceChange = gain > 0 ? gain - betAmount.value : -betAmount.value;
          emit('balanceChange', balanceChange);
        }

        if (gain > 0) {
          lastResult.value = `VICTORY! Result: ${winningNumber}. YOU WON $${gain}!`;
          setTimeout(() => { fireConfetti(); }, 300);
        } else {
          lastResult.value = `DEFEAT. Result: ${winningNumber}. You lost $${betAmount.value}.`;
        }
      }, duration + 100);
    }

  } catch (error) {
    console.error(error);
    isSpinning.value = false;
    lastResult.value = props.isTestMode ? 'Test mode error' : 'Network Error. Try again.';
    if (!props.isTestMode && auth.fetchBalance) {
      await auth.fetchBalance();
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(184, 79, 246, 0.3);
  border-radius: 10px;
}
.neon-text-glow {
  text-shadow: 0 0 15px rgba(184, 79, 246, 0.7);
}
.neon-border-blue {
  border: 1px solid rgba(0, 246, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.2) inset;
}
.neon-roulette-casing {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 4px solid #1a1a1a;
  box-shadow: 0 0 0 4px #b84ff6, 0 0 40px rgba(184, 79, 246, 0.5);
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.neon-roulette-wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
}
.neon-roulette-center {
  width: 100%;
  height: 100%;
  position: absolute;
}
.neon-roulette-pin {
  position: absolute;
  top: 10px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 20px solid #fff;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 5px #fff);
  z-index: 50;
}
.neon-roulette-pin.jolt {
  animation: pinShake 0.1s infinite;
}
@keyframes pinShake {
  0% { transform: translateX(-50%) rotate(0deg); }
  25% { transform: translateX(-50%) rotate(10deg); }
  75% { transform: translateX(-50%) rotate(-10deg); }
  100% { transform: translateX(-50%) rotate(0deg); }
}
.neon-roulette-cap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  background: #111;
  border: 3px solid #b84ff6;
  border-radius: 50%;
  box-shadow: 0 0 25px #b84ff6;
  z-index: 40;
}
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.select-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
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
  outline: none;
  appearance: none;
  cursor: pointer;
}
.digital-readout .label {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  text-align: center;
}
.digital-readout .value {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 0 0 10px currentColor;
}
.cyber-button-start {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-weight: 800;
  text-transform: uppercase;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #00f6ff, #b84ff6);
  color: #0a0a0a;
  font-size: 1.2rem;
  box-shadow: 0 0 25px rgba(184, 79, 246, 0.5);
  transition: all 0.3s;
}
.cyber-button-start:not(:disabled):hover {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(184, 79, 246, 0.8);
}
.table-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 800;
  border: 1px solid;
  transition: all 0.2s;
  text-transform: uppercase;
  font-size: 0.8rem;
}
.table-btn.active {
  box-shadow: 0 0 15px currentColor;
  transform: scale(1.05);
  border-color: white;
}
.number-btn {
  height: 40px;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid;
  transition: all 0.1s;
}
.number-btn:hover {
  transform: translateY(-2px);
}
.number-btn.active {
  background: #fff !important;
  color: #000 !important;
  box-shadow: 0 0 15px #fff;
  border-color: #fff;
}
</style>