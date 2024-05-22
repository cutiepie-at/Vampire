<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {LabelStore} from '@/stores/LabelStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import type {LabelVmV1} from 'vampire-oas';
import EditLabelModal from '@/components/labels/EditLabelModal.vue';
import LabelDeleteConfirmModal from '@/components/labels/LabelDeleteConfirmModal.vue';
import Loading from '@/components/Loading.vue';

@Component({
  name: 'Labels',
  components: {
    EditLabelModal,
    LabelDeleteConfirmModal,
    Loading,
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
      label: this.$t('label.model.description'),
      field: 'description',
      thClass: 'mobile-hidden-md',
      tdClass: 'mobile-hidden-md',
    }, {
      label: this.$t('label.reference'),
      field: (label: LabelVmV1) => (label.minReference !== 0 || label.maxReference !== 0)
          ? label.minReference + ' - ' + label.maxReference
          : '',
      type: 'number',
      thClass: 'mobile-hidden-sm',
      tdClass: 'mobile-hidden-sm',
    }, {
      label: this.$t('label.model.unit'),
      field: 'unit',
    }, {
      label: this.$t('label.list.updatedAt'),
      field: (label: LabelVmV1) => new Date(label.updatedAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('label.list.createdAt'),
      field: (label: LabelVmV1) => new Date(label.createdAt),
      type: 'date',
      format: 'date',
      formatFn: (d: Date) => this.$d(d, 'datetime'),
      thClass: 'mobile-hidden-lg',
      tdClass: 'mobile-hidden-lg',
    }, {
      label: this.$t('label.list.actions'),
      field: 'actions',
      sortable: false,
      width: '1%',
    }];
  }

  get searchOptions(): any {
    return {
      enabled: true,
      placeholder: this.$t('general.search'),
    };
  }

  async mounted(): Promise<void> {
    await this.store.loadIfAbsent();
  }

  onNew(): void {
    (this.$refs.editModal as EditLabelModal).open();
  }

  onEdit(label: LabelVmV1): void {
    (this.$refs.editModal as EditLabelModal).open(label);
  }

  onDelete(label: LabelVmV1): void {
    (this.$refs.deleteModal as LabelDeleteConfirmModal).open(label);
  }

  isLabelMissingInfo(label: LabelVmV1): boolean {
    return label.unit.trim().length === 0
        || (label.minReference === 0 && label.maxReference === 0);
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
        <button class="btn btn-secondary" @click="store.reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <Loading v-if="store.loading"/>
    <div v-else class="flex-grow-1 overflow-auto">
      <VueGoodTable :columns="columns" :rows="store.labels" :search-options="searchOptions" theme="bootstrap">
        <template #table-row="props">
          <div v-if="props.column.field === 'name'">
            <i class="fa fa-circle" :style="{color: props.row.color || '#000' }"/>
            {{ props.formattedRow[props.column.field] }}
            <span v-if="isLabelMissingInfo(props.row)"
                  class="badge bg-warning user-select-none"
                  :title="$t('label.missingInformation')">!</span>
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
    <EditLabelModal ref="editModal"/>
    <LabelDeleteConfirmModal ref="deleteModal"/>
  </div>
</template>
