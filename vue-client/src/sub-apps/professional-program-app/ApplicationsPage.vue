<template>
    <!--Entry point for the Applications Page-->
    <div>
        <AdminForm v-if="IsAdminMode && IsAdmin"/>
        <ApplicationForm v-else />
    </div>
</template>

<script>
//CSS
import ApplicationForm from './ApplicationForm.vue';
import AdminForm from './AdminForm.vue';
import adminMixin from '@/mixins/adminMixin';

export default {
  name: 'ApplicationsPage',
  components: {
    ApplicationForm,
    AdminForm
  },
  mixins: [adminMixin],
  setup() {
    // Mixin to toggle admin view
    const { IsAdmin, IsAdminMode } = adminMixin.setup();

    return{
      IsAdminMode,
      IsAdmin
    }
  },
};
</script>