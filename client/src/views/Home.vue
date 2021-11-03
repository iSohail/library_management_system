<template>
  <div id="app">
    <v-app id="inspire">
      <Menu />

      <v-container fill-height fluid>
        <v-row align="center" justify="center" class="mx-auto">
          <v-col class="mx-auto text-center">
            <v-card flat class="mx-auto" max-width="800">
              <v-card-text class="text-center font-weight-bold">
                <img :src="source" style="width:150px;" alt="logo" />
                <p class="display-2 text--primary pt-5">
                  <span class="green--text lighten-5 font-weight-bold"
                    >Admin</span
                  >
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <Footer />
    </v-app>
  </div>
</template>

<script>
import Menu from "../components/MenuBar/MenuBar";
import Footer from "../components/Footer/FooterPadless";

export default {
  data: () => ({
    source: "",
  }),
  components: {
    Menu,
    Footer,
  },
  methods: {},
  created() {
    this.source = require(`../assets/dealmate.png`);
  },
};
</script>
