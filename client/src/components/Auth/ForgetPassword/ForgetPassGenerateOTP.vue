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
                <v-toolbar-title>Phone Number</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <!-- <v-progress-linear value="15"></v-progress-linear> -->
                <v-form @keyup.native.enter="generateOTP">
                  <v-select
                    item-value="code"
                    item-text="code"
                    v-model="selectedCountryCode"
                    :items="countryCodes"
                    label="Select Country code"
                  ></v-select>

                  <v-text-field
                    label="Number"
                    name="number"
                    v-model="number"
                    type="text"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  class="mr-3 mb-3"
                  block
                  color="success"
                  @click="generateOTP"
                  >Generate OTP</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Verify OTP</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form v-model="valid" ref="form">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="otpVerifyCode"
                        label="OTP*"
                        :rules="requiredRule"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="verifyOTP">
                Check
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      countryCodes: null,
      selectedCountryCode: "",
      otpVerifyCode: "",
      has_error: false,
      loading: false,
      valid: "",
      dialog: false,
      requiredRule: [(v) => !!v || "Field is required"],
    };
  },
  created() {
    this.$http({
      url: "/countrycodes",
      method: "GET",
    }).then(
      (res) => {
        console.log(res);
        let countryCodes = res.data;
        countryCodes.sort((a, b) => {
          if (a.countryName < b.countryName) {
            return -1;
          }
          if (a.countryName > b.countryName) {
            return 1;
          }
          return 0;
        });
        console.log(countryCodes);
        this.countryCodes = countryCodes.map((item) => item.countryCode1);
        if (this.countryCodes.filter((item) => item == 60)[0]) {
          this.selectedCountryCode = this.countryCodes.filter(
            (item) => item == 60
          )[0];
        }
      },
      (err) => {
        this.snackbar = true;
        this.text = "Error fetching country codes " + err;
      }
    );
  },
  components: {
    Menu,
    Footer,
  },
  methods: {
    updateStore() {
      this.$store.dispatch(
        "addForgetPasswordNumber",
        this.selectedCountryCode + "" + this.number
      );
    },
    addOTPVerified(status) {
      this.$store.dispatch("addOTPVerified", status);
    },
    destroyForgetPasswordNumber() {
      this.$store.dispatch("destroyForgetPasswordNumber");
    },
    verifyOTP() {
      if (this.$refs.form.validate()) {
        console.log("kk");
        this.loading = true;

        try {
          this.$http({
            url: `account/VerifyOTPPassword?phoneNumber=${this.selectedCountryCode}${this.number}&otp=${this.otpVerifyCode}`,
            method: "POST",
            data: {},
          }).then(
            (res) => {
              console.log(res);
              this.addOTPVerified(true);
              this.isUpdating = false;
              this.dialog = false;
              this.loading = false;
              this.$router.push({ path: "password-change" });
            },
            () => {
              this.addOTPVerified(false);
              this.destroyForgetPasswordNumber();
              this.isUpdating = false;
              this.snackbar = true;
              this.text = "OTP verification error";
              this.loading = false;
            }
          );
        } catch (err) {
          this.snackbar = true;
          this.text = "Fill OTP";
          this.loading = false;
        }
      }
    },
    generateOTP() {
      // get the redirect object
      this.loading = true;

      try {
        this.$http({
          url: `account/ForgotPasssordAdmin?phoneNumber=${this.selectedCountryCode}${this.number}`,
          method: "POST",
          data: {},
        }).then(
          (res) => {
            console.log(res);
            this.isUpdating = false;
            this.dialog = true;
            this.loading = false;

            this.updateStore();
          },
          (err) => {
            this.isUpdating = false;
            this.snackbar = true;
            this.text = "Error finding number : " + err;
            this.loading = false;
          }
        );
      } catch (err) {
        this.snackbar = true;
        this.text = "Error finding number" + err;
        this.loading = false;
      }
    },
  },
};
</script>
