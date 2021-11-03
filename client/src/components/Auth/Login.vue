<template>
  <v-app id="inspire" dark>
    <Menu />
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" class="mx-auto">
          <v-col cols="12" sm="8" md="4" class="mx-auto">
            <v-card class="elevation-12 mx-auto">
              <v-progress-linear
                :active="loading"
                color="indigo darken-4"
                striped
                top
                :indeterminate="loading"
                absolute
              ></v-progress-linear>
              <v-toolbar color="success" dark flat max-height="150px">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <!-- <v-progress-linear value="15"></v-progress-linear> -->
                <v-form @keyup.native.enter="login">
                  <!-- <v-select
                    item-value="code"
                    item-text="code"
                    v-model="selectedCountryCode"
                    :items="countryCodes"
                    label="Select Country code"
                  ></v-select> -->

                  <v-text-field
                    label="Email"
                    name="email"
                    v-model="email"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    v-model="password"
                    @click:append="show2 = !show2"
                  />
                </v-form>
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      class="mr-3 mb-3"
                      block
                      color="success"
                      @click="login"
                      >Login</v-btn
                    >
                  </v-col>
                </v-row>
                <!-- <v-row>
                  <v-col cols="12">
                    <a
                      style="cursor: pointer, text-align: right"
                      @click="gotoForgotPassword"
                    >
                      Forgot password?
                    </a>
                  </v-col>
                </v-row> -->
              </v-card-text>
              <v-card-actions> </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar v-model="snackbar">
          {{ text }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
      <Footer />
    </v-content>
  </v-app>
</template>

<script>
import Menu from '../MenuBar/MenuBar';
import Footer from '../Footer/FooterPadless';
import { loginUser } from '../../utils/auth';
export default {
  data() {
    return {
      show2: false,
      snackbar: false,
      text: '',
      email: null,
      password: null,
      countryCodes: null,
      selectedCountryCode: '',
      has_error: false,
      loading: false,
    };
  },
  created() {
    // this.$http({
    //   url: "/countrycodes",
    //   method: "GET",
    // }).then(
    //   (res) => {
    //     console.log(res);
    //     let countryCodes = res.data;
    //     countryCodes.sort((a, b) => {
    //       if (a.countryName < b.countryName) {
    //         return -1;
    //       }
    //       if (a.countryName > b.countryName) {
    //         return 1;
    //       }
    //       return 0;
    //     });
    //     console.log(countryCodes);
    //     this.countryCodes = countryCodes.map((item) => item.countryCode1);
    //     if (this.countryCodes.filter((item) => item == 60)[0]) {
    //       this.selectedCountryCode = this.countryCodes.filter(
    //         (item) => item == 60
    //       )[0];
    //     }
    //   },
    //   (err) => {
    //     this.snackbar = true;
    //     this.text = "Error fetching country codes " + err;
    //   }
    // );
  },
  components: {
    Menu,
    Footer,
  },
  methods: {
    // gotoForgotPassword() {
    //   this.$router.push({ path: '/forget-password' });
    // },
    login() {
      // get the redirect object
      this.loading = true;
      try {
        loginUser(this.email, this.password).then(
          () => {
            this.$router.push('/admin');
          },
          (err) => {
            console.log(err);
            this.snackbar = true;
            this.text = 'Error logging in' + err;
          },
        );
      } catch (err) {
        this.snackbar = true;
        this.text = 'Error logging in' + err;
      }
      this.loading = false;
    },
  },
};
</script>
