<template>
  <div>
    <v-container fluid>
      <template>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-card ref="form" v-model="valid" :elevation="10">
              <v-card-title>
                <span class="text-h5">Checkout Book</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  ref="personName"
                  v-model="personName"
                  :rules="[() => !!personName || 'This field is required']"
                  :error-messages="errorMessages"
                  label="Person Name"
                  placeholder="Person Name"
                  outlined
                  required
                  dense
                ></v-text-field>
                <v-text-field
                  ref="personNationalId"
                  v-model="personNationalId"
                  :rules="nationalIdRules"
                  :error-messages="errorMessages"
                  label="Person National ID"
                  placeholder="Person National ID"
                  outlined
                  required
                  dense
                ></v-text-field>
                <v-text-field
                  ref="personMobileNumber"
                  v-model="personMobileNumber"
                  :rules="mobileRules"
                  :error-messages="errorMessages"
                  label="Person Mobile"
                  placeholder="Person Mobile"
                  outlined
                  required
                  dense
                ></v-text-field>
              </v-card-text>

              <v-divider class="mt-12"></v-divider>
              <v-card-actions>
                <v-btn text @click="reset"> Reset </v-btn>
                <v-spacer></v-spacer>
                <v-slide-x-reverse-transition>
                  <v-tooltip v-if="formHasErrors" left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        class="my-0"
                        v-bind="attrs"
                        @click="reset"
                        v-on="on"
                      >
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                    </template>
                    <span>Refresh form</span>
                  </v-tooltip>
                </v-slide-x-reverse-transition>
                <v-btn color="primary" text @click="submit"> Checkout </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <v-snackbar
      v-model="snackbar"
      absolute
      centered
      color="blue-grey darken-2"
      elevation="24"
    >
      {{ text }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import instance from '../../config/axios/instance';

export default {
  data: () => ({
    snackbar: false,
    text: '',
    role: null,
    bookId: null,
    personName: null,
    personNationalId: null,
    personMobileNumber: null,
    formHasErrors: false,
    loading: true,
    valid: true,
    errorMessages: null,
    rules: [
      (value) => !!value || 'Required.',
      (value) => (value && value.length >= 3) || 'Min 3 characters',
    ],
    mobileRules: [
      (value) => !!value || 'Required.',
      (value) =>
        /^\d{2}-\d{3} \d{4}$/.test(value) ||
        'xx-xxx xxxx formate required - only digits',
    ],
    nationalIdRules: [
      (value) => !!value || 'Required.',
      (value) =>
        /^\d{11}$/.test(value) || 'xxxxxxxxxxx formate required - only digits',
    ],
    numberRule: [
      (v) => {
        if (v >= 0 && v <= 9999999) return true;
        return 'Only numbers allowed';
      },
    ],
  }),
  created() {
    this.bookId = this.$route.params.id;
  },

  computed: {
    form() {
      return {
        personName: this.personName,
        personNationalId: this.personNationalId,
        personMobileNumber: this.personMobileNumber,
      };
    },
  },
  watch: {
    // personName() {
    //   this.errorMessages = '';
    // },
  },
  methods: {
    reset() {
      this.errorMessages = [];
      this.formHasErrors = false;

      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },

    async submit() {
      this.formHasErrors = false;
      console.log(this.form);
      Object.keys(this.form).forEach((f) => {
        if (!this.form[f]) this.formHasErrors = true;

        this.$refs[f]?.validate(true);
      });

      console.log(this.formHasErrors);

      if (!this.formHasErrors) {
        let data = {
          bookId: this.bookId,
          personName: this.personName,
          personNationalId: this.personNationalId,
          personMobileNumber: this.personMobileNumber,
        };

        instance
          .post(`/book/checkout-book`, data)
          .then((res) => {
            if (res.data.status === 'success') {
              this.snackbar = true;
              this.text = 'Book Checkout Successfully';

              this.reset();
            }
          })
          .catch((err) => {
            console.log(err.response.data.error.message);
            this.snackbar = true;
            this.text =
              err.response.data.error.message || 'Something went wrong';
          });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.v-list-item {
  min-height: 1px !important;
}
</style>
