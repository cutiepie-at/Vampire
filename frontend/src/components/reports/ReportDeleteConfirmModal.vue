<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal.vue';
import type {Report} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {toast} from 'vue3-toastify';
import {ReportStore} from '@/stores/ReportStore';
import {handleError} from '@/util/util';
import {ValueStore} from '@/stores/ValueStore';

@Options({
  name: 'ReportDeleteConfirmModal',
  components: {DeleteConfirmModal},
})
export default class ReportDeleteConfirmModal extends Vue {
  private readonly api = new ApiStore();
  private readonly reportStore = new ReportStore();
  private readonly valueStore = new ValueStore();

  //runtime
  report: Report | null = null;
  deleting = false;

  get associatedValueCount(): number {
    return this.report
        ? this.valueStore.valuesByReportId.get(this.report.id)?.length ?? 0
        : 0;
  }

  //public functions
  open(report: Report): Promise<void> {
    this.report = report;
    return (this.$refs.modal as DeleteConfirmModal).open();
  }

  dismiss(): Promise<void> {
    this.report = null;
    return (this.$refs.modal as DeleteConfirmModal).dismiss();
  }

  async confirm(): Promise<void> {
    this.deleting = true;
    try {
      await this.api.reportApi.apiV1ReportIdDelete(this.report!.id);
      this.reportStore.forgetReport(this.report!);
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
          {{ $t('report.delete.reallyDelete') }}
        </div>
        <template v-if="report">
          <div> {{ $t('report.model.name') + ': ' + report.name }}</div>
          <div> {{ $t('report.model.lab') + ': ' + report.lab }}</div>
        </template>
        <small>
          {{ $tc('report.delete.associatedValues', {count: associatedValueCount}) }}
        </small>
      </template>
    </DeleteConfirmModal>
  </div>
</template>
