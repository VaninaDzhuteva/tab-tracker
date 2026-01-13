<template>
  <TabTracker />
</template>

<script>
import { defineComponent } from 'vue';

// Components
 import TabTracker from '@/components/TabTracker.vue'

export default defineComponent({
  name: 'HomeView',

  components: {
    TabTracker,
  },
});
</script>
