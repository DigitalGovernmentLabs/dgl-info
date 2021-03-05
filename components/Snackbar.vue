<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}

    <template #action="{ attrs }">
      <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      snackbar: false,
      snackbarText: "",
    };
  },
  mounted() {
    this.$snackbar.addHandler((text) => this.openSnackbar(text));
  },
  methods: {
    openSnackbar(text: string): void {
      this.snackbarText = text;
      this.snackbar = true;
    },
  },
});
</script>
