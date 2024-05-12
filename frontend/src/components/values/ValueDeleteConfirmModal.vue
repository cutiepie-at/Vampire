<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal.vue';
import {type Label, type Report, type Value} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {toast} from 'vue3-toastify';
import {ValueStore} from '@/stores/ValueStore';
import {handleError} from '@/util/util';
import {LabelStore} from '@/stores/LabelStore';
import {ReportStore} from '@/stores/ReportStore';

@Options({
  name: 'ValueDeleteConfirmModal',
  components: {DeleteConfirmModal},
})
export default class ValueDeleteConfirmModal extends Vue {
  private readonly api = new ApiStore();
  private readonly labelStore = new LabelStore();
  private readonly reportStore = new ReportStore();
  private readonly valueStore = new ValueStore();

  //runtime
  value: Value | null = null;
  deleting = false;

  get label(): Label | null {
    return this.labelStore.labels.find(e => e.id === this.value?.labelId) ?? null;
  }

  get report(): Report | null {
    return this.reportStore.reports.find(e => e.id === this.value?.reportId) ?? null;
  }

  //public functions
  open(value: Value): Promise<void> {
    this.value = value;
    return (this.$refs.modal as DeleteConfirmModal).open();
  }

  dismiss(): Promise<void> {
    this.value = null;
    return (this.$refs.modal as DeleteConfirmModal).dismiss();
  }

  async confirm(): Promise<void> {
    this.deleting = true;
    try {
      await this.api.valueApi.apiV1ValueIdDelete(this.value!.id);
      this.valueStore.forgetValue(this.value!);
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
          {{ $t('value.delete.reallyDelete') }}
        </div>
        <div v-if="value">
          <div>{{ $t('report.report') + ': ' + (report?.name ?? '(unknown)') }}</div>
          <div>{{ $t('report.model.lab') + ': ' + (report?.lab ?? '(unknown)') }}</div>
          <div>{{ $t('report.model.date') + ': ' + (report?.date ? $d(report.date, 'datetime') : '(unknown)') }}</div>
          <div>
            {{ $t('label.label') + ': ' }}
            <i class="fa fa-circle" :style="{color: label?.color || '#000' }"/>
            {{ (label?.name ?? '(unknown)') }}
          </div>
          <div>{{ $t('value.model.value') + ': ' + value.value }}</div>
        </div>
      </template>
    </DeleteConfirmModal>
  </div>
</template>
