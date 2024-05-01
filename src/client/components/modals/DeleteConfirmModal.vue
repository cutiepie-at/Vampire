<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import ConfirmModal from './ConfirmModal.vue';
import {Prop} from 'vue-property-decorator';

@Options({
  name: 'DeleteConfirmModal',
  components: {ConfirmModal},
  emits: {
    'confirm': () => undefined,
  },
})
export default class DeleteConfirmModal extends Vue {
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

  //public functions
  open(): Promise<void> {
    return (this.$refs.modal as ConfirmModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as ConfirmModal).dismiss();
  }
}
</script>

<template>
  <ConfirmModal ref="modal"
                :closeOnOutsideClick="closeOnOutsideClick"
                :closeOnKeyboardEsc="closeOnKeyboardEsc"
                :scrollable="scrollable"
                :centerVertically="centerVertically"
                :size="size">
    <template #modal-header>
      <slot name="modal-header">
        <h5 class="modal-title">
          <slot name="modal-title">
            {{ $t('general.confirmation') }}
          </slot>
        </h5>
        <button type="button" class="btn-close" @click="dismiss" aria-label="Close"></button>
      </slot>
    </template>
    <template #default>
      <slot>
        <p>Modal body text goes here.</p>
      </slot>
    </template>
    <template #modal-footer>
      <button type="button" class="btn btn-secondary" @click="dismiss">{{ $t('general.cancel') }}</button>
      <button type="button" class="btn btn-danger" @click="$emit('confirm')">{{ $t('general.delete') }}</button>
    </template>
  </ConfirmModal>
</template>
