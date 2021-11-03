<template>
  <div>
    <!-- <bread-crumb /> -->
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto text-center"
              color="red darken-3"
              elevation="12"
              max-width="calc(100% - 140px)"
            >
              <v-icon x-large class="my-4">mdi-truck-fast</v-icon>
            </v-sheet>

            <v-card-text class="pt-0 text-center text-margin">
              <div class="title font-weight-light">Products</div>
              <div class="subtitle-1 font-weight-light grey--text">
                {{ products }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto text-center"
              color="purple darken-3"
              elevation="12"
              max-width="calc(100% - 140px)"
            >
              <v-icon x-large class="my-4">mdi-clipboard-check</v-icon>
            </v-sheet>

            <v-card-text class="pt-0 text-center text-margin">
              <div class="title font-weight-light">Customers</div>
              <div class="subtitle-1 font-weight-light grey--text">
                {{ customers }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto text-center"
              color="green darken-3"
              elevation="12"
              max-width="calc(100% - 140px)"
            >
              <v-icon x-large class="my-4">mdi-account-group</v-icon>
            </v-sheet>

            <v-card-text class="pt-0 text-center text-margin">
              <div class="title font-weight-light">Orders</div>
              <div class="subtitle-1 font-weight-light grey--text">
                {{ orders }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="mt-4 mx-auto" max-width="400">
            <v-sheet
              class="v-sheet--offset mx-auto text-center"
              color="orange darken-3"
              elevation="12"
              max-width="calc(100% - 140px)"
            >
              <v-icon x-large class="my-4">mdi-cash-multiple</v-icon>
            </v-sheet>

            <v-card-text class="pt-0 text-center text-margin">
              <div class="title font-weight-light">Income</div>
              <div class="subtitle-1 font-weight-light grey--text">
                {{ amount_paid }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import BreadCrumb from "../utils/BreadCrumb.vue";
export default {
  // components: {
  //   BreadCrumb,
  // },
  data: () => ({
    loading: false,
    products: "100",
    orders: "100",
    customers: "100",
    amount_paid: "100",
  }),
};
</script>

<style></style>
