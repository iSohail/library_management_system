<template>
  <div class="text-right px-5 py-5">
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on }">
        <v-btn color="dark" light v-on="on">
          <v-icon>mdi-apps</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-title>
            <v-icon>{{ link.icon }}</v-icon>
            {{ link.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        icon: "mdi-login",
        text: "Login",
        route: "/login"
      },
      {
        icon: "mdi-login",
        text: "Admin",
        route: "/admin"
      },
      { icon: "mdi-home", text: "Home", route: "/", show: true }
    ]
  })
};
</script>
