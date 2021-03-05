<template>
  <v-container class="py-12">
    <v-sheet v-if="loadError"> エラー: {{ loadError }} </v-sheet>
    <div v-else>
      <div v-if="!users.length">ユーザが作成されていません。</div>
      <v-row>
        <v-spacer />
        <v-btn @click="startCreateUser">新しいユーザを作成</v-btn>
        <v-spacer />
      </v-row>
      <v-row v-for="user in users" :key="'user-' + user.id">
        <v-col>
          <v-card
            :loading="$fetchState.pending"
            :disabled="$fetchState.pending"
          >
            <v-card-title>
              {{ user.name }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-text-field
                    label="ID (内部管理用)"
                    :value="user.id"
                    readonly
                  />
                  <v-text-field
                    label="ユーザネーム (ログイン用)"
                    :value="user.name"
                    readonly
                  />
                  <v-checkbox
                    label="管理者権限"
                    value="user.isAdmin"
                    readonly
                  />
                </v-col>
              </v-row>
              <v-card-actions>
                <v-btn text color="success" @click="startUpdateUser(user)"
                  >編集</v-btn
                >
                <v-btn text color="error" @click="startDeleteUser(user)"
                  >削除</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="users.length >= 4">
        <v-spacer />
        <v-btn @click="startCreateUser">新しいユーザを作成</v-btn>
        <v-spacer />
      </v-row>
      <input-user
        :key="'user-input-' + (targetUser ? targetUser.id : 'new')"
        v-model="editingUser"
        :target-user-id="targetUser && targetUser.id"
        @create="
          $snackbar.open('ユーザを作成しました');
          refresh();
        "
        @update="
          $snackbar.open('ユーザ情報を更新しました');
          refetch();
        "
        @updatePassword="
          $snackbar.open('ユーザパスワードを更新しました');
          refetch();
        "
      />
    </div>
    <confirm-delete
      v-if="targetUser"
      :key="'delete' + targetUser.id"
      v-model="deletingUser"
      :what="`ユーザ ${targetUser.name} (id: ${targetUser.id})`"
      :loading="deleteLoading"
      :error="deleteResultError"
      :challenge-text="targetUser.name"
      @confirm="continueDeleteUser"
      @cancel="refresh"
    />
  </v-container>
</template>

<script lang="ts">
import assert from "assert";
import Vue from "vue";
import type { UserInfo } from "$/types/user";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  data() {
    return {
      loadError: "",
      users: [] as UserInfo[],
      // operate user
      targetUser: null as null | UserInfo,
      // edit user
      editingUser: false,
      // delete user
      deletingUser: false,
      deleteResultError: "",
      deleteLoading: false,
    };
  },
  async fetch() {
    await this.refetch();
  },
  methods: {
    async refresh(): Promise<void> {
      this.editingUser = false;
      this.deletingUser = false;
      await this.refetch();
    },
    startCreateUser(): void {
      this.targetUser = null;
      this.editingUser = true;
    },
    startUpdateUser(user: UserInfo): void {
      this.targetUser = user;
      this.editingUser = true;
    },
    startDeleteUser(user: UserInfo): void {
      this.targetUser = user;
      this.deletingUser = true;
    },
    async continueDeleteUser(): Promise<void> {
      this.deleteResultError = "";
      this.deleteLoading = true;
      try {
        assert(this.targetUser);
        await this.$api.admin.user._userId(this.targetUser.id).$delete({
          body: {
            userId: this.targetUser.id,
          },
        });
        this.$snackbar.open("ユーザを削除しました");
        await this.refresh();
      } catch (e: unknown) {
        this.deleteResultError = handleError(e);
      } finally {
        this.deleteLoading = false;
      }
    },
    async refetch(): Promise<void> {
      this.loadError = "";
      try {
        this.users = await this.$api.admin.user.$get();
      } catch (e: unknown) {
        this.loadError = handleError(e);
      }
    },
  },
});
</script>
