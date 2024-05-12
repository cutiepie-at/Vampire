import {createRouter, createWebHistory} from 'vue-router';
import AboutView from '@/views/AboutView.vue';
import HomeView from '@/views/HomeView.vue';
import LabelsView from '@/views/LabelsView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ValuesView from '@/views/ValuesView.vue';
import ReportsView from '@/views/ReportsView.vue';
import ReportDetailsView from '@/views/ReportDetailsView.vue';

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
      path: '/reports',
      name: 'reports',
      component: ReportsView,
    },
    {
      path: '/reports/:id',
      name: 'report details',
      component: ReportDetailsView,
    },
    {
      path: '/reports/:id/edit',
      name: 'report edit',
      component: ReportDetailsView,
      props: {readonly: false},
    },
    {
      path: '/values',
      name: 'values',
      component: ValuesView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
});

export default router;
