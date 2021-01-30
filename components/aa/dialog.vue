<template>
  <v-dialog :value="open" max-width="400px">
    <v-card>
      <v-card-title> hhh </v-card-title>
      <v-card-text> body </v-card-text>
      <v-card-actions> nnuts </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
}
</script>