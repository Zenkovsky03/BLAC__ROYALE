<template>
  <div class="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4 md:px-8">

    <div class="relative max-w-6xl mx-auto mb-20 text-center">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#b84ff6]/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 rounded-full border border-[#b84ff6]/30 bg-[#b84ff6]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#b84ff6] mb-6">
          <span class="material-symbols-outlined text-sm">handshake</span>
          Official Partner Program
        </div>

        <h1 class="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6">
          Earn With <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#b84ff6] to-[#00f6ff]">Blac Royale</span>
        </h1>

        <p class="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
          Join the fastest growing crypto casino affiliate program. Earn up to <span class="text-white font-bold">50% Lifetime Commission</span> for every user you refer.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
              @click="joinProgram"
              class="min-w-[200px] rounded-xl bg-gradient-to-r from-[#b84ff6] to-[#7c3aed] py-4 px-8 font-bold text-white shadow-[0_0_30px_rgba(184,79,246,0.4)] transition-transform hover:scale-105"
          >
            Become a Partner
          </button>
          <button class="min-w-[200px] rounded-xl border border-white/10 bg-white/5 py-4 px-8 font-bold text-white transition-colors hover:bg-white/10">
            Login to Dashboard
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
      <div v-for="(stat, index) in stats" :key="index" class="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 text-center hover:border-[#b84ff6]/30 transition-colors">
        <div class="text-3xl md:text-4xl font-black text-white mb-2">{{ stat.value }}</div>
        <div class="text-xs font-bold uppercase tracking-widest text-gray-500">{{ stat.label }}</div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto mb-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black uppercase text-white">How it <span class="text-[#b84ff6]">Works</span></h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="relative p-8 rounded-2xl border border-white/10 bg-white/5 group hover:bg-white/[0.07] transition-all">
          <div class="absolute -top-6 left-8 h-12 w-12 flex items-center justify-center rounded-xl bg-[#0a0a0a] border border-[#b84ff6] text-[#b84ff6] text-xl font-bold shadow-[0_0_15px_rgba(184,79,246,0.3)]">1</div>
          <h3 class="mt-4 text-xl font-bold text-white mb-3">Register & Get Link</h3>
          <p class="text-gray-400 text-sm">Create your affiliate account in seconds. You'll get a unique referral link and marketing assets immediately.</p>
        </div>

        <div class="relative p-8 rounded-2xl border border-white/10 bg-white/5 group hover:bg-white/[0.07] transition-all">
          <div class="absolute -top-6 left-8 h-12 w-12 flex items-center justify-center rounded-xl bg-[#0a0a0a] border border-[#b84ff6] text-[#b84ff6] text-xl font-bold shadow-[0_0_15px_rgba(184,79,246,0.3)]">2</div>
          <h3 class="mt-4 text-xl font-bold text-white mb-3">Invite Players</h3>
          <p class="text-gray-400 text-sm">Share your link on social media, streams, or with friends. We provide banners and landing pages.</p>
        </div>

        <div class="relative p-8 rounded-2xl border border-white/10 bg-white/5 group hover:bg-white/[0.07] transition-all">
          <div class="absolute -top-6 left-8 h-12 w-12 flex items-center justify-center rounded-xl bg-[#0a0a0a] border border-[#b84ff6] text-[#b84ff6] text-xl font-bold shadow-[0_0_15px_rgba(184,79,246,0.3)]">3</div>
          <h3 class="mt-4 text-xl font-bold text-white mb-3">Earn Crypto</h3>
          <p class="text-gray-400 text-sm">Get paid instantly for every bet your referrals make. Withdraw your earnings in BTC, ETH or USDT.</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
      <div>
        <h2 class="text-3xl md:text-4xl font-black uppercase text-white mb-6 leading-tight">
          Why Partner with <br/><span class="text-[#00f6ff]">Blac Royale?</span>
        </h2>
        <div class="space-y-6">
          <div v-for="(benefit, i) in benefits" :key="i" class="flex gap-4">
            <div class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00f6ff]/10 text-[#00f6ff]">
              <span class="material-symbols-outlined">{{ benefit.icon }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">{{ benefit.title }}</h4>
              <p class="text-gray-400 text-sm mt-1">{{ benefit.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-black p-8 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-[#00f6ff]/10 blur-[80px] rounded-full pointer-events-none"></div>

        <h3 class="relative z-10 text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Commission Structure</h3>

        <div class="relative z-10 space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-gray-400 font-bold uppercase text-xs">Tier 1 (0-10 Users)</span>
            <span class="text-[#00f6ff] font-bold">25% RevShare</span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <span class="text-gray-400 font-bold uppercase text-xs">Tier 2 (11-50 Users)</span>
            <span class="text-[#00f6ff] font-bold">35% RevShare</span>
          </div>
          <div class="flex items-center justify-between p-4 rounded-xl bg-[#00f6ff]/10 border border-[#00f6ff]/30 shadow-[0_0_15px_rgba(0,246,255,0.1)]">
            <span class="text-white font-bold uppercase text-xs">Tier 3 (50+ Users)</span>
            <span class="text-[#00f6ff] font-bold">50% RevShare</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-r from-[#b84ff6]/20 to-[#00f6ff]/20 border border-white/10 p-12 relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-3xl font-black uppercase text-white mb-4">Ready to start earning?</h2>
        <p class="text-gray-300 mb-8">Join thousands of affiliates who trust Blac Royale.</p>
        <button @click="joinProgram" class="rounded-xl bg-white text-black py-3 px-8 font-black uppercase hover:bg-gray-200 transition-colors">
          Create Affiliate Account
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  { label: 'Active Partners', value: '2,400+' },
  { label: 'Total Paid Out', value: '$12M+' },
  { label: 'Avg. Conversion', value: '35%' },
  { label: 'Supported Countries', value: '140+' },
]);

const benefits = ref([
  {
    icon: 'payments',
    title: 'Instant Payouts',
    desc: 'Withdraw your commission anytime. No waiting for the end of the month.'
  },
  {
    icon: 'monitoring',
    title: 'Real-time Analytics',
    desc: 'Track every click, registration, and bet in our advanced dashboard.'
  },
  {
    icon: 'verified_user',
    title: 'No Negative Carryover',
    desc: 'Start every month fresh. Negative balances are not carried over.'
  },
]);

const joinProgram = () => {
  // Tutaj możesz dodać logikę, np. przekierowanie do rejestracji ze specjalnym parametrem
  // lub otwarcie modala kontaktowego dla partnerów
  alert("Redirecting to Affiliate Registration...");
};
</script>