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
    <!-- Authenticated links -->
    <template v-else>
      <v-btn variant="text" to="/songs">Songs</v-btn>
      <v-btn variant="text" to="/songs/create">Add Tab</v-btn>

      <!-- Profile dropdown -->
      <v-menu v-model="profileMenuOpen" location="bottom end" origin="top end" :offset="10" :max-width="260">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" class="">
            <v-avatar color="primary" variant="tonal" size="36">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-card min-width="200" max-width="240">
          <v-list density="comfortable">
            <v-list-item to="/profile" router>
              <template #prepend>
                <v-icon>mdi-account-circle</v-icon>
              </template>
              <v-list-item-title class="pa-2">Profile</v-list-item-title>
              <v-list-item-subtitle class="pa-2" v-if="user.email">
                {{ user.email }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider />

            <v-list-item @click="logout">
              <template #prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title class="text-error pa-2">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>

  </v-app-bar>
</template>

<script>
import { auth } from "@/store/auth";

export default {
  name: "AppNavigation",

  data() {
    return {
      profileMenuOpen: false
    }
  },

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

    closeProfileMenu() {
      this.profileMenuOpen = false;
      this.logout();
    },

    logoutAndClose() {
      auth.clear?.();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
