<template>
  <div class="min-h-screen bg-[#050505] p-6 md:p-10 text-white font-sans selection:bg-[#b84ff6] selection:text-white pb-20">

    <div class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#b84ff6]/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#00f6ff]/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">

      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(184,79,246,0.3)]">
            <span class="material-symbols-outlined text-4xl text-[#b84ff6]">admin_panel_settings</span>
          </div>
          <div>
            <h1 class="text-4xl font-black uppercase tracking-wider text-white neon-text-purple">
              Admin Control
            </h1>
            <p class="text-gray-400 text-sm tracking-widest uppercase">User Management System v3.5</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">search</span>
            <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                placeholder="Search users..."
                class="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#00f6ff] focus:shadow-[0_0_15px_rgba(0,246,255,0.3)] outline-none transition-all placeholder-gray-600"
            >
          </div>

          <button
              @click="goHome"
              class="p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors border border-transparent hover:border-blue-500/50"
              title="Go to Home"
          >
            <span class="material-symbols-outlined">home</span>
          </button>


        </div>
      </div>

      <div class="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">

        <div v-if="loading && !users.length" class="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <span class="material-symbols-outlined text-6xl text-[#b84ff6] animate-spin">sync</span>
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-400">
              <th class="p-5 font-bold">User</th>
              <th class="p-5 font-bold text-center">Role</th>
              <th class="p-5 font-bold text-center">Joined</th>
              <th class="p-5 font-bold text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
            <tr v-for="user in users" :key="user.id" class="group hover:bg-white/[0.02] transition-colors">
              <td class="p-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#b84ff6] to-[#00f6ff] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_10px_rgba(184,79,246,0.4)]">
                    {{ user.username?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div>
                    <div class="font-bold text-white group-hover:text-[#00f6ff] transition-colors">{{ user.username }}</div>
                    <div class="text-xs text-gray-500 font-mono">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="p-5 text-center">
                  <span class="px-3 py-1 rounded-full text-xs font-bold border"
                        :class="user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'">
                    {{ user.role }}
                  </span>
              </td>
              <td class="p-5 text-center text-sm text-gray-400 font-mono">{{ formatDate(user.createdAt) }}</td>
              <td class="p-5 text-right">
                <button @click="openManageModal(user.id)" class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#b84ff6] transition-colors">
                  Manage
                </button>
              </td>
            </tr>
            <tr v-if="!loading && users.length === 0">
              <td colspan="4" class="p-10 text-center text-gray-500">
                No users found matching query.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="border-t border-white/10 bg-white/5 p-4 flex items-center justify-between">
            <span class="text-xs text-gray-400 font-mono">
              Page {{ pagination.page }} of {{ pagination.totalPages }} (Total: {{ pagination.total }})
            </span>
          <div class="flex gap-2">
            <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="px-4 py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="px-4 py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-[#0a0a0a] border border-[#b84ff6] shadow-[0_0_50px_rgba(184,79,246,0.2)] rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#b84ff6]/10 to-transparent">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#b84ff6]">manage_accounts</span>
            Manage: {{ selectedUser?.username }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>

        <div class="flex border-b border-white/10 bg-black/40">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                  class="flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-2"
                  :class="activeTab === tab.id ? 'border-[#b84ff6] text-white bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'">
            <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span> {{ tab.label }}
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 relative">

          <div v-if="!selectedUser" class="flex justify-center p-10"><span class="material-symbols-outlined animate-spin text-4xl text-[#b84ff6]">sync</span></div>

          <div v-else>
            <div v-if="activeTab === 'profile'" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-sm text-gray-400">First Name</label>
                  <input v-model="editForm.name" type="text" class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none">
                </div>
                <div class="space-y-1">
                  <label class="text-sm text-gray-400">Surname</label>
                  <input v-model="editForm.surname" type="text" class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none">
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm text-gray-400">Role</label>
                <select v-model="editForm.role" class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none">
                  <option value="NORMAL">User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <button @click="saveUser" :disabled="saving" class="w-full py-3 mt-4 rounded bg-[#b84ff6] text-white font-bold hover:bg-[#a83ce6] disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Update Profile' }}
              </button>
            </div>

            <div v-if="activeTab === 'wallet'" class="space-y-6">
              <div class="text-center p-6 bg-gradient-to-br from-[#00f6ff]/10 to-transparent rounded-2xl border border-[#00f6ff]/30">
                <p class="text-gray-400 uppercase tracking-widest text-xs mb-2">Current Balance</p>
                <div class="text-5xl font-black text-[#00f6ff] font-mono">${{ selectedUser.wallet?.balance || '0.00' }}</div>
              </div>

              <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 class="text-white font-bold mb-4">Modify Balance (Backend Logic)</h4>
                <div class="flex gap-2">
                  <input v-model.number="walletAmount" type="number" placeholder="Amount" class="flex-1 bg-black/40 border border-white/20 rounded p-3 text-white text-xl font-mono outline-none focus:border-[#00f6ff]">
                  <button @click="mockWalletAction('ADD')" class="px-4 rounded bg-green-600 text-white font-bold hover:bg-green-500">Add</button>
                  <button @click="mockWalletAction('REMOVE')" class="px-4 rounded bg-red-600 text-white font-bold hover:bg-red-500">Remove</button>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'history'" class="space-y-4">
              <div v-if="selectedUser.wallet?.transactions?.length" class="overflow-hidden rounded-lg border border-white/10">
                <table class="w-full text-left text-sm">
                  <thead class="bg-white/5 text-gray-500">
                  <tr><th class="p-3">Type / Game</th><th class="p-3">Amount</th><th class="p-3">Date</th></tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                  <tr v-for="tx in selectedUser.wallet.transactions" :key="tx.id" class="hover:bg-white/5">

                    <td class="p-3">
                      <div class="font-bold" :class="tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-gray-300'">
                        {{ tx.type }}
                      </div>
                      <div v-if="tx.game" class="text-[10px] text-[#b84ff6] uppercase tracking-wider font-bold">
                        {{ tx.game }}
                      </div>
                    </td>

                    <td class="p-3 font-mono" :class="tx.type === 'WIN' || tx.type === 'DEPOSIT' ? 'text-[#00f6ff]' : 'text-red-400'">
                      {{ (tx.type === 'WIN' || tx.type === 'DEPOSIT') ? '+' : '-' }}{{ tx.amount }}$
                    </td>
                    <td class="p-3 text-gray-500">{{ formatDate(tx.timestamp || tx.createdAt) }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-center text-gray-500 italic py-10">No transaction history found.</p>
            </div>

            <div v-if="activeTab === 'danger'" class="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div class="p-4 bg-red-500/10 rounded-full border border-red-500/30">
                <span class="material-symbols-outlined text-4xl text-red-500">delete_forever</span>
              </div>
              <h3 class="text-2xl font-bold text-white">Delete Account</h3>
              <p class="text-gray-400 max-w-xs">Irreversible action. Deletes all user data immediately.</p>

              <button @click="deleteUser" class="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20">
                Delete User
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const emit = defineEmits(['close']);

const users = ref<any[]>([]);
const loading = ref(false);
const saving = ref(false);
const filters = reactive({ search: '', role: '' });

const pagination = reactive({ page: 1, limit: 4, total: 0, totalPages: 1 });

const isModalOpen = ref(false);
const selectedUser = ref<any>(null);
const activeTab = ref('profile');
const tabs = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'danger', label: 'Danger', icon: 'warning' }
];

const editForm = reactive({ name: '', surname: '', role: 'NORMAL' });
const walletAmount = ref<number | null>(null);
let timeout: any = null;

const goHome = () => {
  router.push('/');
  emit('close');
};

const fetchUsers = async (page = 1) => {
  loading.value = true;
  try {
    const token = auth.token;
    if (!token) return;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.limit.toString(), // 4
      search: filters.search,
      role: filters.role
    });

    const res = await fetch(`${API_URL}/api/admin/list-users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if(res.ok) {
      users.value = data.data;
      pagination.totalPages = data.pagination.totalPages;
      pagination.page = data.pagination.page;
      pagination.total = data.pagination.total || 0;
    } else {
      console.error("Fetch error:", data);
      if (res.status === 401) alert("Unauthorized");
    }
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const openManageModal = async (userId: string) => {
  isModalOpen.value = true;
  selectedUser.value = null;
  activeTab.value = 'profile';
  try {
    const token = auth.token;
    const res = await fetch(`${API_URL}/api/admin/user-details/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    if(res.ok) {
      selectedUser.value = data.data;
      editForm.name = data.data.name || '';
      editForm.surname = data.data.surname || '';
      editForm.role = data.data.role;
    }
  } catch (e) { console.error(e); }
};

const saveUser = async () => {
  saving.value = true;
  try {
    const token = auth.token;
    const res = await fetch(`${API_URL}/api/admin/patch-user/${selectedUser.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editForm)
    });
    if(res.ok) { alert('Saved!'); fetchUsers(pagination.page); }
  } catch (e) { console.error(e); } finally { saving.value = false; }
};

const deleteUser = async () => {
  if(!confirm("Irreversible action. Delete user?")) return;
  try {
    const token = auth.token;
    const res = await fetch(`${API_URL}/api/admin/delete-user/${selectedUser.value.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId: selectedUser.value.id })
    });

    if(res.ok) {
      closeModal();
      fetchUsers(1);
    }
  } catch (e) { console.error(e); }
};

const mockWalletAction = (type: string) => {
  if(!walletAmount.value) return;
  alert(`Request to ${type} ${walletAmount.value}$ sent (Simulated). Implement backend logic.`);
};

const closeModal = () => { isModalOpen.value = false; };

const changePage = (p: number) => {
  if(p > 0 && p <= pagination.totalPages) {
    fetchUsers(p);
  }
};

const debounceSearch = () => { clearTimeout(timeout); timeout = setTimeout(() => fetchUsers(1), 500); };
const formatDate = (d: string) => new Date(d).toLocaleDateString();

onMounted(() => fetchUsers(1));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
.neon-text-purple { text-shadow: 0 0 10px rgba(184, 79, 246, 0.7); }
</style>
