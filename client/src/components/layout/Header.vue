<template>
  <header :class="styles['headerContainer']">
    <!--Header bar-->
    <div :class="styles.headerTop" style="background-color: gainsboro; display: grid; justify-content: end; grid-auto-flow: column; padding-top: .1rem;">
        <!--Logout-->
        <RouterLink :to="''" @click="logout" :class="styles['logout']">Logout</RouterLink>
    </div>
    <!--Header-->
    <div :class="styles.headerTop">
      <!--Header Icon-->
      <a href="https://ksu.edu" :class="styles.noBackground">
        <img :src="logo" alt="Logo" :class="styles.logo" style="height: 40px;" />
      </a>
      <div :class="styles.divider"></div>
      <!--Header Text-->
      <a href="https://cs.ksu.edu" :class="styles.noBackground">
        <h1 :class="styles.headerTitle">Computer Science Student Portal</h1>
      </a>
    </div>

    <!--Navbar-->
    <Menubar :model="items" style="margin: 0; padding: 0;">
  <template #item="{ item, props }">
    <router-link v-if="item.route" :to="item.route" style="padding: 0; background-color: transparent;">
      <a v-bind="props.action">
        <span :style="{ color: 'white', fontWeight: item.root ? 'bold' : 'normal' }">
          {{ item.label }}
        </span>
      </a>
    </router-link>
    <a v-else v-bind="props.action">
      <span :style="{ color: 'white', fontWeight: item.root ? 'bold' : 'normal' }">
        {{ item.label }}
      </span>
    </a>
  </template>
</Menubar>



  </header>
</template>

<script>
//CSS
import styles from '../styles/Header.module.css';

//Components
import { computed, defineComponent, ref} from 'vue';
import { useTokenStore } from '../../stores/TokenStore.js';
import rolesMixin from '@/components/mixins/RoleMixin';

//Primevue components
import ToggleSwitch from 'primevue/toggleswitch';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';

//Images and icons
import logo from '../assets/ksuLogo.png';

export default defineComponent({
  name: 'Header',
  components: {
    ToggleSwitch,
    Menubar,
    InputText,
  },
  mixins: [rolesMixin],
  methods: {
    logout(event) {
      const tokenStore = useTokenStore();
      tokenStore.logout();
    }
  },
  setup() {
    //Check for if the admin toggle is on
    const { IsAdmin, IsReviewer } = rolesMixin.setup();

  
    const items = computed(() => {
      return [
        { label: 'Portal', route: '/home', root: true },
        {
          label: 'Professional Program', root: true,
          items: [
            { label: 'Home', route: '/professional-program' },
            { label: 'Apply', route: '/professional-program/apply' },
            (IsReviewer.value || IsAdmin.value) ? { label: 'Review', route: '/professional-program/review' } : null
          ].filter(Boolean)
        },
        { label: 'Profile', route: '/profile', root: true },
        { label: 'Grades', route: '/grades', root: true },
        IsAdmin.value ? ({ label: 'Admin', root: true,
        items: [
            { label: 'Users', route: '/admin/users' },
            { label: 'Discord', route: '/admin/discord' },
          ]
         }) : null
      ].filter(Boolean);
    });

    return {
      logo,
      styles,
      items,
      IsAdmin,
    };
  },
});
</script>

<style>

.p-menubar {
  background-color: #482277 !important;
  width: 100% !important; 
  border-color: #482277 !important; 
  border-radius: 0 !important;
  padding-left: 9vw !important;
  position: relative !important;
}
.p-menubar-item-content:hover{
  background-color: transparent !important;
}
.p-menubar-item-link:hover{
  background-color: transparent !important;
  text-decoration: underline white 3px;
  text-underline-offset: 5px; 
}
.p-menubar-item-content{
  background-color: transparent !important;
}
.p-menubar-submenu{
  background-color: #482277 !important;
  border-color: #482277 !important;
  border-radius: 0 !important;
}
.p-menubar-root-list{
  background-color: #482277 !important;
  border-color: #482277 !important;
  border-radius: 0 !important;
  margin-left:0 !important;
  padding-left: 0 !important;
}
</style>
