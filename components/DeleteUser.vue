<template>
  <v-card :loading="isLoadnig()" :disabled="isLoadnig()">
    <v-form @submit.prevent="submit">
      <v-card-title
        >本当にユーザ {{ userName }} (id: {{ targetUserId }})
        を削除しますか？</v-card-title
      >
      <v-divider />
      <v-card-text>
        削除する場合は、<i>{{ getConfirmGoal() }}</i> と入力してください。
        <v-text-field v-model="confirm" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('cancel')">キャンセル</v-btn>
        <v-btn color="error" type="submit" :disabled="isDisabled()"
          >削除する</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  name: "DeleteUser",
  props: {
    targetUserId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      sending: false,
      userName: "",
      resultError: "",
      disaled: false,
      confirm: "",
    };
  },
  async fetch() {
    const user = await this.$api.admin.users
      ._userId(this.targetUserId)
      .$get({});
    this.userName = user.name;
  },
  methods: {
    isDisabled() {
      return this.confirm !== this.getConfirmGoal();
    },
    getConfirmGoal() {
      return `delete ${this.userName}`;
    },
    isLoadnig() {
      return this.$fetchState.pending || this.sending;
    },
    async submit() {
      await this.deleteUser();
    },
    async deleteUser() {
      this.resultError = "";
      this.sending = true;
      try {
        const user = await this.$api.admin.users
          ._userId(this.targetUserId)
          .$delete({
            body: {
              userId: this.targetUserId,
            },
          });
        this.$emit("delete", user);
      } catch (e: unknown) {
        this.resultError = handleError(e);
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
