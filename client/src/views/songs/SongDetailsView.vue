<template>
    <v-container>
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <div class="d-flex align-center" style="gap: 10px;">
                    <h1 class="text-h5 font-weight-bold">{{ title }}</h1>
                    <v-chip class="ml-2" size="small" variant="outlined" :color="difficultyColor(song?.difficulty)">
                        {{ difficultyLabel(song?.difficulty) }}
                    </v-chip>
                </div>
                <p class="text-body-2 text-medium-emphasis">{{ subtitle }}</p>
            </div>

            <div class="d-flex align-center" style="gap: 10px;">
                <v-btn variant="outlined" to="/songs" router>
                    <v-icon start>mdi-arrow-left</v-icon>
                    Back
                </v-btn>

                <v-btn color="primary" variant="outlined" :to="`/songs/${songId}/edit`" router>
                    <v-icon start>mdi-pencil-outline</v-icon>
                    Edit
                </v-btn>

                <v-btn color="error" variant="outlined" @click="deleteDialog = true">
                    <v-icon start>mdi-delete-outline</v-icon>
                    Delete
                </v-btn>

                <v-btn variant="outlined" @click="toggleFavorite">
                    <v-icon start :color="song?.isFavorite ? 'warning' : undefined">
                        {{ song?.isFavorite ? 'mdi-star' : 'mdi-star-outline' }}
                    </v-icon>
                    {{ song?.isFavorite ? 'Favorited' : 'Favorite' }}
                </v-btn>


                <v-btn v-if="pdfUrl" variant="outlined" :href="pdfUrl" target="_blank">
                    <v-icon start>mdi-file-pdf-box</v-icon>
                    View PDF
                </v-btn>
            </div>
        </div>

        <v-card class="mt-6 pa-6 mb-5" rounded="xl">
            <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-subtitle-1 font-weight-bold">Practice progress</div>
                <div class="text-body-2 text-medium-emphasis">{{ progressLocal }}%</div>
            </div>

            <v-slider v-model="progressLocal" :min="0" :max="100" step="5" hide-details="auto" />

            <div class="d-flex align-center justify-space-between mt-3 ">
                <div class="text-caption text-medium-emphasis">
                    Last practiced:
                    <b>{{ song?.lastPracticedAt ? formatDate(song.lastPracticedAt) : 'Never' }}</b>
                </div>

                <div class="d-flex" style="gap: 10px;">
                    <v-btn variant="outlined" @click="saveProgress" :loading="savingProgress">
                        Save
                    </v-btn>

                    <v-btn color="primary" @click="practiceNow" :loading="practicing">
                        <v-icon start>mdi-timer</v-icon>
                        Practice now
                    </v-btn>
                </div>
            </div>
        </v-card>


        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" border="start">
            {{ error }}
        </v-alert>

        <v-card v-if="loading" class="pa-6" rounded="xl">
            <div class="text-medium-emphasis">Loading song..</div>
            <v-progress-linear indeterminate class="mt-3"></v-progress-linear>
        </v-card>

        <v-card v-else-if="song" rounded="xl" class="pa-6">
            <div class="d-flex align-center justify-space-between mb-3">

                <div class="text-subtitle-1 font-weight-bold">Tab</div>

                <v-btn v-if="tab" size="small" variant="outlined" @click="copyTab">
                    <v-icon start size="18">mdi-content-copy</v-icon>
                    Copy
                </v-btn>
            </div>

            <v-alert v-if="!tab" type="info" variant="tonal" border="start">
                No tab content available for this song yet.
            </v-alert>

            <pre v-else class="tab-box">{{ tab }}</pre>
        </v-card>

        <v-card>
            <div v-if="pdfUrl" class="mt-6">
                <div class="text-subtitle-1 font-weight-bold mb-3">PDF Preview</div>

                <iframe :src="pdfUrl" style="width: 100%; height: 600px; border: none; border-radius: 12px;"></iframe>

                <div class="mt-3">
                    <v-btn :href="pdfUrl" target="_blank" variant="outlined">
                        <v-icon start>mdi-open-in-new</v-icon>
                        Open in new tab
                    </v-btn>
                </div>
            </div>
        </v-card>

        <v-snackbar v-model="snackbar.show" :timeout="2500">
            {{ snackbar.text }}
        </v-snackbar>

        <v-dialog v-model="deleteDialog" max-width="520">
            <v-card rounded="xl">
                <v-card-title class="text-h6 font-weight-bold">Delete song?</v-card-title>
                <v-card-text>
                    This will permanently delete: <b>{{ title }}</b>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="deleteDialog = false" :disabled="deleting">
                        Cancel
                    </v-btn>
                    <v-btn color="error" @click="confirmDelete" :loading="deleting">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import SongsService from '@/services/SongsService.js';

