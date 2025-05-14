// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Error from './components/common/ErrorPage.vue'
import Home from './HomePage.vue'
import professionalRoutes from './sub-apps/professional-program-app/routes'
import ProfessionalProgram from './sub-apps/professional-program-app/ProfessionalProgram.vue'
import ProfileRoutes from './sub-apps/profile-app/ProfileRoutes'
import { useTokenStore } from './stores/TokenStore'
import Grades from './sub-apps/grades-app/GradesPage.vue'
import Admin from './sub-apps/admin-app/Admin.vue'
import adminRoutes from './sub-apps/admin-app/routes'
//import Admin from './sub-apps/admin-app/AdminPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/admin', component: Admin,
    children: adminRoutes
 },
  { path: '/grades', component: Grades},
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
    return {path: '/profile', query: { showToast: 'true' }}
  }
})

export default router;