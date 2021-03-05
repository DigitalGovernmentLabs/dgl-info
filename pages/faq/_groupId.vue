<template>
  <v-container class="container">
    <v-sheet v-if="loading">Loading...</v-sheet>
    <v-sheet v-else-if="loadError"> エラー: {{ loadError }} </v-sheet>
    <div v-else class="wrapper">
      <div v-if="!faqList.length" class="text-center">
        まだ FAQ がありません。
      </div>
      <div v-else class="virtual-scroll">
        <v-virtual-scroll :items="faqList" :bench="3" item-height="60">
          <template #default="{ item }">
            <v-sheet class="faq-quick">
              <p class="quick-text">Q. {{ item.question }}</p>
              <v-divider class="mx-2" vertical />
              <p class="quick-text">A. {{ item.answer }}</p>
              <div>
                <v-btn text @click="showFaqDetails(item)">詳細</v-btn>
              </div>
            </v-sheet>
          </template>
        </v-virtual-scroll>
      </div>
      <div v-if="isAdmin" class="mx-auto my-2">
        <admin-faq :faq-group-id="faqGroupId" @create="onCreate" />
      </div>
    </div>
    <faq
      v-if="targetFaq"
      :key="targetFaq.id"
      v-model="showingFaqDetails"
      :faq="targetFaq"
      :is-admin="isAdmin"
      @update="onUpdate"
    />
  </v-container>
</template>

<script lang="ts">
import assert from "assert";
import Vue from "vue";
import type { UserInfo } from "~/server/types/user";
import { handleError } from "~/utils/axios";
import type { FaqInfo } from "~/server/types/faq";

export default Vue.extend({
  data() {
    return {
      loadError: "",
      user: null as UserInfo | null,
      faqList: [] as FaqInfo[],
      editingFaq: false,
      targetFaq: null as FaqInfo | null,
      sending: false,
      // delete
      deletingFaq: false,
      deleteResultError: "",
      deleteLoading: false,
      // show faq details
      showingFaqDetails: false,
    };
  },
  async fetch() {
    this.loadError = "";
    try {
      await this.refetch();
    } catch (e: unknown) {
      this.loadError = handleError(e);
    }
  },
  computed: {
    isAdmin(): boolean {
      return this.user?.isAdmin === true;
    },
    loading(): boolean {
      return this.$fetchState.pending || this.sending;
    },
    faqGroupId(): number {
      return +this.$route.params.groupId;
    },
  },
  methods: {
    async refresh(): Promise<void> {
      this.editingFaq = false;
      this.deletingFaq = false;
      this.showingFaqDetails = false;
      await this.refetch();
    },
    async refetch(): Promise<void> {
      [{ faqList: this.faqList }, this.user] = await Promise.all([
        this.$api.normal.faq.$get({
          query: {
            groupId: +this.$route.params.groupId,
          },
        }),
        this.$auth.refetch(),
      ]);
    },
    onCreate(faq: FaqInfo): void {
      this.$snackbar.open("FAQ を作成しました");
      this.refresh();
      this.faqList = [faq, ...this.faqList];
    },
    onDelete(faq: FaqInfo): void {
      this.faqList = [...this.faqList.filter((e) => e.id !== faq.id)];
    },
    async onUpdate(): Promise<void> {
      this.$snackbar.open("FAQ を更新しました");
      assert(this.targetFaq);
      const { id } = this.targetFaq;
      const target = this.faqList.find((el) => el.id === id);
      if (!target) return;
      const updateIdx = this.faqList.indexOf(target);
      this.faqList[updateIdx] = await this.$api.normal.faq._faqId(id).$get();
      this.refresh();
    },
    showFaqDetails(faq: FaqInfo): void {
      this.targetFaq = faq;
      this.showingFaqDetails = true;
    },
  },
});
</script>

<style>
.text {
  overflow-x: hidden;
  flex: 1 0;
}
.virtual-scroll {
  flex: 1 1 auto;
  height: 300px;
}
.faq-quick {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.quick-text {
  --lh: 1rem;
  --max-lines: 3;

  position: relative;
  line-height: var(--lh);
  max-height: calc(var(--lh) * var(--max-lines));
  padding-right: 1rem;
  overflow: hidden;
  font-size: 0.8em;
  margin: 0 !important;
  flex: 1 1;
}

.quick-text::before {
  position: absolute;
  content: "...";
  bottom: 0;
  right: 0;
}

.quick-text::after {
  position: absolute;
  content: "";
  right: 0;
  width: 1rem;
  height: 1rem;
  background: white;
}
.container {
  height: 100%;
}
.wrapper {
  display: flex;
  height: 100%;
  flex-flow: column;
}
</style>
