<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {ValueStore} from '@/stores/ValueStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import {type LabelVmV1, type ReportVmV1, type ValueVmV1} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import EditValueModal from '@/components/values/EditValueModal.vue';
import ValueDeleteConfirmModal from '@/components/values/ValueDeleteConfirmModal.vue';
import Loading from '@/components/Loading.vue';
import {ReportStore} from '@/stores/ReportStore';

type Row = { value: ValueVmV1, label: LabelVmV1, report: ReportVmV1 };

@Component({
  name: 'Values',
  components: {
    EditValueModal,
    Loading,
    ValueDeleteConfirmModal,
    VueGoodTable,
  },
})
export default class Values extends Vue {
  readonly labelStore = new LabelStore();
  readonly reportStore = new ReportStore();
  readonly valueStore = new ValueStore();

  get columns(): any[] {
    return [{
      label: this.$t('label.model.name'),
      field: (row: Row) => row.label.name,
      templateKey: 'name',
    }, {
      label: this.$t('report.report'),
      field: (row: Row) => row.report.name,
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('report.model.lab'),
      field: (row: Row) => row.report.lab,
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('value.model.value'),
      field: (row: Row) => row.value.value + ' ' + row.label.unit,
      type: 'number',
      sortFn: (x: string, y: string, col: any, rowX: Row, rowY: Row) => rowY.value.value - rowX.value.value,
    }, {
      label: this.$t('label.reference'),
      field: (row: Row) => (row.label.minReference === 0 && row.label.maxReference === 0)
      || row.label.unit.trim().length === 0
          ? ''
          : row.label.minReference + ' - ' + row.label.maxReference + ' ' + row.label.unit,
      type: 'number',
      sortFn: (x: string, y: string, col: any, rowX: Row, rowY: Row) => {
        const ret = rowY.label.minReference - rowX.label.minReference;
        if (ret !== 0) {
          return ret;
        }
        return rowY.label.maxReference - rowX.label.maxReference;
      },
      thClass: 'mobile-hidden-md',
      tdClass: 'mobile-hidden-md',
    }, {
      label: this.$t('report.model.date'),
      field: (row: Row) => new Date(row.report.date),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
      thClass: 'mobile-hidden-sm',
      tdClass: 'mobile-hidden-sm',
    }, {
      label: this.$t('value.list.actions'),
      field: 'actions',
      sortable: false,
      width: '1%',
    }];
  }

  get rows(): Row[] {
    const ret = this.valueStore.values.map(e => ({
      value: e,
      label: this.labelsById.get(e.labelId),
      report: this.reportsById.get(e.reportId),
    }));
    return ret.filter(e => !!e.label) as Row[];
  }

  get searchOptions(): any {
    return {
      enabled: true,
      placeholder: this.$t('general.search'),
    };
  }

  get labelsById(): Map<string, LabelVmV1> {
    return new Map<string, LabelVmV1>(this.labelStore.labels.map(e => [e.id, e]));
  }

  get reportsById(): Map<string, ReportVmV1> {
    return new Map<string, ReportVmV1>(this.reportStore.reports.map(e => [e.id, e]));
  }

  async mounted(): Promise<void> {
    await this.labelStore.loadIfAbsent();
    await this.reportStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();
  }

  async reload(): Promise<void> {
    await this.labelStore.reload();
    await this.reportStore.reload();
    await this.valueStore.reload();
  }

  onEdit(row: Row): void {
    (this.$refs.editModal as EditValueModal).open(row.value);
  }

  onDelete(row: Row): void {
    (this.$refs.deleteModal as ValueDeleteConfirmModal).open(row.value);
  }
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row mb-2">
      <div class="btn-group ms-auto">
        <button class="btn btn-secondary" @click="reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <Loading v-if="labelStore.loading || reportStore.loading || valueStore.loading"/>
    <div v-else class="flex-grow-1 overflow-auto">
      <VueGoodTable :columns="columns" :rows="rows" :search-options="searchOptions" theme="bootstrap">
        <template #table-row="props">
          <div v-if="props.column.templateKey === 'name'">
            <i class="fa fa-circle" :style="{color: props.row.label.color || '#000' }"/>
            {{ props.formattedRow[props.column.field] }}
          </div>
          <div v-else-if="props.column.field === 'actions'">
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
    <EditValueModal ref="editModal"/>
    <ValueDeleteConfirmModal ref="deleteModal"/>
  </div>
</template>
