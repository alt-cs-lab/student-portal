// mixins/adminMixin.js
import { computed } from 'vue';
import { useTokenStore } from '@/stores/TokenStore';

export default {
  setup() {
    // Stores
    const tokenStore = useTokenStore();

    // Store states
    const IsAdmin = computed(() => tokenStore.get_admin);
    const IsReviewer = computed(() => tokenStore.get_reviewer);

    return {
      IsAdmin,
      IsReviewer,
    };
  },
};
