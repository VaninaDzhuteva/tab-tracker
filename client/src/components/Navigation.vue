<template>
  <v-app-bar app color="primary" dark>
    <!-- Logo / Title -->
    <v-app-bar-title class="cursor-pointer" @click="goHome">
      🎸 Tab Tracker
    </v-app-bar-title>

    <v-spacer />

    <!-- Guest links -->
    <template v-if="!isLoggedIn">
      <v-btn variant="text" to="/login">Login</v-btn>
      <v-btn variant="text" to="/register">Register</v-btn>
    </template>

    <!-- Authenticated links -->
    <template v-else>
      <v-btn variant="text" to="/songs">Songs</v-btn>
      <v-btn variant="text" to="/songs/create">Add Tab</v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn variant="text" v-bind="props">
            {{ user.email }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script>
import { auth } from "@/store/auth";

export default {
  name: "AppNavigation",

  computed: {
    isLoggedIn() {
      return !!auth.token;
    },
    user() {
      return auth.user || {};
    },
  },

  methods: {
    logout() {
      auth.clear();
      this.$router.push("/");
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
