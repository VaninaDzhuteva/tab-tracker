<template>
  <v-container>
    <v-row class="text-center">
      <!-- Hero -->
      <v-col cols="12">
        <v-icon size="96" color="primary">mdi-music</v-icon>

        <h1 class="display-2 font-weight-bold mt-4">
          Tab Tracker
        </h1>

        <p class="subtitle-1 mt-2">
          Track, organize and learn your favorite guitar tabs 🎸
        </p>

        <!-- CTA buttons -->
        <div class="mt-6 d-flex justify-center flex-wrap" style="gap: 12px;">
          <template v-if="isLoggedIn">
            <v-btn color="primary" large elevation="6" @click="goToSongs">
              Go to Songs
            </v-btn>
            <v-btn variant="outlined" large @click="goToCreate">
              Add a Tab
            </v-btn>
          </template>

          <template v-else>
            <v-btn color="primary" large elevation="6" @click="goToRegister">
              Create account
            </v-btn>
            <v-btn variant="outlined" large @click="goToLogin">
              Log in
            </v-btn>
          </template>
        </div>

        <p v-if="!isLoggedIn" class="mt-3 text-medium-emphasis">
          Save tabs, track progress, and edit your collection anytime.
        </p>
      </v-col>

      <!-- Features -->
      <v-col cols="12" md="4" v-for="(feature, i) in features" :key="i">
        <v-card elevation="6" class="pa-4">
          <v-icon size="40" color="primary">{{ feature.icon }}</v-icon>
          <h3 class="headline font-weight-bold mt-3">
            {{ feature.title }}
          </h3>
          <p class="body-1 mt-2">
            {{ feature.text }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TabTracker',

  data: () => ({
    features: [
      {
        title: 'Save Tabs',
        text: 'Store your favorite songs and tabs in one place.',
        icon: 'mdi-playlist-music',
      },
      {
        title: 'Practice Smarter',
        text: 'Track progress and focus on what you need to learn.',
        icon: 'mdi-guitar-electric',
      },
      {
        title: 'Organize Easily',
        text: 'Search, edit and manage your tabs effortlessly.',
        icon: 'mdi-folder-music',
      },
    ],
  }),

  computed: {
    isLoggedIn () {
      return !!localStorage.getItem('token')
    },
  },

  methods: {
    goToSongs () {
      this.$router.push('/songs')
    },
    goToCreate () {
      this.$router.push('/songs/create')
    },
    goToLogin () {
      this.$router.push('/login')
    },
    goToRegister () {
      this.$router.push('/register')
    },
  },
}
</script>

<style lang="css">
  .v-main {
    margin-top: 70px;
  }

  @media screen and (max-width: 768px) {
    .v-main {
      margin-top: 30px;
    }
  }
</style>