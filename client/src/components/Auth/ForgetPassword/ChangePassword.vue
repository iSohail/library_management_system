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
                <v-toolbar-title>Enter New Password</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <!-- <v-progress-linear value="15"></v-progress-linear> -->
                <v-form @keyup.native.enter="changePassword">
                  <p class="text-caption text-center">
                    Enter New password for : {{ this.number }}
                  </p>

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
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  class="mr-3 mb-3"
                  block
                  color="success"
                  @click="changePassword"
                  >Change Password</v-btn
                >
              </v-card-actions>
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
import Menu from "../../MenuBar/MenuBar";
import Footer from "../../Footer/FooterPadless";
export default {
  data() {
    return {
      show2: false,
      snackbar: false,
      text: "",
      number: null,
      password: null,
      has_error: false,
      loading: false,
      otpVerified: false,
    };
  },
  created() {
    this.getNumber();
    this.getOTPVerified();
  },
  components: {
    Menu,
    Footer,
  },
  methods: {
    getNumber() {
      this.number = this.$store.getters.getForgetPasswordNumber;
    },
    getOTPVerified() {
      this.otpVerified = this.$store.getters.getOTPVerified;
    },
    addOTPVerified(status) {
      this.$store.dispatch("addOTPVerified", status);
    },
    destroyForgetPasswordNumber() {
      this.$store.dispatch("destroyForgetPasswordNumber");
    },
    changePassword() {
      // get the redirect object
      this.loading = true;
      console.log(this.otpVerified);
      console.log(this.number);
      if (this.otpVerified && this.number) {
        this.$http({
          url: `account/ForgotPasswordChange?phoneNumber=${this.number}`,
          method: "POST",
          data: {
            password: this.password,
          },
        }).then(
          (res) => {
            this.addOTPVerified(false);
            this.destroyForgetPasswordNumber();
            console.log(res);
            this.loading = false;
            this.$router.push({ path: "login" });
          },
          (err) => {
            this.snackbar = true;
            this.text = "Error fetching country codes " + err;
            this.loading = false;
          }
        );
      } else {
        this.snackbar = true;
        this.text = "No otp or number present.";
        this.loading = false;
      }
    },
  },
};
</script>
