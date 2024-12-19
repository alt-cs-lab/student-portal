<script>
import { inject } from 'vue';

export default {
  setup() {
    const userContext = inject('UserContext');
    const userData = userContext.userData;
    const isAuthorized = userData.wid && userData.isAdmin;
    return { isAuthorized };
  }
};
</script>

<template>
  <div>
    <h1 v-if="!isAuthorized">Access Denied</h1>
    <slot v-else />
  </div>
</template>

