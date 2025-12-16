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
            <p class="text-gray-400 text-sm tracking-widest uppercase">User Management System v2.0</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500">search</span>
            <input
                v-model="filters.search"
                @input="debounceSearch"
                type="text"
                placeholder="Email, name, username..."
                class="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#00f6ff] focus:shadow-[0_0_15px_rgba(0,246,255,0.3)] outline-none transition-all placeholder-gray-600"
            >
          </div>

          <div class="relative">
            <select
                v-model="filters.role"
                @change="fetchUsers(1)"
                class="appearance-none bg-black/40 border border-white/10 rounded-lg py-3 pl-4 pr-10 text-white focus:border-[#b84ff6] outline-none cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL">User</option>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 pointer-events-none">expand_more</span>
          </div>

          <button @click="fetchUsers(pagination.page)" class="p-3 rounded-lg bg-white/5 hover:bg-[#00f6ff]/20 text-[#00f6ff] transition-colors border border-transparent hover:border-[#00f6ff]/50">
            <span class="material-symbols-outlined" :class="{'animate-spin': loading}">refresh</span>
          </button>
        </div>
      </div>

      <div class="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[400px]">

        <div v-if="loading && !users.length" class="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <span class="material-symbols-outlined text-6xl text-[#b84ff6] animate-spin">sync</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-400">
              <th class="p-5 font-bold">User Info</th>
              <th class="p-5 font-bold text-center">Role</th>
              <th class="p-5 font-bold text-center">Joined</th>
              <th class="p-5 font-bold text-center">Sapper Maps</th>
              <th class="p-5 font-bold text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
            <tr v-for="user in users" :key="user.id" class="group hover:bg-white/[0.02] transition-colors">

              <td class="p-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#b84ff6] to-[#00f6ff] flex items-center justify-center font-bold text-black text-lg shadow-[0_0_10px_rgba(184,79,246,0.4)]">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-bold text-white group-hover:text-[#00f6ff] transition-colors">{{ user.username }}</div>
                    <div class="text-xs text-gray-500 font-mono">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <td class="p-5 text-center">
                  <span
                      class="px-3 py-1 rounded-full text-xs font-bold border shadow-[0_0_10px_inset]"
                      :class="user.role === 'ADMIN'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/20'"
                  >
                    {{ user.role }}
                  </span>
              </td>

              <td class="p-5 text-center text-sm text-gray-400 font-mono">
                {{ formatDate(user.createdAt) }}
              </td>

              <td class="p-5 text-center">
                <div class="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg text-sm border border-white/5">
                  <span class="material-symbols-outlined text-yellow-500 text-sm">bomb</span>
                  <span class="font-bold">{{ user._count?.sapperMaps || 0 }}</span>
                </div>
              </td>

              <td class="p-5 text-right">
                <button
                    @click="openEditModal(user.id)"
                    class="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Edit User Details"
                >
                  <span class="material-symbols-outlined">edit_square</span>
                </button>
              </td>
            </tr>

            <tr v-if="!loading && users.length === 0">
              <td colspan="5" class="p-10 text-center text-gray-500">
                <span class="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                No users found. Try changing filters.
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="p-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm bg-black/20">
          <div class="text-gray-400">
            Page <span class="text-white font-bold">{{ pagination.page }}</span>
            of <span class="text-white font-bold">{{ pagination.totalPages }}</span>
            (Total: {{ pagination.total }})
          </div>

          <div class="flex gap-2">
            <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="px-4 py-2 rounded bg-white/5 border border-white/10 hover:border-[#b84ff6] hover:text-[#b84ff6] disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:text-gray-500 transition-all"
            >
              Prev
            </button>
            <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="px-4 py-2 rounded bg-white/5 border border-white/10 hover:border-[#b84ff6] hover:text-[#b84ff6] disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:text-gray-500 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-[#0a0a0a] border border-[#b84ff6] shadow-[0_0_50px_rgba(184,79,246,0.2)] rounded-2xl w-full max-w-lg overflow-hidden relative">

        <div class="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#b84ff6]/10 to-transparent">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#b84ff6]">manage_accounts</span>
            Edit User
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div v-if="selectedUser" class="p-6 space-y-6">

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 p-3 rounded-lg border border-white/5">
              <label class="text-xs text-gray-500 uppercase block mb-1">Username</label>
              <div class="font-mono text-white text-sm truncate">{{ selectedUser.username }}</div>
            </div>
            <div class="bg-white/5 p-3 rounded-lg border border-white/5">
              <label class="text-xs text-gray-500 uppercase block mb-1">Wallet Balance</label>
              <div class="font-mono text-[#00f6ff] font-bold">
                ${{ selectedUser.wallet?.balance?.toFixed(2) || '0.00' }}
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm text-gray-400">First Name</label>
                <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none transition-colors"
                >
              </div>
              <div class="space-y-1">
                <label class="text-sm text-gray-400">Surname</label>
                <input
                    v-model="editForm.surname"
                    type="text"
                    class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none transition-colors"
                >
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm text-gray-400">Role Permissions</label>
              <select
                  v-model="editForm.role"
                  class="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[#b84ff6] outline-none cursor-pointer"
              >
                <option value="NORMAL">User (Standard)</option>
                <option value="ADMIN">Administrator (Full Access)</option>
              </select>
              <p v-if="editForm.role === 'ADMIN'" class="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">warning</span>
                Warning: You are granting full admin privileges.
              </p>
            </div>
          </div>

          <div v-if="errorMsg" class="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded text-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ errorMsg }}
          </div>

        </div>

        <div v-else class="p-10 flex justify-center">
          <span class="material-symbols-outlined text-4xl text-[#b84ff6] animate-spin">sync</span>
        </div>

        <div class="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/40">
          <button
              @click="closeModal"
              class="px-4 py-2 rounded text-sm hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
              @click="saveUser"
              :disabled="saving"
              class="px-6 py-2 rounded bg-gradient-to-r from-[#b84ff6] to-[#a83ce6] text-white font-bold shadow-[0_0_15px_rgba(184,79,246,0.4)] hover:shadow-[0_0_25px_rgba(184,79,246,0.6)] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            <span v-if="saving" class="material-symbols-outlined text-sm animate-spin">sync</span>
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';

// --- TYPY DANYCH ---
interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'NORMAL';
  createdAt: string;
  _count?: {
    sapperMaps: number;
  };
  wallet?: {
    balance: number;
  };
  name?: string;
  surname?: string;
}

// --- STATE ---
const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const errorMsg = ref('');

// Filtry
const filters = reactive({
  search: '',
  role: ''
});

// Paginacja
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
});

