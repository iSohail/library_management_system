<template>
  <div>
    <v-alert :color="globalBreadCrumb" light dense flat>
      <v-breadcrumbs class="py-3" ligth :items="crumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item>{{ item.text.toUpperCase() }}</v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-alert>
  </div>
</template>

<script>
export default {
  computed: {
    crumbs: function() {
      let breadcrumbs = this.$route.name.split(".").map((name) => {
        return {
          text: name,
        };
      });
      return breadcrumbs;
    },
  },
};
</script>

<style></style>
