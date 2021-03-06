<template>
  <div>
    <v-dialog :value="value" width="800" @input="$emit('input')">
      <v-card elevation="1">
        <v-card-text>
          <div class="text-body-1 d-flex">
            <div class="text">
              <v-subheader>質問</v-subheader>
              <easy-text :text="faq.question" />
            </div>
            <v-divider class="mx-2" vertical />
            <div class="text">
              <v-subheader>回答</v-subheader>
              <easy-text class="text" :text="faq.answer" />
            </div>
          </div>
        </v-card-text>
        <v-card-actions v-if="isAdmin">
          <v-btn color="success" large text @click="startUpdateFaq()"
            >編集</v-btn
          >
          <v-btn color="error" large text @click="startDeleteFaq()">削除</v-btn>
          <v-spacer />
        </v-card-actions>
        <v-divider class="mb-2" />
        <v-card-text>
          <keyword-list
            v-model="newKeyword"
            :list="faq.keywords"
            :is-admin="isAdmin"
            @add="(keyword) => addKeyword(faq)"
            @delete="(keyword) => deleteKeyword(faq, keyword)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <input-faq
      v-model="editing"
      :group-id="faq.groupId"
      :target-faq-id="faq.id"
      @update="$emit('update')"
    />
    <confirm-delete
      v-model="deleting"
      :what="`FAQ (id = ${faq.id})`"
      :loading="deleteLoading"
      :error="deleteResultError"
      @confirm="continueDeleteFaq"
      @cancel="$emit('cancel:delete')"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import type { FaqInfo } from "~/server/types/faq";
import { handleError } from "~/utils/axios";

export default Vue.extend({
  props: {
    value: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    faq: { type: Object as () => FaqInfo, required: true },
  },
  data() {
    return {
      editing: false,
      sending: false,
      // delete
      deleting: false,
      deleteResultError: "",
      deleteLoading: false,
      // show faq details
      showingFaqDetails: false,
      // form input
      newKeyword: "",
    };
  },
  methods: {
    startUpdateFaq(): void {
      this.editing = true;
    },
    startDeleteFaq(): void {
      this.deleting = true;
    },
    async continueDeleteFaq(): Promise<void> {
      this.deleteLoading = true;
      this.deleteResultError = "";
      try {
        const { id } = this.faq;
        await this.$api.normal.faq._faqId(id).$delete();
        this.$emit("delete", this.faq);
      } catch (e: unknown) {
        this.deleteResultError = handleError(e);
      } finally {
        this.deleteLoading = false;
      }
    },
    async addKeyword(to: FaqInfo): Promise<void> {
      this.sending = true;
      try {
        to.keywords = (
          await this.$api.normal.faq._faqId(to.id).keyword.$post({
            body: { keyword: this.newKeyword },
          })
        ).keywords;
        this.$snackbar.open("キーワードを追加しました");
        this.newKeyword = "";
      } catch (e: unknown) {
        this.$snackbar.open(`キーワードの追加中にエラー: ${handleError(e)}`);
      } finally {
        this.sending = false;
      }
    },
    async deleteKeyword(from: FaqInfo, keyword: string): Promise<void> {
      this.sending = true;
      try {
        from.keywords = (
          await this.$api.normal.faq
            ._faqId(from.id)
            .keyword.$delete({ body: { keyword } })
        ).keywords;
        this.$snackbar.open("キーワードを削除しました");
      } catch (e: unknown) {
        this.$snackbar.open(`キーワードの削除中にエラー: ${handleError(e)}`);
        this.sending = false;
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
