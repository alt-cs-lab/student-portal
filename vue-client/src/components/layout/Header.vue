<template>
  <header :class="styles['headerContainer']">
    <!--Header bar-->
    <div :class="styles.headerTop" style="background-color: gainsboro; display: grid; justify-content: end; grid-auto-flow: column; padding-top: .1rem;">
      <p v-if="IsAdmin" style="padding-right: 1rem;">Admin Mode:</p>
        <!--Admin toggle-->
        <ToggleSwitch v-if="IsAdmin" v-model="IsAdminMode" style="margin-right:5vw" />
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

    <!--Navigation Links-->
    <nav :class="styles.navSection">
      <ul :class="styles.navList">
        <li 
          :class="styles.navItemContainer" 
          v-for="(item, index) in navItems" 
          :key="index"
          :id="'nav'+index" 
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
                <RouterLink :id="'subnav' + subIndex" :to="route.link" style="color:white;text-align: center;">{{ route.label }}</RouterLink>
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
//CSS
import styles from '../../styles/Header.module.css';

//Components
import { defineComponent, ref} from 'vue';
import { useTokenStore } from '../../stores/TokenStore.js';
import adminMixin from '@/mixins/adminMixin';

//Primevue components
import ToggleSwitch from 'primevue/toggleswitch';

//Images and icons
import logo from '../../img/ksuLogo.png';

export default defineComponent({
  name: 'Header',
  components: {
    ToggleSwitch,
  },
  mixins: [adminMixin],
  methods: {
    logout(event) {
      const tokenStore = useTokenStore();
      tokenStore.logout();
    }
  },
  setup() {
    //Check for if the admin toggle is on
    const { IsAdmin, IsAdminMode } = adminMixin.setup();

    const popupTop = ref(0);
    const popupLeft = ref(0);

    //Items pulled for the navbar
    const navItems = ref([
      { label: 'Home', link: '/home', subRoutes: [] },
      { label: 'Professional Program', link: '/professional-program', subRoutes: [{ label: 'Applications', link: '/professional-program/apply' }] },
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
      popupTop,
      popupLeft,
      showPopup,
      IsAdmin,
      IsAdminMode
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
