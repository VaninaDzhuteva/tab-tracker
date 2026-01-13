<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="7" lg="5">
        <v-card class="pa-6" elevation="6" rounded="xl">
          <div class="text-center mb-6">
            <v-icon size="48" color="primary">mdi-account-plus</v-icon>
            <h1 class="text-h5 font-weight-bold mt-2">Create your account</h1>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Join Tab Tracker and start saving your tabs.
            </p>
          </div>

          <v-form ref="form" @submit.prevent="registerUser">
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

            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="passwordRules"
              hint="Minimum 8 characters"
              persistent-hint
              class="mb-2"
            />

            <v-alert
              v-if="error"
              type="error"
              variant="tonal"
              class="mt-4"
              border="start"
            >
              {{ error }}
            </v-alert>

            <v-btn
              class="mt-5"
              color="primary"
              size="large"
              block
              type="submit"
              :loading="loading"
              :disabled="loading"
            >
              Create account
            </v-btn>

            <div class="text-center mt-4">
              <span class="text-body-2 text-medium-emphasis">
                Already have an account?
              </span>
              <v-btn variant="text" to="/login" router class="px-1"> Log in </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationServise from "../services/AuthenticationService.js";
import { auth } from "@/store/auth";

export default {
  name: "RegisterUser",

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
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters",
      ],
    };
  },

  methods: {
    async registerUser() {
      this.error = null;
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.loading = true;

      try {
        await AuthenticationServise.register({
          email: this.email,
          password: this.password,
        });

        // Auto-login
        const res = await AuthenticationServise.login({
          email: this.email,
          password: this.password,
        });

        auth.setAuth(res.data.token, res.data.user);

        this.$router.push("/songs");
      } catch (error) {
        this.error = error?.response?.data?.error || "Registration failed.";
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
  min-height: calc(100vh - 64px); /* leaves space for app-bar */
}
</style>
