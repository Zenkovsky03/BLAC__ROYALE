<template>
  <div class="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4 md:px-8">

    <div class="max-w-5xl mx-auto">

      <div class="mb-8">
        <router-link
            to="/home"
            class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-400 transition-all hover:border-[#b84ff6]/50 hover:bg-white/10 hover:text-white group"
        >
          <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Get in <span class="text-[#b84ff6]">Touch</span>
          </h1>
          <p class="text-gray-400 mb-10 leading-relaxed">
            Have a question or need assistance? Our support team is available 24/7. Fill out the form or use one of our direct contact methods.
          </p>

          <div class="space-y-6">
            <div class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#b84ff6]/20 text-[#b84ff6]">
                <span class="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 class="font-bold text-white">Email Support</h3>
                <p class="text-sm text-gray-400">support@blacroyale.com</p>
              </div>
            </div>

            <div class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#00f6ff]/20 text-[#00f6ff]">
                <span class="material-symbols-outlined">chat</span>
              </div>
              <div>
                <h3 class="font-bold text-white">Live Chat</h3>
                <p class="text-sm text-gray-400">Available 24/7 via Widget</p>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-[#0f0f0f] p-8 shadow-[0_0_50px_rgba(184,79,246,0.1)]">
          <form @submit.prevent="submitForm" class="space-y-6">

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-wider text-[#b84ff6]">Your Email</label>
              <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-white outline-none focus:border-[#b84ff6] transition-colors"
                  placeholder="user@example.com"
              >
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-wider text-[#b84ff6]">Subject</label>
              <select
                  v-model="form.subject"
                  class="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-white outline-none focus:border-[#b84ff6] transition-colors appearance-none"
              >
                <option>General Inquiry</option>
                <option>Deposit/Withdrawal Issue</option>
                <option>Game Error</option>
                <option>Partnership</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-wider text-[#b84ff6]">Message</label>
              <textarea
                  v-model="form.message"
                  required
                  rows="5"
                  class="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-white outline-none focus:border-[#b84ff6] transition-colors resize-none"
                  placeholder="Describe your issue..."
              ></textarea>
            </div>

            <button
                type="submit"
                :disabled="sending"
                class="w-full rounded-xl bg-gradient-to-r from-[#b84ff6] to-[#7c3aed] py-4 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>

            <p v-if="success" class="text-center text-green-400 text-sm font-bold mt-2">Message sent successfully!</p>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const sending = ref(false);
const success = ref(false);
const form = reactive({
  email: '',
  subject: 'General Inquiry',
  message: ''
});

const submitForm = async () => {
  sending.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  sending.value = false;
  success.value = true;
  form.message = '';
};
</script>