import { lazy } from 'solid-js';

const App = lazy(() => import('./App'));
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

export const routes = [
  {
    path: '/',
    component: App,
  },
  {
    path: '/admin',
    component: AdminPanel,
  },
];
