<template>
  <v-dialog :value="open" :max-width="max_width" @click:outside="toggle">
    <v-card>
      <v-card-title style="border-bottom: 3px solid #277cbe" class="pt-3 pb-1">
        {{ dialogName }}
      </v-card-title>
      <slot></slot>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text height="30px" v-if="CRUD" class="primary" @click="actionsUser">
          <div class="font_size">Lưu</div>
        </v-btn>
        <v-btn text height="30px" class="secondary" @click="toggle">
          <div class="font_size">Đóng</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'Dialog',
    props: ['dialogName', 'open', 'CRUD', 'max_width'],
    methods: {
      toggle() {
        this.$emit('toggle')
      },
      actionsUser() {
        this.$emit('actionsUser')
      }
    }
  }
</script>

<style scoped>
  .font_size {
    font-size: 90%;
  }
</style>
