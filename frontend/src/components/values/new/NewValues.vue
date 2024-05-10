<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {getCurrentInstance} from 'vue';
import {Label, Value} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';
import {handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import {ApiStore} from '@/stores/ApiStore';
import Loading from '@/components/Loading.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {sharedDarkMode} from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import NewValuesTable from '@/components/values/new/NewValuesTable.vue';

@Options({
  name: 'NewValues',
  components: {
    Loading,
    NewValuesTable,
    VueDatePicker,
  },
})
export default class NewValues extends Vue {
  readonly api = new ApiStore();
  readonly labelStore = new LabelStore();
  readonly valueStore = new ValueStore();

  date = new Date();

  get createdLabels(): Label[] {
    return (this.$refs.newValuesTable as NewValuesTable).createdLabels;
  }

  get createdValues(): Value[] {
    return (this.$refs.newValuesTable as NewValuesTable).createdValues;
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
  }

  async save(): Promise<void> {
    //create labels on the fly
    const usedLabelIds = this.createdValues.map(e => e.labelId);
    const newLabelsToCreate = this.createdLabels.filter(e => usedLabelIds.includes(e.id));
    for (let label of newLabelsToCreate) {
      try {
        const res = await this.api.labelApi.apiV1LabelPost(label);
        this.labelStore.addLabel(res);

        //update label ids in values
        this.createdValues.filter(e => e.labelId === label.id).forEach(e => e.labelId = res.id);
      } catch (err) {
        return handleError(this.$i18n, err);
      }
    }

    //save values
    this.createdValues.forEach(e => e.date = this.date);

    try {
      const res = await this.api.valueApi.apiV1ValueBatchPost(this.createdValues);
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
  <Loading v-if="labelStore.loading || valueStore.loading"/>
  <div v-else class="d-flex flex-column">
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
    <div class="mb-3 overflow-auto">
      <NewValuesTable ref="newValuesTable"/>
    </div>
    <div class="d-flex flex-row">
      <button class="btn btn-primary ms-auto" @click="save">{{ $t('general.save') }}</button>
    </div>
  </div>
</template>
