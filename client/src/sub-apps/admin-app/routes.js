import UsersPage from './UserPage.vue';
import DiscordPage from './DiscordPage.vue';

const routes = [
  { path: 'users', name: 'users', component: UsersPage },
  { path: 'discord', name:'discord', component: DiscordPage },
];

export default routes;