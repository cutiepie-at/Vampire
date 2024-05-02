<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import BootstrapModal from './BootstrapModal.vue';

@Options({
  name: 'ConfirmModal',
  components: {BootstrapModal},
  emits: {
    'confirm': () => undefined,
  },
})
export default class ConfirmModal extends Vue {
  //props
  @Prop({default: true})
  readonly closeOnOutsideClick!: boolean;
  @Prop({default: true})
  readonly closeOnKeyboardEsc!: boolean;
  @Prop({default: false})
  readonly scrollable!: boolean;
  @Prop({default: false})
  readonly centerVertically!: boolean;
  @Prop({default: undefined})
  readonly size!: 'sm' | 'lg' | 'xl' | null | undefined;
  @Prop({default: 'btn-primary'})
  readonly confirmButtonClass!: string;

  //public functions
  open(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).dismiss();
  }
}
</script>

<template>
  <BootstrapModal ref="modal" :centerVertically="centerVertically"
                  :closeOnKeyboardEsc="closeOnKeyboardEsc"
                  :closeOnOutsideClick="closeOnOutsideClick"
                  :scrollable="scrollable"
                  :size="size">
    <template #modal-header>
      <slot name="modal-header">
        <h5 class="modal-title">
          <slot name="modal-title">
            {{ $t('general.confirmation') }}
          </slot>
        </h5>
        <button aria-label="Close" class="btn-close" type="button" @click="dismiss"></button>
      </slot>
    </template>
    <template #default>
      <slot>
        <p>Modal body text goes here.</p>
      </slot>
    </template>
    <template #modal-footer>
      <slot name="modal-footer">
        <button class="btn btn-secondary" type="button" @click="dismiss">{{ $t('general.cancel') }}</button>
        <button class="btn" :class="confirmButtonClass" type="button" @click="$emit('confirm')">
          <slot name="confirmButton">
            {{ $t('general.confirm') }}
          </slot>
        </button>
      </slot>
    </template>
  </BootstrapModal>
</template>
