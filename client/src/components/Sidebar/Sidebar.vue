<template>
  <div>
    <v-theme-provider dark>
      <v-navigation-drawer
        color="blue-grey darken-4"
        v-model="drawer"
        app
        dense
      >
        <perfect-scrollbar>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                class="text-h4 font-weight-black text-center white--text"
              >
                LMS
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-avatar color="brown" size="40" class="mr-2">
              <span v-if="!img && initials" class="white--text headline">{{
                initials
              }}</span>
              <img v-if="img" :src="img" width="30px" :alt="name" />
            </v-avatar>
            <v-list-item-content>
              <v-list-item-title class="text-button">
                {{ name || 'Loading...' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-overline">
                SUPER ADMIN
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>

          <v-list dense class="sidebar-list-ui">
            <template v-for="item in sidebar">
              <v-list-item
                v-if="!item.items.length > 0"
                :key="item.title"
                router
                :to="item.route"
                :color="globalSideBarActiveColor"
              >
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-group
                v-else
                :key="item.title"
                prepend-icon
                :color="globalSideBarActiveColor"
              >
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </template>
                <v-list-item
                  v-for="(nestedItem, i) in item.items"
                  :key="i"
                  router
                  :to="nestedItem.link"
                  class="blue-grey darken-2"
                >
                  <v-list-item-title
                    class="pl-4"
                    v-text="nestedItem.title"
                  ></v-list-item-title>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list>
        </perfect-scrollbar>
        <template v-slot:append>
          <!-- <div class="pa-2 ">
            <v-btn @click="logout()" class="red darken-4 white--text" block
              >Logout</v-btn
            >
          </div> -->
          <div
            class="
              pa-2
              mx-auto
              text-caption text-uppercase text-center
              grey--text
              text-darken-2
            "
          >
            Dealmate
            <br />
            Copyright &copy; {{ new Date().getFullYear() }}
          </div>
        </template>
      </v-navigation-drawer>
    </v-theme-provider>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-autocomplete
        v-model="selectedSearch"
        :items="smartRoutes"
        :search-input.sync="routeLocationInput"
        :filter="() => true"
        item-text="title"
        label="Search"
        hide-no-data
        hide-details
        return-object
        dense
        solo
        light
        flat
        append-icon=""
        prepend-inner-icon="mdi-magnify"
        class="search-styles"
        @change="handleSearchRoute"
        @blur="resetSearchStates"
      >
      </v-autocomplete>
      <input
        type="text"
        hidden
        v-model="routeLocationInput"
        v-smart-routes="smartRoutes"
      />
      <v-spacer></v-spacer>
      <!-- <v-btn @click="setGlobalLoadingState(true)">k</v-btn> -->
      <!-- notification -->
      <v-menu bottom min-width="250px" left offset-y tile>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-btn icon color="primary" fab small>
              <v-icon>mdi-bell-outline</v-icon>
            </v-btn>
          </v-btn>
        </template>
        <v-card tile>
          <v-list-item-content class="justify-center">
            <div class="mx-auto">
              <v-list dense flat>
                <v-list-item-group
                  color="primary"
                  @change="notificationRedirect"
                >
                  <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.text"
                        class="grey--text text--darken-3"
                      ></v-list-item-title>
                      <v-list-item-subtitle class="grey--text">{{
                        item.time
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-btn
                depressed
                text
                block
                class="text-caption"
                style="color: #3d3d3d"
              >
                View all Notifications
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <!-- messages -->
      <v-menu bottom min-width="250px" left offset-y tile>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-btn icon color="primary" fab small>
              <v-icon>mdi-email-outline</v-icon>
            </v-btn>
          </v-btn>
        </template>
        <v-card tile>
          <v-list-item-content class="justify-center">
            <div class="mx-auto">
              <v-list dense flat>
                <v-list-item-group
                  color="primary"
                  @change="notificationRedirect"
                >
                  <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.text"
                        class="grey--text text--darken-3"
                      ></v-list-item-title>
                      <v-list-item-subtitle class="grey--text">{{
                        item.time
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-btn
                depressed
                text
                block
                class="text-caption"
                style="color: #3d3d3d"
              >
                View all Messages
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <!-- user account -->
      <v-menu bottom min-width="200px" left offset-y tile>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar :color="avatarColor" size="30">
              <span v-if="!img && initials" class="white--text headline">{{
                initials
              }}</span>
              <img v-if="img" :src="img" :alt="name" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card tile>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <span v-if="!img && initials" class="white--text headline">{{
                  initials
                }}</span>
                <img v-if="img" :src="img" width="30px" :alt="name" />
              </v-avatar>
              <h4 class="text-button" style="color: #3d3d3d">
                {{ name }}
              </h4>
              <v-divider class="my-1"></v-divider>
              <v-btn
                depressed
                text
                block
                class="text-overline"
                style="color: #3d3d3d"
              >
                Edit Account
              </v-btn>
              <v-divider class="my-1"></v-divider>
              <v-btn
                style="color: #3d3d3d"
                @click="logout()"
                depressed
                text
                block
                class="text-overline"
              >
                logout
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <v-progress-linear
        :active="this.$store.getters.getGlobalLoading"
        indeterminate
        absolute
        bottom
        :color="globalLoaderColor"
      ></v-progress-linear>
    </v-app-bar>
  </div>
</template>

<script>
import { getAuthTokenUser } from '../../utils/auth';

export default {
  props: ['sidebar'],
  data: () => ({
    initials: null,
    name: null,
    drawer: null,
    img: require('../../assets/demo_avatar.png'),
    model: 1,
    smartRoutes: [],
    selectedSearch: null,
    routeLocationInput: null,
    avatarColor: 'brown',
    items: [
      { text: 'Real-Time', time: 'just now' },
      { text: 'Audience', time: 'just now' },
      { text: 'Conversions', time: 'just now' },
    ],
  }),
  watch: {
    // whenever question changes, this function will run
    img: function (val) {
      if (val) {
        this.avatarColor = null;
      } else {
        this.avatarColor = 'brown';
      }
    },
  },
  created() {
    console.log('cookie', this.$cookie.get('AUTH_TOKEN_USER'));
    console.log(getAuthTokenUser());
    let tokenUser = JSON.parse(getAuthTokenUser());
    this.name = tokenUser.username;
    this.initials = tokenUser.username[0];
    // this.$http({
    //   url: `/auth/verify-token`,
    //   method: 'GET',
    // }).then(
    //   (res) => {
    //     console.log(res);
    //     this.name = res.data.name;
    //     this.initials = res.data.name[0];
    //   },
    //   () => {
    //     this.snackbar = true;
    //     this.text = 'Error fetching user information, just nowplease refresh';
    //   },
    // );
  },
  methods: {
    notificationRedirect(e) {
      console.log('notification hit', e);
    },
    setGlobalLoadingState(status) {
      this.$store.dispatch('setGlobalLoadingState', status);
    },
    resetSearchStates() {
      this.selectedSearch = '';
      this.smartRoutes = [];
      this.routeLocationInput = '';
    },
    handleSearchRoute() {
      console.log(this.selectedSearch);
      this.$router.push({ name: this.selectedSearch.name });
      this.resetSearchStates();
    },
    logout() {
      // localStorage.removeItem('token');
      this.$cookie.delete('AUTH_TOKEN_KEY');
      window.location.href = '/';
    },
  },
};
</script>

<style lang="scss" scoped>
.ps {
  height: 100%;
}
.search-styles {
  max-width: 400px;
  border-radius: 0px;
}
.sidebar-list-ui .theme--dark.v-icon {
  color: #c7c7c7 !important;
}
.sidebar-list-ui .v-list-item__title {
  color: #c7c7c7 !important;
}
.sidebar-list-ui .v-list-item__action,
.sidebar-list-ui .v-list-item__icon {
  margin-right: 20px !important;
}
</style>
