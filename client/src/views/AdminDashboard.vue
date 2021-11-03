<template>
  <v-app id="inspire">
    <Sidebar :sidebar="sidebar" />
    <v-main>
      <BreadCrumb />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '../components/Sidebar/Sidebar';
import BreadCrumb from '../components/utils/BreadCrumb';

export default {
  components: {
    Sidebar,
    BreadCrumb,
  },
  data: () => ({
    drawer: null,
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        route: '/admin/dashboard',
        items: [],
      },
      {
        title: 'Books',
        icon: 'mdi-view-dashboard',
        route: '/admin/books',
        items: [],
        //   items: [
        //     {
        //       title: "Questions",
        //       link: "/admin/faqs/custom-questions",
        //     },
        //     {
        //       title: "Manage",
        //       link: "/admin/faqs/manage",
        //     },
        //   ],
      },
    ],
  }),
};
</script>