export default {
    name: 'SongDetailsView',

    data() {
        return {
            song: null,
            loading: false,
            error: null,
            snackbar: { show: false, text: '' },
            serverUrl: "http://localhost:8081",
            deleteDialog: false,
            deleting: false,
            progressLocal: 0,
            savingProgress: false,
            practicing: false,
        }
    },

    computed: {
        title() {
            return this.song?.title || this.song?.name || 'Song'
        },
        subtitle() {
            const artist = this.song?.artist || this.song?.band || "";
            const created = this.song?.createdAt || this.song?.created_at || null;

            const bits = [];
            if (artist) {
                bits.push(`Artist: ${artist}`)
            }

            if (created) {
                bits.push(`Created: ${this.formatDate(created)}`);
            }

            return bits.join(' • ')
        },
        tab() {
            return (
                this.song?.tab ||
                this.song?.tabs ||
                this.song?.content ||
                this.song?.notes ||
                this.song?.lyrics ||
                ""
            )
        },
        pdfUrl() {
            return this.song?.pdfPath ? this.serverUrl + this.song.pdfPath : '';
        },

        songId() {
            return this.$route.params.id;
        }
    },

    async created() {
        await this.loadSong();
    },

    watch: {
        "$route.params.id": {
            handler() {
                this.loadSong();
            }
        }
    },

    methods: {
        async loadSong() {
            this.loading = true;
            this.error = null;

            try {
                const id = this.$route.params.id;
                const res = await SongsService.getById(id);
                this.song = res.data;
                this.progressLocal = Number(this.song?.progress ?? 0);
            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to load song.";
            } finally {
                this.loading = false;
            }
        },

        formatDate(v) {
            const d = new Date(v);
            if (Number.isNaN(d.getTime())) return String(v);
            return d.toLocaleString();
        },

        async copyTab() {
            try {
                await navigator.clipboard.writeText(this.tab);
                this.snack('Tab copied!');
            } catch {
                this.snack('Copy failed!');
            }
        },

        snack(text) {
            this.snackbar.text = text;
            this.snackbar.show = true;
        },

        async confirmDelete() {
            this.deleting = true;

            try {
                await SongsService.remove(this.songId);
                this.snack('Deleted.');
                this.$router.push('/songs');
            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to delete song."
            } finally {
                this.deleting = false;
                this.deleteDialog = false;
            }
        },

        normalizeDifficulty(v) {
            const s = String(v || "").toLowerCase().trim();
            return ["beginner", "intermediate", "advanced"].includes(s) ? s : "beginner";
        },

        difficultyLabel(v) {
            const d = this.normalizeDifficulty(v);
            return d === "beginner"
                ? "Beginner"
                : d === "intermediate"
                    ? "Intermediate"
                    : "Advanced";
        },

        difficultyColor(v) {
            const d = this.normalizeDifficulty(v);
            return d === "beginner"
                ? "success"
                : d === "intermediate"
                    ? "warning"
                    : "error";
        },

        async toggleFavorite() {
            try {
                const res = await SongsService.toggleFavorite(this.songId);
                this.song = res.data;
                this.snack(this.song.isFavorite ? ' Added to favorites!' : 'Removed from favorites');
            } catch (e) {
                this.error = e?.response?.data?.error || 'Could not toggle favorite.'
            }
        },

        async saveProgress() {
            this.savingProgress = true
            try {
                const form = new FormData()
                form.append("progress", String(this.progressLocal))
                const res = await SongsService.update(this.songId, form)
                this.song = res.data
                this.snack("Progress saved.")
            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to save progress."
            } finally {
                this.savingProgress = false
            }
        },

        async practiceNow() {
            this.practicing = true
            try {
                const res = await SongsService.practiceNow(this.songId, { bumpProgress: 0 })
                this.song = res.data
                this.progressLocal = Number(this.song?.progress ?? 0)
                this.snack("Logged practice!")
            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to log practice."
            } finally {
                this.practicing = false
            }
        },

    }
}
</script>

<style scoped>
.tab-box {
    background: rgba(255, 255, 255, 0.7);
    padding: 12px;
    border-radius: 12px;
    overflow: auto;
    max-height: 520px;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
        "Courier New", monospace;
}
</style>