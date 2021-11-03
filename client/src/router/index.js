import VueRouter from 'vue-router';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminDashboardStats from '../components/Dashboard/AdminDashboardStats';
import AdminBooks from '../components/Books/Books';
import AdminBooksCheckout from '../components/Books/CheckOut';
import AdminBooksCheckin from '../components/Books/CheckIn';
import Home from '../views/Home';
import Login from '../components/Auth/Login';
import ForgetPassGenerateOTP from '../components/Auth/ForgetPassword/ForgetPassGenerateOTP';
import ChangePassword from '../components/Auth/ForgetPassword/ChangePassword';
import { isLoggedIn } from '../utils/auth';

const routes = [
  {
    path: '',
    component: Home,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: ForgetPassGenerateOTP,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/password-change',
    name: 'password-change',
    component: ChangePassword,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/admin',
    component: AdminDashboard,
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: AdminDashboardStats,
      },
      {
        path: 'dashboard',
        name: 'admin.dashboard.stats',
        component: AdminDashboardStats,
        // Adding smart key with `matcher` and `handler` (optional)
        smart: {
          matcher: {
            search: [/dashboard/],
            title: () => 'Dashboard',
          },
        },
      },
      {
        path: 'books',
        name: 'admin.dashboard.books',
        component: AdminBooks,
        // Adding smart key with `matcher` and `handler` (optional)
        smart: {
          matcher: {
            search: [/books/],
            title: () => 'Books',
          },
        },
      },
      {
        path: 'books/checkout/:id',
        name: 'admin.dashboard.books.checkout',
        component: AdminBooksCheckout,
        // Adding smart key with `matcher` and `handler` (optional)
        smart: {
          matcher: {
            search: [/books checkout/],
            title: () => 'Books Checkout',
          },
        },
      },
      {
        path: 'books/checkin/:id',
        name: 'admin.dashboard.books.checkin',
        component: AdminBooksCheckin,
        // Adding smart key with `matcher` and `handler` (optional)
        smart: {
          matcher: {
            search: [/books checkin/],
            title: () => 'Books Checkin',
          },
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  isLoggedIn().then(data => {
    if (to.name == 'login' && data) {
      next({ path: '/admin' });
    } else if (!to.meta.allowAnonymous && !data) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  });
});

export default router;
