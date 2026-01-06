<template>
  <div class="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4 md:px-8">
    <div class="max-w-3xl mx-auto">

      <div class="mb-8">
        <router-link
            to="/home"
            class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-400 transition-all hover:border-[#b84ff6]/50 hover:bg-white/10 hover:text-white group"
        >
          <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </router-link>
      </div>

      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
          Frequently Asked <span class="text-[#b84ff6]">Questions</span>
        </h1>
        <p class="text-gray-400">Everything you need to know about Blac Royale.</p>
      </div>

      <div class="space-y-4">
        <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all hover:border-[#b84ff6]/30"
        >
          <button
              @click="toggle(index)"
              class="flex w-full items-center justify-between p-6 text-left focus:outline-none"
          >
            <span class="text-lg font-bold text-white">{{ item.question }}</span>
            <span
                class="material-symbols-outlined text-[#b84ff6] transition-transform duration-300"
                :class="{ 'rotate-180': item.isOpen }"
            >
              expand_more
            </span>
          </button>

          <div
              v-show="item.isOpen"
              class="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const faqItems = ref([
  {
    question: "How do I create an account?",
    answer: "Click the 'Register' button in the top right corner. Fill in your email, username, and password. You must be over 18 years old to play.",
    isOpen: true
  },
  {
    question: "What deposit methods do you accept?",
    answer: "We accept credit cards, crypto (BTC, ETH, USDT), and various e-wallets. Visit your wallet section to see all available options for your region.",
    isOpen: false
  },
  {
    question: "Is Blac Royale fair?",
    answer: "Yes! All our games use a Provably Fair system, which allows you to verify the fairness of every single game round independently.",
    isOpen: false
  },
  {
    question: "How long do withdrawals take?",
    answer: "Crypto withdrawals are usually instant or take up to 30 minutes. Bank transfers may take 1-3 business days depending on your bank.",
    isOpen: false
  }
]);

const toggle = (index: number) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
};
</script>