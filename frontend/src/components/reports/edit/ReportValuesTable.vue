<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import LabelDropdown from '@/components/values/LabelDropdown.vue';
import {Label, Value} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import {emptyUUID} from '@/util/util';
import '@vuepic/vue-datepicker/dist/main.css';
import Loading from '@/components/Loading.vue';
import {findNewColor} from '@/util/label';
import {Prop} from 'vue-property-decorator';
import type ReportDetailsModel from '@/components/reports/edit/ReportDetailsModel';

@Options({
  name: 'ReportValuesTable',
  components: {
    LabelDropdown,
    Loading,
  },
})
export default class ReportValuesTable extends Vue {
  readonly labelStore = new LabelStore();

  @Prop({required: true})
  readonly details!: ReportDetailsModel;
  @Prop({default: true})
  readonly readonly!: boolean;

  get allLabels(): Label[] {
    return this.labelStore.labels.concat(this.details.newLabels);
  }

  get unusedLabels(): Label[] {
    const usedLabelIds = new Set(this.details.values.map(e => e.labelId));
    return this.allLabels.filter(e => !usedLabelIds.has(e.id));
  }

  get labelsById(): Map<string, Label> {
    return new Map<string, Label>(this.allLabels.map(e => [e.id, e]));
  }

  async mounted(): Promise<void> {
    await this.labelStore.loadIfAbsent();
  }

  newValue(labelId: string): void {
    if (this.details.values.some(e => e.labelId === labelId)) {
      return;
    }
    this.details.values.push(new Value({
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      labelId: labelId,
      date: new Date(),
      value: 0,
    }));
  }

  removeValue(index: number): void {
    const values = this.details.values.splice(index, 1);

    //if value used a created label and that label is not referenced in any other value, then remove that created label
    const labelIndex = this.details.newLabels.findIndex(e => e.id === values[0].labelId);
    if (labelIndex >= 0 && !this.details.values.some(e => e.labelId === values[0].labelId)) {
      this.details.newLabels.splice(labelIndex, 1);
    }
  }

  initLabel(name: string): Label {
    const matchingLabel = this.allLabels.find(e => e.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (matchingLabel) {
      return matchingLabel;
    }
    return new Label({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      name: name,
      description: '',
      unit: '',
      color: findNewColor(this.allLabels.map(e => e.color)),
      minReference: 0,
      maxReference: 0,
    });
  }

  onLabelCreated(label: Label): void {
    this.details.newLabels.push(label);
  }
}
</script>

<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>{{ $t('value.model.labelId') }}</th>
        <th>{{ $t('value.model.value') }}</th>
        <th>{{ $t('label.model.unit') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, i) in details.values">
        <td>
          <button v-if="!readonly" class="btn btn-sm btn-danger me-2" @click="removeValue(i)">
            <i class="fa fa-times"/>
          </button>
          <i class="fa fa-circle" :style="{color: labelsById.get(value.labelId)?.color || '#000' }"/>
          {{ labelsById.get(value.labelId)?.name }}
        </td>
        <td>
          <input type="number" class="form-control" v-model="value.value" :disabled="readonly">
        </td>
        <td>
          {{ labelsById.get(value.labelId)?.unit }}
        </td>
      </tr>
      <tr v-if="unusedLabels.length && !readonly">
        <td>
          <LabelDropdown class="w-100" :drop-direction="'top'"
                         :labels="unusedLabels" :allow-new-options="true"
                         modelValue="" @update:modelValue="newValue"
                         :create-label="initLabel" @label:created="onLabelCreated"/>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table th {
  top: 0;
  position: sticky;
}

table td {
  vertical-align: middle; /*TODO alignment still off*/
}

input[type="number"] {
  width: 7em;
}
</style>
