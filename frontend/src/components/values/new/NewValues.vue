<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {getCurrentInstance} from 'vue';
import {Value} from 'vampire-oas';
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
  readonly values: Value[] = [];

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
    this.values.forEach(e => e.date = this.date);

    try {
      const res = await this.api.valueApi.apiV1ValueBatchPost(this.values);
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
    <NewValuesTable v-model="values"/>
    <div class="d-flex">
      <button class="btn btn-primary ms-auto" @click="save">{{ $t('general.save') }}</button>
    </div>
  </template>
</template>
