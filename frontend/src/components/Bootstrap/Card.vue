<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  name: 'Card',
  components: {},
})
export default class Card extends Vue {
}
</script>

<template>
  <div class="card" :class="$attrs['class']">
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot name="body">
        <h5 class="card-title" v-if="$slots['body-title']">
          <slot name="body-title"></slot>
        </h5>
        <slot></slot>
      </slot>
    </div>
  </div>
  <div class="card-footer" v-if="$slots.footer">
    <slot name="footer"></slot>
  </div>
</template>
