<template>
  <v-layout column>
    <v-container>
      <v-flex>
        <div class="white mx-auto">
          <!-- <v-toolbar flat dense class="cyan" dark>
                <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar> -->

          <v-card title="Register" max-width="700" class="mx-auto">
            <form name="tab-tracker-form" autocomplete="off">
              <v-text-field label="Email" v-model="email"></v-text-field>
              <br />
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                autocomplete="new-password"
              ></v-text-field>
            </form>
            <br />
            <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
              {{ error }}
            </v-alert>
            <br />
            <v-btn dark class="primary" @click="registerUser"> Register </v-btn>
          </v-card>
        </div>
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import AuthenticationServise from "../services/AuthenticationService.js";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },

  methods: {
    async registerUser() {
      try {
        await AuthenticationServise.register({
          email: this.email,
          password: this.password,
        });

        const res = await AuthenticationServise.login({
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        this.$router.push("/songs");
      } catch (error) {
        this.error = error?.response?.data?.error || "Registration failed.";
      }
    },
  },
};
</script>

<style>
.error {
  color: red;
}
</style>
