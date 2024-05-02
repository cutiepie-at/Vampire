<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'CenterOnParent',
  components: {},
})
export default class CenterOnParent extends Vue {
}
</script>

<template>
  <div class="w-100 h-100 d-flex justify-content-center">
    <div class="align-self-center">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
