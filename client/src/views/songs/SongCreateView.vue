<template>
    <v-container class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <v-card class="pa-6" elevation="6" rounded="xl">
                    <!-- Header -->
                    <div class="text-center mb-6">
                        <v-icon size="48" color="primary">mdi-music-note-plus</v-icon>
                        <h1 class="text-h5 font-weight-bold mt-2">Add a new song</h1>
                        <p class="text-body-2 text-medium-emphasis mt-1">
                            Save a tab so you can find it later.
                        </p>
                    </div>

                    <v-form ref="form" @submit.prevent="createSong">
                        <v-text-field v-model.trim="title" label="Title" prepend-inner-icon="mdi-music"
                            variant="outlined" density="comfortable" :rules="titleRules" hide-details="auto" class="mb-5" />

                        <v-text-field v-model.trim="artist" label="Artist (optional)"
                            prepend-inner-icon="mdi-account-music-outline" variant="outlined" 
                            density="comfortable" hide-details="auto"
                            class="mb-5" />

                        <v-file-input
                            v-model="pdfFile"
                            label="Upload PDF tab (optional)"
                            accept="application/pdf"
                            prepend-inner-icon="mdi-file-pdf-box"
                            prepend-icon="" 
                            variant="outlined"
                            density="comfortable"
                            hide-details="auto"
                            class="mb-5"
                            show-size
                        ></v-file-input>

                        <v-textarea v-model="tab" label="Tab / Notes" prepend-inner-icon="mdi-note-text-outline"
                            variant="outlined" density="comfortable" rows="7" auto-grow :rules="tabRules" hide-details="auto" />

                        <v-alert v-if="error" type="error" variant="tonal" class="mt-4" border="start">
                            {{ error }}
                        </v-alert>

                        <div class="d-flex align-center mt-5" style="gap: 12px;">
                            <v-btn type="submit" color="primary" size="large" :loading="loading" :disabled="loading">
                                Save
                            </v-btn>

                            <v-btn variant="text" size="large" to="/songs" router :disabled="loading">
                                Cancel
                            </v-btn>
                        </div>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
    name: "CreateSong",

    data() {
        return {
            title: "",
            artist: "",
            tab: "",
            loading: false,
            error: null,
            pdfFile: [],

            titleRules: [
                (v) => !!v || "Title is required",
                (v) => (v && v.length >= 2) || "Title must be at least 2 characters",
            ],

            tabRules: [
                (v) => !!v || "Tab/notes are required",
            ],
        };
    },

    methods: {
        async createSong() {
            this.error = null;

            const { valid } = await this.$refs.form.validate();

            if (!valid) return;

            this.loading = true;

            try {
                const form = new FormData();
                form.append('title', this.title);
                form.append('artist', this.artist || "");
                form.append('tab', this.tab || "");

                if (this.pdfFile?.length) {
                    form.append('pdf', this.pdfFile[0]);
                }

                await SongsService.create(form);

                this.$router.push("/songs");
            } catch (e) {
                this.error =
                    e?.response?.data?.error ||
                    "Could not create song. Are you logged in?";
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.fill-height {
    min-height: calc(100vh - 64px);
}
</style>
