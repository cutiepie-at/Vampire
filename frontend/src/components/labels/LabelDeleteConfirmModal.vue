<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal.vue';
import type {LabelVmV1} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {toast} from 'vue3-toastify';
import {LabelStore} from '@/stores/LabelStore';
import {handleError} from '@/util/util';
import {ValueStore} from '@/stores/ValueStore';

@Component({
  name: 'LabelDeleteConfirmModal',
  components: {DeleteConfirmModal},
})
export default class LabelDeleteConfirmModal extends Vue {
  private readonly api = new ApiStore();
  private readonly labelStore = new LabelStore();
  private readonly valueStore = new ValueStore();

  //runtime
  label: LabelVmV1 | null = null;
  deleting = false;

  get associatedValueCount(): number {
    return this.valueStore.values.filter(e => e.labelId === this.label?.id).length;
  }

  //public functions
  open(label: LabelVmV1): Promise<void> {
    this.label = label;
    return (this.$refs.modal as DeleteConfirmModal).open();
  }

  dismiss(): Promise<void> {
    this.label = null;
    return (this.$refs.modal as DeleteConfirmModal).dismiss();
  }

  async confirm(): Promise<void> {
    this.deleting = true;
    try {
      await this.api.labelApi.remove(this.label!.id);
      this.labelStore.forgetLabel(this.label!);
      toast.info(this.$t('general.deleted'));
      await this.dismiss();
    } catch (e) {
      return handleError(this.$i18n, e);
    } finally {
      this.deleting = false;
    }
  }
}
</script>

<template>
  <!-- <div> needed, otherwise @confirm event will merge into including <tag> a will trigger multiple times and with null as event param -->
  <div>
    <DeleteConfirmModal ref="modal" :deleting="deleting" @confirm="confirm">
      <template #modal-title>{{ $t('general.confirmation') }}</template>
      <template #default>
        <div>
          {{ $t('label.delete.reallyDelete') }}
        </div>
        <div v-if="label">
          {{ $t('label.model.name') + ': ' + label.name }}
        </div>
        <small>
          {{ $tc('label.delete.associatedValues', {count: associatedValueCount}) }}
        </small>
      </template>
    </DeleteConfirmModal>
  </div>
</template>
