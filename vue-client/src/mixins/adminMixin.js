// mixins/adminMixin.js
import { computed } from 'vue';
import { useTokenStore } from '@/stores/TokenStore';
import { useAdminStore } from '@/stores/AdminStore';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    // Stores
    const adminStore = useAdminStore();
    const tokenStore = useTokenStore();

    // Store states
    const { IsAdminMode } = storeToRefs(adminStore);
    const IsAdmin = computed(() => tokenStore.get_admin);

    return {
      IsAdminMode,
      IsAdmin
    };
  },
};
