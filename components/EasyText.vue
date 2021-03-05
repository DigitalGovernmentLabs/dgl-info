<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <pre class="text" v-html="textDisplay" />
</template>

<script lang="ts">
import Vue from "vue";
import Autolinker from "autolinker";

export default Vue.extend({
  props: {
    text: { type: String, default: null },
  },
  computed: {
    textDisplay(): string {
      return Autolinker.link(this.text ?? "", { sanitizeHtml: true });
    },
  },
});
</script>

<style>
.text {
  white-space: pre-wrap;
}
</style>
