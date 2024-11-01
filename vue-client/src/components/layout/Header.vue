<template>
  <header :class="styles['headerContainer']">
    <div :class="styles.headerTop" style="background-color: gainsboro; display: grid; justify-content: end; grid-auto-flow: column; padding-top: .1rem;">
      <p style="padding-right: 1rem;">Admin Mode:</p>
        <ToggleSwitch v-model="adminMode" style="margin-right:5vw" />
        <RouterLink :to="''" @click="logout" :class="styles['logout']">Logout</RouterLink>
    </div>
    <div :class="styles.headerTop">
      <a href="https://ksu.edu" :class="styles.noBackground">
        <img :src="logo" alt="Logo" :class="styles.logo" style="height: 40px;" />
      </a>
      <div :class="styles.divider"></div>
      <a href="https://cs.ksu.edu" :class="styles.noBackground">
        <h1 :class="styles.headerTitle">Computer Science Student Portal</h1>
      </a>
    </div>

    <nav :class="styles.navSection">
      <ul :class="styles.navList">
        <li 
          :class="styles.navItemContainer" 
          v-for="(item, index) in navItems" 
          :key="index" 
          @mouseenter="showPopup($event, item)" 
          @mouseleave="item.showPopup = false"
        >
          <RouterLink :to="item.link" :class="styles.navItem" style="z-index: 5;">{{ item.label }}</RouterLink>

          <!-- Popup for subroutes -->
          <div v-if="item.showPopup && item.subRoutes.length > 0" 
               class="popup" 
               :style="{ top: popupTop - 20 + 'px', left: popupLeft -2 + 'px' }">
            <ul class="subNavList">
              <li v-for="(route, subIndex) in item.subRoutes" :key="subIndex" style="margin-top:1.3rem;">
                <RouterLink :to="route.link" style="color:white;text-align: center;">{{ route.label }}</RouterLink>
              </li>
            </ul>
          </div>

          <div v-if="index !== navItems.length - 1" :class="styles.dividerNav"></div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import ToggleSwitch from 'primevue/toggleswitch';
import logo from '../../img/ksuLogo.png';
import styles from '../../styles/Header.module.css';
import {useTokenStore} from '../../stores/TokenStore.js';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Header',
  components: {
    ToggleSwitch,
  },
  methods: {
    logout(event) {
      const tokenStore = useTokenStore();
      tokenStore.logout();
    }
  },
  setup() {
    const store = useStore(); // Get the store instance
    const adminMode = ref(store.state.IsAdminMode);
    const popupTop = ref(0);
    const popupLeft = ref(0);

    // Watch for changes to adminMode and update Vuex state accordingly
    watch(adminMode, (newVal) => {
      store.dispatch('updateIsAdminMode', newVal);
    });

    const navItems = ref([
      { label: 'Home', link: '/home', subRoutes: [] },
      { label: 'CS Applications', link: '/professional-program', subRoutes: [{ label: 'Applications', link: '/professional-program/apply' }] },
      { label: 'Profile', link: '/profile', subRoutes: [] },
    ]);

    const showPopup = (event, item) => {
      const rect = event.currentTarget.getBoundingClientRect();
      popupTop.value = rect.bottom + window.scrollY; // Position relative to the page
      popupLeft.value = rect.left; // Align with the left side of the item
      item.showPopup = true;
    };

    return {
      logo,
      styles,
      navItems,
      adminMode,
      popupTop,
      popupLeft,
      showPopup,
    };
  },
});
</script>

<style>
.popup {
  position: absolute; /* Keep this as absolute */
  text-align: center;
  color: white;
  background-color: #482277;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1.5rem 1rem 1.5rem;
  z-index: 0;
}
.subNavList {
  list-style-type: none;
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}
</style>
