<template>
    <v-container>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6 profile-header">
            <div>
                <h1 class="text-h5 font-weight-bold">Profile</h1>
                <p class="text-body-2 text-medium-emphasis">
                    Your account & quick stats.
                </p>
            </div>

            <div class="d-flex align-center" style="gap: 10px;">
                <v-btn variant="outlined" to="/songs" router>
                    <v-icon start>mdi-music</v-icon>
                    My songs
                </v-btn>

                <v-btn color="error" variant="outlined" @click="logout">
                    <v-icon start>mdi-logout</v-icon>
                    Logout
                </v-btn>
            </div>
        </div>

        <!-- Error -->
        <v-alert v-if="error" type="error" variant="outlined" class="mb-4" border="start">
            {{ error }}
        </v-alert>

        <v-row dense>
            <!-- Profile card -->
            <v-col cols="12" md="5">
                <v-card rounded="xl" class="pa-6">
                    <div class="d-flex align-center" style="gap: 14px;">
                        <v-avatar color="primary" variant="tonal" size="56">
                            <v-icon size="28">mdi-account</v-icon>
                        </v-avatar>

                        <div>
                            <div class="text-subtitle-1 font-weight-bold">
                                {{ displayName }}
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                                {{ email || "Unknown email" }}
                            </div>
                        </div>
                    </div>

                    <v-divider class="my-5" />

                    <div class="d-flex align-center justify-space-between">
                        <div class="text-subtitle-2 font-weight-bold">My songs</div>
                        <div class="text-body-2 text-medium-emphasis">
                            {{ songs.length }}
                        </div>
                    </div>

                    <v-divider class="my-3" />

                    <v-alert v-if="songs.length === 0" type="info" variant="outlined" border="start">
                        You don’t have any songs yet. Add your first one 🎸
                    </v-alert>

                    <v-list v-else class="bg-transparent" density="compact">
                        <v-list-item class="song-list-item mb-3 pa-2" v-for="s in songsForProfile" :key="s.id" :to="`/songs/${s.id}`" router>
                            <v-list-item-title class="font-weight-bold">
                                {{ s.title || "Untitled" }}
                            </v-list-item-title>
                           
                            <v-list-item-subtitle>
                                {{ s.artist || "Unknown artist" }} • {{ formatDate(s.createdAt) }}
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>

                    <div v-if="songs.length > limit" class="text-center mt-2">
                        <v-btn variant="text" to="/songs" router>View all</v-btn>
                    </div>
                </v-card>
            </v-col>

            <!-- Stats -->
            <v-col cols="12" md="7">
                <v-card rounded="xl" class="pa-6">
                    <div class="text-subtitle-1 font-weight-bold mb-4">Your stats</div>

                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-card rounded="lg" variant="outlined" class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-body-2 text-medium-emphasis">Songs</div>
                                        <div class="text-h6 font-weight-bold">{{ stats.total }}</div>
                                    </div>
                                    <v-icon size="28">mdi-playlist-music</v-icon>
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card rounded="lg" variant="outlined" class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-body-2 text-medium-emphasis">Favorites</div>
                                        <div class="text-h6 font-weight-bold">{{ stats.favorites }}</div>
                                    </div>
                                    <v-icon size="28">mdi-star</v-icon>
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card rounded="lg" variant="outlined" class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-body-2 text-medium-emphasis">In progress</div>
                                        <div class="text-h6 font-weight-bold">{{ stats.inProgress }}</div>
                                    </div>
                                    <v-icon size="28">mdi-progress-clock</v-icon>
                                </div>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-card rounded="lg" variant="outlined" class="pa-4">
                                <div class="d-flex align-center justify-space-between">
                                    <div>
                                        <div class="text-body-2 text-medium-emphasis">Practiced today</div>
                                        <div class="text-h6 font-weight-bold">{{ stats.practicedToday }}</div>
                                    </div>
                                    <v-icon size="28">mdi-calendar-check</v-icon>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider class="my-5" />

                    <div class="d-flex justify-end" style="gap: 10px;">
                        <v-btn variant="outlined" @click="refresh" :loading="loading">
                            <v-icon start>mdi-refresh</v-icon>
                            Refresh
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar.show" :timeout="2500">
            {{ snackbar.text }}
        </v-snackbar>
    </v-container>
</template>

<script>
import SongsService from "@/services/SongsService.js";
import { auth } from "@/store/auth";

export default {
    name: "ProfileView",

    data() {
        return {
            loading: false,
            error: null,
            snackbar: { show: false, text: "" },
            songs: [],
            limit: 8
        };
    },

    computed: {
        isLoggedIn() {
            return !!auth.token || !!localStorage.getItem("token");
        },
        user() {
            return auth.user || JSON.parse(localStorage.getItem("user") || "null") || {};
        },
        email() {
            return this.user?.email || "";
        },
        displayName() {
            // later you can add a real name field
            return this.user?.email ? this.user.email.split("@")[0] : "User";
        },

        stats() {
            const total = this.songs.length;
            const favorites = this.songs.filter((s) => !!s.isFavorite).length;
            const inProgress = this.songs.filter((s) => {
                const p = Number(s?.progress ?? 0);
                return p > 0 && p < 100;
            }).length;

            const practicedToday = this.songs.filter((s) => this.isToday(s?.lastPracticedAt)).length;

            return { total, favorites, inProgress, practicedToday };
        },

        songsForProfile() {
            const list = Array.isArray(this.songs) ? [...this.songs] : [];

            return list
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, this.limit);
        }
    },

    async created() {
        await this.refresh();
    },

    methods: {
        async refresh() {
            this.loading = true;
            this.error = null;

            try {
                const res = await SongsService.fetchAll();
                this.songs = Array.isArray(res.data) ? res.data : (res.data?.songs || []);
            } catch (e) {
                this.error = e?.response?.data?.error || "Failed to load profile stats.";
            } finally {
                this.loading = false;
            }
        },

        isToday(value) {
            if (!value) return false;
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return false;

            const now = new Date();
            return (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth() &&
                d.getDate() === now.getDate()
            );
        },

        snack(text) {
            this.snackbar.text = text;
            this.snackbar.show = true;
        },

        logout() {
            auth.clear?.();
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            this.snack("Logged out.");
            this.$router.push("/login");
        },

        formatDate(v) {
            const d = new Date(v);
            if (Number.isNaN(d.getTime())) return "—";
            return d.toLocaleDateString();
        },

    },
};
</script>

<style>
    .song-list-item {
        flex-direction: column;
        align-items: flex-start;
    }

    @media screen and (max-width: 560px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
        }

        .profile-header div:first-child {
            margin-bottom: 15px;
        }
    }
</style>