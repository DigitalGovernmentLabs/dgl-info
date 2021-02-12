<template>
  <div class="container"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { LinkList, Link } from "~/server/types";

export default Vue.extend({
  data() {
    return {
      linkLists: [] as LinkList[],
      newTitle: "",
    };
  },
  async fetch() {
    await this.fetchLinkLists();
  },
  methods: {
    async fetchLinkLists() {
      this.linkLists = await this.$api.normal.linkLists.$get();
    },
    async addListTitle() {
      if (!this.newTitle) return;

      await this.$api.normal.linkLists.post({
        body: { listTitle: this.newTitle },
      });
      this.newTitle = "";
      await this.fetchLinkLists();
    },
    async deleteLink(link: Link) {
      await this.$api.normal.links._linkId(link.linkId).delete();
      await this.fetchLinkLists();
    },
  },
});
</script>
