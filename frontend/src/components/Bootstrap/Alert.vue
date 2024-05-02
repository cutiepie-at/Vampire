<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

export type AlertType =
    'alert-primary'
    | 'alert-secondary'
    | 'alert-success'
    | 'alert-danger'
    | 'alert-warning'
    | 'alert-light'
    | 'alert-dark';
@Options({
  name: 'Alert',
})
export default class Alert extends Vue {
  @Prop({default: null})
  readonly type: AlertType | null = 'alert-primary';
}
</script>

<template>
  <div class="alert" :class="[type]" role="alert">
    <slot/>
  </div>
</template>
