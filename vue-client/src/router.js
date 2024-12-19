// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Error from './components/common/ErrorPage.vue'
import Home from './components/forms/HomePage.vue'
import professionalRoutes from './sub-apps/professional-program-app/routes'
import ProfessionalProgram from './sub-apps/professional-program-app/ProfessionalProgram.vue'
import ProfileRoutes from './sub-apps/profile-app/ProfileRoutes'
import { useTokenStore } from './stores/TokenStore'


const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/professional-program', component:ProfessionalProgram,
     children: professionalRoutes
  },
  { path : '/profile',
    children: ProfileRoutes
  },
  { path: '/:catchAll(.*)', component: Error }
];


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async function (to) {
  const tokenStore = useTokenStore()
  if (!tokenStore.token) {
    await tokenStore.getToken()
  } 
  //Redirect users that haven't updated their profile at least once to the profile page.
  if (tokenStore.get_profile_updated !== true && to.path !== '/profile') {
    return {path: '/profile'}
  }
})

export default router;