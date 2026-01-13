<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="7" lg="5">
        <v-card class="pa-6" elevation="6" rounded="xl">
          <!-- Header -->
          <div class="text-center mb-6">
            <v-icon size="48" color="primary">mdi-login</v-icon>
            <h1 class="text-h5 font-weight-bold mt-2">Welcome back</h1>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Log in to continue tracking your tabs.
            </p>
          </div>

          <v-form v-model="isValid" @submit.prevent="login">
            <!-- Email -->
            <v-text-field
              v-model.trim="email"
              label="Email"
              type="email"
              autocomplete="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              :rules="emailRules"
              class="mb-3"
            />

            <!-- Password -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              autocomplete="current-password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="passwordRules"
            />

            <!-- Error -->
            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mt-4"
              border="start"
            >
              {{ error }}
            </v-alert>

            <!-- Submit -->
            <v-btn
              class="mt-5"
              color="primary"
              size="large"
              block
              type="submit"
              :loading="loading"
              :disabled="!isValid || loading"
            >
              Log in
            </v-btn>

            <!-- Register link -->
            <div class="text-center mt-4">
              <span class="text-body-2 text-medium-emphasis">
                Don’t have an account?
              </span>
              <v-btn variant="text" to="/register" router class="px-1">
                Create one
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from "../services/AuthenticationService.js";
import { auth } from "@/store/auth";

export default {
  name: "LoginUser",

  data() {
    return {
      email: "",
      password: "",
      error: null,
      loading: false,
      isValid: false,
      showPassword: false,

      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Enter a valid email",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },

  methods: {
    async login() {
      this.error = null;
      this.loading = true;

      try {
        const res = await AuthenticationService.login({
          email: this.email,
          password: this.password,
        });

        auth.setAuth(res.data.token, res.data.user)

        this.$router.push("/songs");
      } catch (err) {
        this.error =
          err?.response?.data?.error || "Login failed. Please check your credentials.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.fill-height {
  margin-top: 60px;
  min-height: calc(100vh - 64px);
}
</style>
