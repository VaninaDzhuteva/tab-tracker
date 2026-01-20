<template>
    <v-container>
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold">Edit Song</h1>
                <p class="text-body-2 text-medium-emphasis">Update title, tab, or replace PDF.</p>
            </div>

            <v-btn variant="outlined" :to="`/songs/${songId}`" router>
                <v-icon start>mdi-arrow-left</v-icon>
                Back
            </v-btn>
        </div>

        <v-alert v-if="error" type="error" variant="outlined" class="mb-4" border="start">
            {{ error }}
        </v-alert>

        <v-card rounded="xl" class="pa-6">
            <v-form ref="form" @submit.prevent="save" validate-on="submit">
                <v-text-field v-model="title" label="Title" variant="outlined" density="comfortable" hide-details="auto"
                    :rules="[v => !!v || 'Title is required']" />

                <v-text-field v-model="artist" label="Artist (optional)" variant="outlined" density="comfortable"
                    hide-details="auto" class="mt-3" />

                <v-select v-model="difficulty" :items="difficultyOptions" item-value="value" label="Difficulty"
                    prepend-inner-icon="mdi-signal" variant="outlined" density="comfortable" hide-details="auto" />

                <v-textarea v-model="tab" label="Tab (optional)" variant="outlined" density="comfortable"
                    hide-details="auto" rows="10" class="mt-3" />

                <v-file-input v-model="pdfFile" label="Replace PDF tab (optional)" accept="application/pdf"
                    prepend-inner-icon="mdi-file-pdf-box" prepend-icon="" variant="outlined" density="comfortable"
                    hide-details="auto" class="mt-3" show-size :multiple="false" />

                <div v-if="currentPdfUrl" class="mt-4">
                    <div class="text-subtitle-2 font-weight-bold mb-2">Current PDF</div>
                    <iframe :src="currentPdfUrl"
                        style="width: 100%; height: 420px; border: none; border-radius: 12px;"></iframe>
                </div>

                <div class="d-flex justify-end mt-6" style="gap: 10px;">
                    <v-btn variant="text" :to="`/songs/${songId}`" router>Cancel</v-btn>
                    <v-btn color="primary" type="submit" :loading="loading">Save</v-btn>
                </div>
            </v-form>
        </v-card>

        <v-snackbar v-model="snackbar.show" :timeout="2500">
            {{ snackbar.text }}
        </v-snackbar>
    </v-container>
</template>

<script>
import SongsService from '@/services/SongsService.js';

export default {
    name: 'EditSongView',

    data() {
        return {
            title: '',
            artist: '',
            tab: '',
            pdfFile: [],
            song: null,
            loading: false,
            error: null,
            snackbar: { show: false, text: '' },
            serverUrl: "http://localhost:8081",
        }
    },

    computed: {
        songId() {
            return this.$route.params.id;
        },

        currentPdfUrl() {
            return this.song?.pdfPath ? this.serverUrl + this.song.pdfPath : '';
        }
    },

    async created() {
        await this.load();
    },

    methods: {
        async load() {
            this.loading = true;
            this.error = null;
            try {
                const res = await SongsService.getById(this.songId);
                this.song = res.data;

                this.title = this.song?.title || '';
                this.artist = this.song?.artist || "";
                this.tab = this.song?.tab || "";
                this.difficulty = this.song?.difficulty || "beginner";
                try {
                    this.tags = JSON.parse(this.song?.tags || "[]");
                } catch  {
                    this.tags = [];
                }

            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to load song.";
            } finally {
                this.loading = false;
            }
        },

        async save() {
            this.error = null;

            const { valid } = await this.$refs.form.validate();
            if (!valid) return;

            this.loading = true;

            try {
                const form = new FormData();
                form.append('title', this.title);
                form.append("artist", this.artist || "");
                form.append("tab", this.tab || "");
                form.append('difficulty', this.difficulty);
                form.append("tags", JSON.stringify(this.tags));

                if (this.pdfFile?.length) {
                    form.append("pdf", this.pdfFile[0]);
                }

                await SongsService.update(this.songId, form);
                this.snack('Saved');
                this.$router.push(`/songs/${this.songId}`);

            } catch (e) {
                console.log(e);

                this.error = e?.response?.data?.error || 'Failed to update song.';
            } finally {
                this.loading = false;
            }
        },

        snack(text) {
            this.snackbar.text = text;
            this.snackbar.show = true;
        }
    }
}
</script>