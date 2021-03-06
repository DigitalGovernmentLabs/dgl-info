<template>
  <v-container>
    <v-sheet v-if="$fetchState.pending">Loading...</v-sheet>
    <v-sheet v-else-if="loadError"> エラー: {{ loadError }} </v-sheet>
    <div v-else>
      <div
        v-if="isAdmin && faqGroupList.length >= 10"
        style="max-width: 800px"
        class="mx-auto"
      >
        <admin-faq-group @create="refresh" />
      </div>
      <div v-if="!faqGroupList.length" class="text-center">
        まだ FAQ グループがありません。
      </div>
      <div v-else>
        <draggable
          v-model="faqGroupList"
          class="list-group"
          tag="div"
          handle=".handle"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          @update="onDragUpdate"
        >
          <v-card
            v-for="faqGroup in faqGroupList"
            :key="faqGroup.id"
            style="max-width: 800px"
            class="my-4 mx-auto"
            elevation="1"
            :loading="loading"
            :disabled="loading"
          >
            <v-card-title>{{ faqGroup.name }}</v-card-title>
            <v-card-text>
              <div class="text-caption">{{ faqGroup.faqNumber }}件</div>
              <div class="text-body-1">
                <easy-text :text="faqGroup.description" />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-tooltip v-if="isAdmin" bottom :disabled="drag">
                <template #activator="{ on, attrs }">
                  <v-icon
                    class="drag-icon handle mr-2"
                    color="orange"
                    v-bind="attrs"
                    v-on="on"
                    >mdi-drag</v-icon
                  >
                </template>
                <span>ドラッグ &amp; ドロップで並び替え</span>
              </v-tooltip>
              <v-btn
                v-if="isAdmin"
                color="success"
                large
                text
                @click="startUpdateFaqGroup(faqGroup)"
                >編集</v-btn
              >
              <div v-if="isAdmin">
                <v-btn
                  v-if="faqGroup.faqNumber === 0"
                  color="error"
                  large
                  text
                  @click="startDeleteFaqGroup(faqGroup)"
                  >削除</v-btn
                >
                <v-tooltip v-else bottom :disabled="drag">
                  <template #activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-btn color="error" large text disabled>削除</v-btn>
                    </div>
                  </template>
                  <span>FAQ が 0 件でないと削除できません。</span>
                </v-tooltip>
              </div>
              <v-spacer />
              <v-btn
                x-large
                color="info"
                outlined
                text
                nuxt
                :to="$pagesPath.faq._groupId(faqGroup.id).$url()"
                >開く</v-btn
              >
            </v-card-actions>
          </v-card>
        </draggable>
      </div>
      <div v-if="isAdmin" style="max-width: 800px" class="mx-auto">
        <admin-faq-group @create="refresh" />
      </div>
    </div>
    <input-faq-group
      v-if="targetFaqGroup"
      :key="'update-' + targetFaqGroup.id"
      v-model="editingFaqGroup"
      :target-faq-group-id="targetFaqGroup.id"
      @update="refresh"
    />
    <confirm-delete
      v-if="targetFaqGroup"
      :key="'delete-' + targetFaqGroup.id"
      v-model="deletingFaqGroup"
      :what="`FAQグループ ${targetFaqGroup.name}`"
      :loading="deleteLoading"
      :error="deleteResultError"
      @confirm="continueDeleteFaqGroup"
      @cancel="refresh"
    />
  </v-container>
</template>

<script lang="ts">
import assert from "assert";
import Vue from "vue";
import draggable from "vuedraggable";
import type { FaqGroupInfo } from "~/server/types/faq";
import type { UserInfo } from "~/server/types/user";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  components: {
    draggable,
  },
  data() {
    return {
      loadError: "",
      user: null as UserInfo | null,
      faqGroupList: [] as FaqGroupInfo[],
      editingFaqGroup: false,
      targetFaqGroup: null as FaqGroupInfo | null,
      // drag and drop
      drag: false,
      // patch
      patchSending: false,
      // delete
      deletingFaqGroup: false,
      deleteResultError: "",
      deleteLoading: false,
    };
  },
  async fetch() {
    await this.refetch();
  },
  computed: {
    isAdmin(): boolean {
      return this.user?.isAdmin === true;
    },
    dragOptions(): unknown {
      return {
        animation: 200,
        group: "description",
        disabled: this.user?.isAdmin !== true || this.patchSending,
        ghostClass: "ghost",
      };
    },
    loading(): boolean {
      return this.$fetchState.pending || this.patchSending;
    },
  },
  methods: {
    async refresh(): Promise<void> {
      this.editingFaqGroup = false;
      this.deletingFaqGroup = false;
      await this.refetch();
    },
    async refetch(): Promise<void> {
      this.loadError = "";
      try {
        [this.faqGroupList, this.user] = await Promise.all([
          this.$api.normal.faqGroup.$get(),
          this.$auth.refetch(),
        ]);
      } catch (e: unknown) {
        this.loadError = handleError(e);
      }
    },
    async onDragUpdate(): Promise<void> {
      this.patchSending = true;
      try {
        await this.$api.normal.faqGroup.$patch({
          body: {
            newIdOrder: this.faqGroupList.map((faqGroup) => faqGroup.id),
          },
        });
        this.refresh();
      } catch (e: unknown) {
        const err = `並び替えの通信中にエラーが発生しました: ${handleError(e)}`;
        this.$snackbar.open(err);
      } finally {
        this.patchSending = false;
      }
    },
    startUpdateFaqGroup(faqGroup: FaqGroupInfo): void {
      this.editingFaqGroup = true;
      this.targetFaqGroup = faqGroup;
    },
    startDeleteFaqGroup(faqGroup: FaqGroupInfo): void {
      this.deletingFaqGroup = true;
      this.targetFaqGroup = faqGroup;
    },
    async continueDeleteFaqGroup(): Promise<void> {
      this.deleteLoading = true;
      this.deleteResultError = "";
      try {
        assert(this.targetFaqGroup);
        await this.$api.normal.faqGroup
          ._faqGroupId(this.targetFaqGroup.id)
          .$delete();
      } catch (e: unknown) {
        this.deleteResultError = handleError(e);
      } finally {
        this.deleteLoading = false;
      }
    },
  },
});
</script>

<style>
.drag-icon {
  cursor: move;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
}

.list-group .item {
  cursor: move;
}
</style>
