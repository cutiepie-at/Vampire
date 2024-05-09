<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import Values from '@/components/values/Values.vue';
import LabelDropdown from '@/components/values/LabelDropdown.vue';
import {getCurrentInstance} from 'vue';
import {type Label, Value} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import {ApiStore} from '@/stores/ApiStore';
import Loading from '@/components/Loading.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {sharedDarkMode} from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';

@Options({
  name: 'ValuesView',
  components: {
    LabelDropdown,
    Loading,
    Values,
    VueDatePicker,
  },
})
export default class ValuesView extends Vue {
  readonly api = new ApiStore();
  readonly labelStore = new LabelStore();
  readonly valueStore = new ValueStore();

  date = new Date();
  readonly values: Value[] = [];
  readonly valuesToSave: boolean[] = [];

  get labelsById(): Map<string, Label> {
    return new Map<string, Label>(this.labelStore.labels.map(e => [e.id, e]));
  }

  get sharedDarkMode() {
    return sharedDarkMode;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async mounted(): Promise<void> {
    await this.labelStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();

    this.date = new Date();
    this.values.splice(0);
    this.values.push(...this.labelStore.labels.map(e => new Value({
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      labelId: e.id,
      date: this.date,
      value: 0,
    })));
  }

  async save(): Promise<void> {
    this.values.forEach(e => e.date = this.date);

    const toSave = this.values.filter((value, i) => this.valuesToSave[i]);
    try {
      const res = await this.api.valueApi.apiV1ValueBatchPost(toSave);
      this.valueStore.addValues(res);
      savedToast(this.$i18n);
      this.$router.push('/values');
    } catch (err) {
      return handleError(this.$i18n, err);
    }
  }

  dateTimeFormat(d: Date): string {
    return this.$d(d, 'datetime');
  }
}
</script>

<template>
  <div class="p-2">
    <Loading v-if="labelStore.loading || valueStore.loading"/>
    <template v-else>
      <div class="mb-3">
        <label :for="uid + '_date'" class="form-value">{{ $t('value.model.date') }}</label>
        <VueDatePicker v-model="date"
                       :auto-apply="true"
                       :clearable="false"
                       :config="{closeOnAutoApply: false}"
                       :dark="sharedDarkMode.darkMode"
                       :format="dateTimeFormat"
                       :id="uid + '_date'"
                       :locale="$i18n.locale"
                       :time-picker-inline="true"/>
      </div>
      <table class="table table-striped">
        <thead>
          <tr>
            <td style="width: 0.5em"></td>
            <td>{{ $t('value.model.labelId') }}</td>
            <td>{{ $t('value.model.value') }}</td>
            <td>{{ $t('label.model.unit') }}</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, i) in values">
            <td style="width: 0.5em">
              <div class="form-check px-0 mt-1">
                <input class="form-check-input mx-0" type="checkbox" v-model="valuesToSave[i]">
              </div>
            </td>
            <td>{{ labelsById.get(value.labelId)?.name }}</td>
            <td>
              <input type="number" class="form-control" v-model="value.value" @input="valuesToSave[i] = true">
            </td>
            <td>
              {{ labelsById.get(value.labelId)?.unit }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex">
        <button class="btn btn-primary ms-auto" @click="save">{{ $t('general.save') }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
table td {
  vertical-align: middle;
}
</style>
