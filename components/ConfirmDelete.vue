<template>
  <v-dialog :value="value" width="500" @input="(v) => $emit('input', v)">
    <v-card :loading="loading" :disabled="loading">
      <v-form @submit.prevent="submit">
        <v-card-title>本当に {{ what }} を削除しますか？</v-card-title>
        <v-divider />
        <v-card-text>
          削除する場合は、<i>{{ fullChallengeText }}</i> と入力してください。
          <form-error :message="error" />
          <v-text-field v-model="confirm" autocomplete="off" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="
              $emit('input', false);
              $emit('cancel');
            "
            >キャンセル</v-btn
          >
          <v-btn color="error" type="submit" :disabled="disabled"
            >削除する</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DeleteUser",
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    what: {
      type: String,
      required: true,
      default: "",
    },
    error: {
      type: String,
      required: true,
      default: "",
    },
    loading: {
      type: Boolean,
      default: null,
    },
    challengeText: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // フォーム入力
      confirm: "",
    };
  },
  computed: {
    fullChallengeText(): string {
      return this.challengeText ? `delete ${this.challengeText}` : "delete";
    },
    disabled(): boolean {
      return this.fullChallengeText !== this.confirm;
    },
  },
  watch: {
    value(): void {
      this.confirm = "";
    },
  },
  methods: {
    submit(): void {
      this.$emit("confirm");
    },
  },
});
</script>
