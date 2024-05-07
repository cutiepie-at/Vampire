<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {ValueStore} from '@/stores/ValueStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import type {Label, Value} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import EditValueModal from '@/components/values/EditValueModal.vue';
import ValueDeleteConfirmModal from '@/components/values/ValueDeleteConfirmModal.vue';

type Row = { value: Value, label: Label };

@Options({
  name: 'Values',
  components: {
    EditValueModal,
    ValueDeleteConfirmModal,
    VueGoodTable,
  },
})
export default class Values extends Vue {
  private readonly labelStore = new LabelStore();
  private readonly valueStore = new ValueStore();

  get columns(): any[] {
    return [{
      label: this.$t('label.model.name'),
      field: (row: Row) => row.label.name,
      templateKey: 'name',
    }, {
      label: this.$t('value.model.value'),
      field: (row: Row) => row.value.value + ' ' + row.label.unit,
      type: 'number',
      sortFn: (x: string, y: string, col: any, rowX: Row, rowY: Row) => rowY.value.value - rowX.value.value,
    }, {
      label: this.$t('label.reference'),
      field: (row: Row) => row.label.minReference + ' - ' + row.label.maxReference + ' ' + row.label.unit,
      type: 'number',
      sortFn: (x: string, y: string, col: any, rowX: Row, rowY: Row) => {
        const ret = rowY.label.minReference - rowX.label.minReference;
        if (ret !== 0) {
          return ret;
        }
        return rowY.label.maxReference - rowX.label.maxReference;
      },
    }, {
      label: this.$t('value.model.date'),
      field: (row: Row) => new Date(row.value.date),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
    }, {
      label: this.$t('value.list.actions'),
      field: 'actions',
      sortable: false,
      width: '7em',
    }];
  }

  get rows(): Row[] {
    const ret = this.valueStore.values.map(e => ({value: e, label: this.labelsById.get(e.labelId)}));
    return ret.filter(e => !!e.label) as Row[];
  }

  get labelsById(): Map<string, Label> {
    return new Map<string, Label>(this.labelStore.labels.map(e => [e.id, e]));
  }

  async mounted(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    await this.labelStore.reload();
    await this.valueStore.reload();
  }

  onNew(): void {
    this.$router.push('/values/new');
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
  <div>
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

    <VueGoodTable :columns="columns" :rows="rows" theme="bootstrap">
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
    <EditValueModal ref="editModal"/>
    <ValueDeleteConfirmModal ref="deleteModal"/>
  </div>
</template>
