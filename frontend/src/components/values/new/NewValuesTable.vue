<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import LabelDropdown from '@/components/values/LabelDropdown.vue';
import {type Label, Value} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import {emptyUUID} from '@/util/util';
import '@vuepic/vue-datepicker/dist/main.css';
import {Prop} from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';

@Options({
  name: 'NewValuesTable',
  components: {
    Loading,
    LabelDropdown,
  },
})
export default class NewValuesTable extends Vue {
  readonly labelStore = new LabelStore();

  @Prop({required: true})
  readonly modelValue!: Value[];

  get unusedLabels(): Label[] {
    const usedLabelIds = new Set(this.modelValue.map(e => e.labelId));
    return this.labelStore.labels.filter(e => !usedLabelIds.has(e.id));
  }

  get labelsById(): Map<string, Label> {
    return new Map<string, Label>(this.labelStore.labels.map(e => [e.id, e]));
  }

  async mounted(): Promise<void> {
    await this.labelStore.loadIfAbsent();
  }

  newValue(labelId: string): void {
    this.modelValue.push(new Value({
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
}
</script>

<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <td>{{ $t('value.model.labelId') }}</td>
        <td>{{ $t('value.model.value') }}</td>
        <td>{{ $t('label.model.unit') }}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, i) in modelValue">
        <td>
          <button class="btn btn-sm btn-danger me-2" @click="modelValue.splice(i, 1)">
            <i class="fa fa-times"/>
          </button>
          {{ labelsById.get(value.labelId)?.name }}
        </td>
        <td>
          <input type="number" class="form-control" v-model="value.value">
        </td>
        <td>
          {{ labelsById.get(value.labelId)?.unit }}
        </td>
      </tr>
      <tr v-if="unusedLabels.length">
        <td>
          <LabelDropdown class="w-100" :labels="unusedLabels" modelValue="" @update:modelValue="newValue"/>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table td {
  vertical-align: middle;
}
</style>
