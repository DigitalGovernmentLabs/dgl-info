<template>
  <div class="container">
    <user-banner />
    <div v-if="!$fetchState.pending">
      <v-row v-for="linkList in linkLists" :key="linkList.listOrder">
        <v-col cols="12">
          <h2>
            {{ linkList.listTitle }}
          </h2>
        </v-col>
        <v-col v-for="link in linkList.links" :key="link.linkOrder" cols="6">
          <v-card class="mx-auto" max-width="500" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  {{ link.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <a
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ link.url }}</a
                  >
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ link.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-card-actions>
              <!-- <v-btn text>変更</v-btn> -->
              <update-link-dialog
                :link-list="linkList"
                :link="link"
                @refetch="fetchLinkLists()"
              />
              <v-btn text @click="deleteLink(link.linkId)">削除</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- ここに書く -->
        <add-link-dialog :link-list="linkList" @refetch="fetchLinkLists()" />
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="newTitle"
            :counter="100"
            label="リストタイトル"
            required
            filled
            @keyup.enter="addListTitle()"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LinkList } from '~/server/types'

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
    async deleteLink(linkId: number) {
      await this.$api.links._linkId(linkId).delete()
      await this.fetchLinkLists()
    }
  }
})
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.tasks {
  width: 300px;
  padding: 0;
  margin: 20px auto 0;
  list-style-type: none;
  text-align: left;
}

.tasks > li {
  margin-top: 10px;
  border-bottom: 1px solid #eee;
}
</style>
