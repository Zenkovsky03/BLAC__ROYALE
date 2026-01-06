<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div
        class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        @click="$emit('close')"
    ></div>

    <div class="relative w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border border-primary/50 bg-[#0a0a0a] p-6 shadow-[0_0_50px_rgba(184,79,246,0.25)] transition-all">

      <div class="mb-8 text-center">
        <h2 class="text-2xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Manage Wallet
        </h2>
        <p class="mt-2 text-sm text-secondary/80">Select an action to proceed</p>
      </div>

      <div class="grid gap-4">

        <button
            @click="$emit('select-deposit')"
            class="group relative flex items-center gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4 transition-all duration-300 hover:border-green-500 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-400 transition-colors group-hover:bg-green-500 group-hover:text-black">
            <span class="material-symbols-outlined text-2xl">arrow_upward</span>
          </div>
          <div class="text-left">
            <h3 class="text-lg font-bold text-white group-hover:text-green-400 transition-colors">Deposit Funds</h3>
            <p class="text-xs text-white/50">Add money to your account instantly.</p>
          </div>
        </button>

        <button
            @click="$emit('select-withdraw')"
            class="group relative flex items-center gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 transition-all duration-300 hover:border-red-500 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition-colors group-hover:bg-red-500 group-hover:text-black">
            <span class="material-symbols-outlined text-2xl">arrow_downward</span>
          </div>
          <div class="text-left">
            <h3 class="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Withdraw Funds</h3>
            <p class="text-xs text-white/50">Cash out your winnings securely.</p>
          </div>
        </button>

      </div>

      <button
          @click="$emit('close')"
          class="mt-8 w-full rounded-lg py-3 text-sm font-bold uppercase tracking-wider text-white/40 transition-colors hover:bg-white/5 hover:text-white"
      >
        Cancel
      </button>

    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'select-deposit', 'select-withdraw'])
</script>