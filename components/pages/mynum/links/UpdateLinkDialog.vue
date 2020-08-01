<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">変更</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">外部リンク</span>
      </v-card-title>
      <v-card-text> リスト名：{{ linkList.listTitle }} </v-card-text>
      <v-card-text>
        <v-row>
          <v-label></v-label>
          <v-col cols="12">
            <v-text-field
              v-model="updatedLink.name"
              label="リンク名 *"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="updatedLink.url" label="URL *" required />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="updatedLink.description" label="説明" />
          </v-col>
          <small>*必須入力項目</small>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click=";(dialog = false), updateLink()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { LinkList, Link } from '~/server/types'

export default Vue.extend({
  props: {
    linkList: {
      type: Object,
      required: true
    } as PropOptions<LinkList>,
    link: {
      type: Object,
      required: true
    } as PropOptions<Link>
  },
  data() {
    return {
      dialog: false,
      updatedLink: {
        linkId: this.link.linkId,
        linkOrder: this.link.linkOrder,
        url: this.link.url,
        name: this.link.name,
        description: this.link.description
      } as Link
    }
  },
  methods: {
    async updateLink() {
      await this.$api.links
        ._linkListId(this.linkList.listId)
        .patch({ body: this.updatedLink })
      this.$emit('refetch')
    }
  }
})
</script>
