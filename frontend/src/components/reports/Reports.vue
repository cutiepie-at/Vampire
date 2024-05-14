<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {ReportStore} from '@/stores/ReportStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import type {Report} from 'vampire-oas';
import ReportDeleteConfirmModal from '@/components/reports/ReportDeleteConfirmModal.vue';
import Loading from '@/components/Loading.vue';
import {ValueStore} from '@/stores/ValueStore';

@Options({
  name: 'Reports',
  components: {
    Loading,
    ReportDeleteConfirmModal,
    VueGoodTable,
  },
})
export default class Reports extends Vue {
  readonly reportStore = new ReportStore();
  readonly valueStore = new ValueStore();

  get columns(): any[] {
    return [{
      label: this.$t('report.model.name'),
      field: 'name',
      thClass: 'mobile-hidden-sm',
      tdClass: 'mobile-hidden-sm',
    }, {
      label: this.$t('report.model.lab'),
      field: 'lab',
      thClass: 'mobile-hidden-md',
      tdClass: 'mobile-hidden-md',
    }, {
      label: this.$t('report.model.comment'),
      field: 'comment',
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('report.model.date'),
      field: (report: Report) => new Date(report.date),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
    }, {
      label: this.$t('report.valueCount'),
      labelShort: this.$t('report.valueCountShort'),
      field: (report: Report) => this.valueStore.valuesByReportId.get(report.id)?.length ?? 0,
      type: 'number',
    }, {
      label: this.$t('report.list.updatedAt'),
      field: (report: Report) => new Date(report.updatedAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('report.list.createdAt'),
      field: (report: Report) => new Date(report.createdAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('report.list.actions'),
      field: 'actions',
      sortable: false,
      width: '1%',
    }];
  }

  get reports(): Report[] {
    const reports = [...this.reportStore.reports];
    reports.sort((l, r) => r.date.getTime() - l.date.getTime());
    return reports;
  }

  get searchOptions(): any {
    return {
      enabled: true,
      placeholder: this.$t('general.search'),
    };
  }

  async mounted(): Promise<void> {
    await this.reportStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();
  }

  async reload(): Promise<void> {
    await this.reportStore.reload();
    await this.valueStore.reload();
  }

  onNew(): void {
    this.$router.push('reports/0/edit');
  }

  onEdit(report: Report): void {
    this.$router.push(`reports/${report.id}/edit`);
  }

  onDelete(report: Report): void {
    (this.$refs.deleteModal as ReportDeleteConfirmModal).open(report);
  }
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row mb-2">
      <div class="btn-group ms-auto">
        <button class="btn btn-success" @click="onNew()">
          <i class="fa fa-plus"/>
        </button>
        <button class="btn btn-secondary" @click="reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <Loading v-if="reportStore.loading || valueStore.loading"/>
    <div v-else class="flex-grow-1 overflow-auto">
      <VueGoodTable :columns="columns" :rows="reports" :search-options="searchOptions" theme="bootstrap">
        <template #table-column="props">
          <span class="mobile-show-sm">{{ props.column.labelShort ?? props.column.label }}</span>
          <span class="mobile-hidden-sm">{{ props.column.label }}</span>
        </template>
        <template #table-row="props">
          <div v-if="props.column.field === 'actions'">
            <div class="btn-group">
              <button class="btn btn-sm btn-secondary" @click="onEdit(props.row)">
                <i class="fa fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="onDelete(props.row)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </VueGoodTable>
    </div>
    <ReportDeleteConfirmModal ref="deleteModal"/>
  </div>
</template>
