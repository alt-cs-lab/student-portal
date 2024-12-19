import ProfessionalHome from './ProfessionalHome.vue';
import ApplicationsPage from './ApplicationsPage.vue';

const routes = [
  { path: '', name: 'home', component: ProfessionalHome },
  { path: 'apply', name:'apply', component: ApplicationsPage },
];

export default routes;