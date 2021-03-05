<template>
  <v-chip
    :color="color"
    :close="close"
    nuxt
    to="/"
    @click:close="$emit('delete')"
  >
    {{ keyword }}
  </v-chip>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    keyword: { type: String, required: true },
    close: { type: Boolean, default: false },
  },
  computed: {
    color(): string | undefined {
      if (this.keyword.startsWith("###")) return undefined;
      if (this.keyword.startsWith("##")) return "secondary";
      if (this.keyword.startsWith("#")) return "primary";
      return undefined;
    },
  },
});
</script>
