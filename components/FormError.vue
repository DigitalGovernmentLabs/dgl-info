<template>
  <div class="text-caption text-right font-weight-light red--text">
    {{ message }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { message: { type: String, default: null } },
});
</script>
