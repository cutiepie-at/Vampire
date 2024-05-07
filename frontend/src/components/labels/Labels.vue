<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {LabelStore} from '@/stores/LabelStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import type {Label} from 'vampire-oas';
import EditLabelModal from '@/components/labels/EditLabelModal.vue';
import LabelDeleteConfirmModal from '@/components/labels/LabelDeleteConfirmModal.vue';

@Options({
  name: 'Labels',
  components: {
    EditLabelModal,
    LabelDeleteConfirmModal,
    VueGoodTable,
  },
})
export default class Labels extends Vue {
  readonly store = new LabelStore();

  get columns(): any[] {
    return [{
      label: this.$t('label.model.name'),
      field: 'name',
    }, {
      label: this.$t('label.list.updatedAt'),
      field: (label: Label) => new Date(label.updatedAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
    }, {
      label: this.$t('label.list.createdAt'),
      field: (label: Label) => new Date(label.createdAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
    }, {
      label: this.$t('label.list.actions'),
      field: 'actions',
      sortable: false,
      width: '7em',
    }];
  }

  async mounted(): Promise<void> {
    await this.store.reload();
  }

  onNew(): void {
    (this.$refs.editModal as EditLabelModal).open();
  }

  onEdit(label: Label): void {
    (this.$refs.editModal as EditLabelModal).open(label);
  }

  onDelete(label: Label): void {
    (this.$refs.deleteModal as LabelDeleteConfirmModal).open(label);
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
        <button class="btn btn-secondary" @click="store.reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <VueGoodTable :columns="columns" :rows="store.labels" theme="bootstrap">
      <template #table-row="props">
        <div v-if="props.column.field === 'name'">
          <i class="fa fa-circle" :style="{color: props.row.color || '#000' }"/>
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
    <EditLabelModal ref="editModal"/>
    <LabelDeleteConfirmModal ref="deleteModal"/>
  </div>
</template>
