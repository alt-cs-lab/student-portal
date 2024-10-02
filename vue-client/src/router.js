// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Error from './components/common/ErrorPage.vue';
import Apply from './components/forms/ApplicationForm.vue';
import Profile from './components/forms/ProfilesForm.vue';
import Admin from './components/forms/AdminForm.vue';
import Home from './components/forms/HomePage.vue';

const routes = [
  { path: '/', component: Home },
  { path : '/error', component: Error },
  { path: '/home', component: Home },
  { path: '/apply', component: Apply },
  { path : '/profile', component: Profile },
  { path: '/adminPage', component: Admin }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;