<template>
  <v-container>
    <v-sheet v-if="$fetchState.error"> 権限がありません。 </v-sheet>
    <div v-else>
      <div v-if="!users.length">ユーザが作成されていません。</div>
      <v-row>
        <v-spacer />
        <v-btn color="primary" @click="startCreateUser"
          >新しいユーザを作成</v-btn
        >
      </v-row>
      <v-row v-for="user in users" :key="user.id">
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
                <v-spacer />
                <v-btn @click="startUpdateUser(user.id)">編集</v-btn>
                <v-btn color="error" @click="startDeleteUser(user.id)"
                  >削除</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-btn color="primary" @click="startCreateUser"
          >新しいユーザを作成</v-btn
        >
      </v-row>
      <v-dialog v-model="editingUser" width="500">
        <input-user
          :key="targetUserId"
          :target-user-id="targetUserId"
          @create="refresh"
          @update="refetch"
        ></input-user>
      </v-dialog>
      <v-dialog v-model="deletingUser" width="500">
        <delete-user
          :key="targetUserId"
          :target-user-id="targetUserId"
          @cancel="refresh"
          @delete="refresh"
        ></delete-user>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import type { UserInfo } from "$/types/user";

export default Vue.extend({
  data() {
    return {
      users: [{ name: "", id: 0, isAdmin: false }] as UserInfo[],
      editingUser: false,
      deletingUser: false,
      targetUserId: null as null | number,
    };
  },
  async fetch() {
    await this.refetch();
  },
  methods: {
    async refresh() {
      this.editingUser = false;
      this.deletingUser = false;
      await this.refetch();
    },
    startCreateUser() {
      this.targetUserId = null;
      this.editingUser = true;
    },
    startUpdateUser(id: UserInfo["id"]) {
      this.targetUserId = id;
      this.editingUser = true;
    },
    startDeleteUser(id: UserInfo["id"]) {
      this.targetUserId = id;
      this.deletingUser = true;
    },
    async refetch() {
      this.users = await this.$api.admin.users.$get();
    },
  },
});
</script>
