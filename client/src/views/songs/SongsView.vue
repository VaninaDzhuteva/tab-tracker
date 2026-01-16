<template>
  <v-container>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">All Songs</h1>
        <p class="text-body-2 text-medium-emphasis">
          Browse everything returned from <code>/songs</code>.
        </p>
      </div>

      <v-btn color="primary" @click="refresh" :loading="loading">
        <v-icon start>mdi-refresh</v-icon>
        Refresh
      </v-btn>
    </div>

    <!-- Controls -->
    <v-row class="mb-2" dense>
      <v-col cols="12" md="7">
        <v-text-field v-model="search" label="Search" placeholder="Search by any text..."
          prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" clearable />
      </v-col>

      <v-col cols="12" md="5">
        <v-select v-model="sortMode" :items="sortOptions" item-value="value" label="Sort"
          prepend-inner-icon="mdi-sort" variant="outlined" density="comfortable" />
      </v-col>
    </v-row>

    <!-- Errors -->
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4" border="start">
      {{ error }}
    </v-alert>

    <!-- Loading state -->
    <v-card v-if="loading" class="pa-6" rounded="xl">
      <div class="text-medium-emphasis">Loading songs…</div>
      <v-progress-linear indeterminate class="mt-3" />
    </v-card>

    <!-- Empty state -->
    <v-card v-else-if="filteredSongs.length === 0" class="pa-10 text-center" rounded="xl" elevation="2">
      <v-icon size="48" color="primary">mdi-playlist-music</v-icon>
      <h2 class="text-h6 font-weight-bold mt-3">No songs found</h2>
      <p class="text-body-2 text-medium-emphasis mt-1">
        Either your database is empty or your search filters everything out.
      </p>
    </v-card>

    <!-- List -->
    <v-card v-else rounded="xl">
      <v-list lines="two" class="bg-transparent">
        <template v-for="song in filteredSongs" :key="getId(song)">
          <!-- ROW -->
          <v-list-item class="px-3 rounded-lg">
            <div class="d-flex align-center justify-space-between w-100">
              <!-- LEFT: icon + text -->
              <div class="d-flex align-center">
                <v-avatar color="primary" variant="tonal" class="mr-4">
                  <v-icon>mdi-music</v-icon>
                </v-avatar>

                <div class="px-2">
                  <v-list-item-title class="font-weight-bold mb-1">
                    {{ getTitle(song) }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ getSubtitle(song) }}
                  </v-list-item-subtitle>
                </div>
              </div>

              <!-- RIGHT: actions -->
              <div class="d-flex align-center pl-4" style="gap: 12px;">
                <v-btn icon variant="text" :title="expandedId === getId(song) ? 'Hide tab' : 'Show tab'"
                  @click.stop="toggleExpand(song)">
                  <v-icon>
                    {{ expandedId === getId(song) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>

                <v-btn icon variant="text" color="error" title="Delete" :loading="deletingId === getId(song)"
                  @click.stop="askDelete(song)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </v-list-item>

          <v-expand-transition>
            <div v-if="expandedId === getId(song)" class="mx-4 mb-4 mt-2 pa-4 rounded-lg"
              style="background: rgba(0,0,0,0.04);">
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="text-subtitle-2 font-weight-bold">Tab</div>

                <v-btn v-if="getTab(song)" size="small" variant="outlined" @click="copyTab(song)">
                  <v-icon start size="18">mdi-content-copy</v-icon>
                  Copy
                </v-btn>
              </div>

              <v-alert v-if="!getTab(song)" type="info" variant="tonal" border="start">
                No tab content available for this song yet.
              </v-alert>

              <pre v-else class="tab-box">{{ getTab(song) }}</pre>
            </div>
          </v-expand-transition>

        </template>
      </v-list>
    </v-card>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="deleteDialog" max-width="520">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold">
          Delete song?
        </v-card-title>
        <v-card-text>
          This will permanently delete:
          <div class="mt-2 font-weight-bold">
            {{ pendingDelete ? getTitle(pendingDelete) : '' }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false" :disabled="!!deletingId">
            Cancel
          </v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="!!deletingId">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import SongsService from "@/services/SongsService.js";

export default {
  name: "SongsView",

  data() {
    return {
      songs: [],
      loading: false,
      error: null,

      search: "",
      sortMode: "newest",
      sortOptions: [
        { title: "Newest first (createdAt)", value: "newest" },
        { title: "Oldest first (createdAt)", value: "oldest" },
        { title: "Title A → Z (best guess)", value: "title_asc" },
        { title: "Title Z → A (best guess)", value: "title_desc" },
      ],

      expandedId: null,

      deleteDialog: false,
      pendingDelete: null,
      deletingId: null,

      snackbar: { show: false, text: "" },
    };
  },

  computed: {
    filteredSongs() {
      const q = this.search.trim().toLowerCase();

      let list = this.songs.filter((song) => {
        if (!q) return true;
        try {
          return JSON.stringify(song).toLowerCase().includes(q);
        } catch {
          return false;
        }
      });

      const byTitle = (a, b) => this.getTitle(a).localeCompare(this.getTitle(b));

      const getCreated = (s) => {
        const v = s?.createdAt || s?.created_at || s?.created || s?.date;
        const t = v ? new Date(v).getTime() : 0;
        return Number.isFinite(t) ? t : 0;
      };

      if (this.sortMode === "newest") {
        list = [...list].sort((a, b) => getCreated(b) - getCreated(a));
      } else if (this.sortMode === "oldest") {
        list = [...list].sort((a, b) => getCreated(a) - getCreated(b));
      } else if (this.sortMode === "title_asc") {
        list = [...list].sort(byTitle);
      } else if (this.sortMode === "title_desc") {
        list = [...list].sort((a, b) => byTitle(b, a));
      }

      return list;
    },
  },

  async created() {
    await this.refresh();
  },

  methods: {
    async refresh() {
      this.error = null;
      this.loading = true;

      try {
        const res = await SongsService.fetchAll();
        this.songs = Array.isArray(res.data) ? res.data : res.data?.songs || [];
      } catch (e) {
        this.error = e?.response?.data?.error || "Failed to load songs.";
      } finally {
        this.loading = false;
      }
    },

    toggleExpand(song) {
      const id = this.getId(song);
      this.expandedId = this.expandedId === id ? null : id;
    },

    getId(song) {
      return song?.id ?? song?._id ?? song?.uuid ?? this.safeHash(song);
    },

    safeHash(obj) {
      try {
        return "tmp_" + btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 12);
      } catch {
        return "tmp_" + Math.random().toString(16).slice(2);
      }
    },

    getTitle(song) {
      const candidates = [
        song?.title,
        song?.name,
        song?.songTitle,
        song?.song,
        song?.track,
      ].filter(Boolean);

      if (candidates.length) return String(candidates[0]);

      const firstString = this.firstStringField(song);
      if (firstString) return firstString;

      return "Untitled song";
    },

    getSubtitle(song) {
      const artist = song?.artist || song?.band || song?.author || song?.composer || null;
      const created = song?.createdAt || song?.created_at || song?.created || song?.date || null;

      const bits = [];
      if (artist) bits.push(`Artist: ${artist}`);
      if (created) bits.push(`Created: ${this.formatDate(created)}`);

      if (!bits.length) bits.push("No extra info");

      return bits.join(" • ");
    },

    formatDate(v) {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return String(v);
      return d.toLocaleString();
    },

    firstStringField(obj) {
      if (!obj || typeof obj !== "object") return null;
      for (const key of Object.keys(obj)) {
        const v = obj[key];
        if (typeof v === "string" && v.trim().length) return v.trim();
      }
      return null;
    },

    // ✅ TAB ONLY (no JSON)
    getTab(song) {
      return (
        song?.tab ||
        song?.tabs ||
        song?.content ||
        song?.notes ||
        song?.lyrics ||
        ""
      );
    },

    async copyTab(song) {
      try {
        await navigator.clipboard.writeText(this.getTab(song));
        this.snack("Tab copied!");
      } catch {
        this.snack("Copy failed.");
      }
    },

    askDelete(song) {
      this.pendingDelete = song;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      if (!this.pendingDelete) return;

      const id = this.getId(this.pendingDelete);
      this.deletingId = id;

      try {
        await SongsService.remove(id);
        this.songs = this.songs.filter((s) => this.getId(s) !== id);
        if (this.expandedId === id) this.expandedId = null;
        this.snack("Deleted.");
      } catch (e) {
        this.error = e?.response?.data?.error || "Failed to delete song.";
      } finally {
        this.deletingId = null;
        this.deleteDialog = false;
        this.pendingDelete = null;
      }
    },

    snack(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
code {
  font-size: 0.9em;
}

.tab-box {
  background: rgba(255, 255, 255, 0.7);
  padding: 12px;
  border-radius: 12px;
  overflow: auto;
  max-height: 360px;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
}
</style>