// Modal
const isModalOpen = ref(false);
const selectedUser = ref<User | null>(null);
const editForm = reactive({
  name: '',
  surname: '',
  role: 'NORMAL'
});

let timeout: any = null;

// --- API FETCHING ---

// 1. Pobieranie Listy Użytkowników
const fetchUsers = async (page = 1) => {
  loading.value = true;
  errorMsg.value = '';

  try {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.limit.toString(),
    });
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);

    // UWAGA: Zgodnie z Twoim adminRoutes.ts endpoint to /list-users
    // Zakładam prefiks /api/admin w app.ts
    const response = await fetch(`http://localhost:8000/api/admin/list-users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch users');

    const result = await response.json();
    users.value = result.data;

    pagination.page = result.pagination.page;
    pagination.total = result.pagination.total;
    pagination.totalPages = result.pagination.totalPages;

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 2. Pobieranie Szczegółów (Modal)
const openEditModal = async (userId: string) => {
  isModalOpen.value = true;
  selectedUser.value = null;
  errorMsg.value = '';

  try {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

    // Endpoint zgodny z adminRoutes.ts: /user-details/:id
    const response = await fetch(`http://localhost:8000/api/admin/user-details/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch details');
    const result = await response.json();

    selectedUser.value = result.data;

    // Wypełnij formularz
    editForm.name = result.data.name || '';
    editForm.surname = result.data.surname || '';
    editForm.role = result.data.role;

  } catch (error) {
    console.error(error);
    errorMsg.value = "Failed to load user details";
  }
};

// 3. Zapisywanie Zmian (PATCH)
const saveUser = async () => {
  if (!selectedUser.value) return;
  saving.value = true;
  errorMsg.value = '';

  try {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

    const body = {
      role: editForm.role,
      name: editForm.name || undefined,
      surname: editForm.surname || undefined
    };

    // Endpoint zgodny z adminRoutes.ts: /patch-user/:id
    const response = await fetch(`http://localhost:8000/api/admin/patch-user/${selectedUser.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Update failed');
    }

    closeModal();
    fetchUsers(pagination.page); // Odśwież listę po zapisie

  } catch (error: any) {
    errorMsg.value = error.message;
  } finally {
    saving.value = false;
  }
};

// --- POMOCNICZE ---

const closeModal = () => {
  isModalOpen.value = false;
  selectedUser.value = null;
};

const changePage = (p: number) => {
  if (p > 0 && p <= pagination.totalPages) {
    fetchUsers(p);
  }
};

const debounceSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetchUsers(1);
  }, 500);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.neon-text-purple {
  text-shadow: 0 0 10px rgba(184, 79, 246, 0.7), 0 0 20px rgba(184, 79, 246, 0.5);
}

/* Custom Scrollbar dla tabeli */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0a0a;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #b84ff6;
}
</style>