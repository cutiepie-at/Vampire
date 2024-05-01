<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'NavBar',
})
export default class NavBar extends Vue {
}
</script>

<template>
  <nav class="navbar border-bottom shadow">
    <div>
      <slot name="left"/>
    </div>
    <div class="mx-auto">
      <slot name="center"/>
    </div>
    <div>
      <slot name="right"/>
    </div>
  </nav>
</template>
