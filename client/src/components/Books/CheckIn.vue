<template>
  <div>
    <v-container fluid>
      <template>
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-card ref="form" v-model="valid" :elevation="10">
              <v-card-title>
                <span class="text-h5">Checkin Book</span>
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
                  readonly
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
                  readonly
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
                  readonly
                  dense
                ></v-text-field>
                <v-text-field
                  ref="requiredReturnTimeStamp"
                  v-model="requiredReturnTimeStamp"
                  :error-messages="errorMessages"
                  label="Required Return Time"
                  placeholder="Required Return Time"
                  outlined
                  required
                  readonly
                  dense
                ></v-text-field>
                <v-text-field
                  ref="actualReturnTimeStamp"
                  v-model="actualReturnTimeStamp"
                  :rules="mobileRules"
                  :error-messages="errorMessages"
                  label="Actual Return Time"
                  placeholder="Actual Return Time"
                  outlined
                  required
                  readonly
                  dense
                ></v-text-field>
              </v-card-text>

              <v-divider class="mt-12"></v-divider>
              <v-card-actions>
                <!-- <v-btn text @click="reset"> Reset </v-btn> -->
                <span class="text-h6">Penalty of Rs : {{ penalty }}</span>

                <v-spacer></v-spacer>
                <!-- <v-slide-x-reverse-transition>
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
                </v-slide-x-reverse-transition> -->
                <v-btn color="primary" text @click="submit"> Checkin </v-btn>
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
    book: null,
    personName: null,
    personNationalId: null,
    personMobileNumber: null,
    requiredReturnTimeStamp: null,
    penalty: null,
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
    this.getBook();
  },

  computed: {
    form() {
      return {
        personName: this.personName,
        personNationalId: this.personNationalId,
        personMobileNumber: this.personMobileNumber,
      };
    },
    actualReturnTimeStamp() {
      return new Date();
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
    getBook() {
      let url = `/book?id=${this.bookId}`;

      instance.get(url).then(
        (res) => {
          let { _id, bookTitle, history } = res.data?.body?.books?.docs[0];
          console.log(bookTitle, _id, history);
          let checkoutBook = history.find((x) => x.checkoutStatus == 'true');
          console.log(checkoutBook);
          if (checkoutBook) {
            this.personName = checkoutBook?.personName;
            this.personNationalId = checkoutBook.personNationalId;
            this.personMobileNumber = checkoutBook.personMobileNumber;
            this.requiredReturnTimeStamp = new Date(
              checkoutBook.requiredReturnTimeStamp,
            );
          }
          this.book = res.data?.body?.books?.docs;
          this.loading = false;
        },
        () => {
          this.snackbar = true;
          this.text = 'Error fetching book, please refresh';
        },
      );
    },

    async submit() {
      let data = {
        bookId: this.bookId,
        personNationalId: this.personNationalId,
      };

      instance
        .post(`/book/checkin-book`, data)
        .then((res) => {
          if (res.data.status === 'success') {
            console.log(res, 'res');
            this.penalty = res.data.body.penalty;
            this.snackbar = true;
            this.text =
              'Book Checkin Successfully. Penalty of RS: ' +
              res.data.body.penalty;

            this.reset();
          }
        })
        .catch((err) => {
          console.log(err.response.data.error.message);
          this.snackbar = true;
          this.text = err.response.data.error.message || 'Something went wrong';
        });
    },
  },
};
</script>
<style scoped lang="scss">
.v-list-item {
  min-height: 1px !important;
}
</style>
