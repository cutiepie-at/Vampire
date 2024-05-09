import {createRouter, createWebHistory} from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import LabelsView from '@/views/LabelsView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ValuesNewView from '@/views/ValuesNewView.vue';
import ValuesView from '@/views/ValuesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/labels',
      name: 'labels',
      component: LabelsView,
    },
    {
      path: '/values',
      name: 'values',
      component: ValuesView,
    },
    {
      path: '/values/new',
      name: 'values-new',
      component: ValuesNewView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
});

export default router;
