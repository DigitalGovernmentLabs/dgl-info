<template>
  <div class="container">
    <user-banner />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LinkList, Link } from '~/server/types'

export default Vue.extend({
  async fetch() {
    await this.fetchLinkLists()
  },
  data() {
    return {
      linkLists: [] as LinkList[],
      newTitle: ''
    }
  },
  methods: {
    async fetchLinkLists() {
      this.linkLists = await this.$api.linkLists.$get()
    },
    async addListTitle() {
      if (!this.newTitle) return

      await this.$api.linkLists.post({ body: { listTitle: this.newTitle } })
      this.newTitle = ''
      await this.fetchLinkLists()
    },
    async deleteLink(link: Link) {
      await this.$api.links._linkId(link.linkId).delete()
      await this.fetchLinkLists()
    }
  }
})
</script>
