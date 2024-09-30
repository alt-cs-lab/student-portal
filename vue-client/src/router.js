// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/HomeTest.vue';
import About from './components/AboutTest.vue';
import Error from './components/common/ErrorPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path : '/error', component: Error },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;