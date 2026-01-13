
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
  </v-container>
</template>
