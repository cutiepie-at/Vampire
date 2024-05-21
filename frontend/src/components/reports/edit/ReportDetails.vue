<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {getCurrentInstance, reactive} from 'vue';
import {ReportVmV1} from 'vampire-oas';
import {LabelStore} from '@/stores/LabelStore';
import {ValueStore} from '@/stores/ValueStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import {ApiStore} from '@/stores/ApiStore';
import Loading from '@/components/Loading.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {sharedDarkMode} from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import ReportValuesTable from '@/components/reports/edit/ReportValuesTable.vue';
import Spinner from '@/components/Spinner.vue';
import {Prop} from 'vue-property-decorator';
import {ReportStore} from '@/stores/ReportStore';
import ReportDetailsModel from '@/components/reports/edit/ReportDetailsModel';
import {Validate} from '@/directives/Validate';
import {checkValidity, resetValidity} from '@/util/validation';

@Options({
  name: 'ReportDetails',
  components: {
    Loading,
    ReportValuesTable,
    Spinner,
    VueDatePicker,
  },
  directives: {
    Validate,
  },
})
export default class ReportDetails extends Vue {
  @Prop({required: true})
  readonly reportId!: string;
  @Prop({default: true})
  readonly readonly!: boolean;

  readonly api = new ApiStore();
  readonly labelStore = new LabelStore();
  readonly reportStore = new ReportStore();
  readonly valueStore = new ValueStore();

  saving = false;

  get Report() {
    return ReportVmV1;
  }

  get reportDetails(): ReportDetailsModel {
    const report = ReportVmV1.fromJson(this.reportId !== '0'
        ? this.reportStore.reports.find(e => e.id === this.reportId)
        : {
          id: emptyUUID(),
          createdAt: new Date(),
          createdBy: emptyUUID(),
          updatedAt: new Date(),
          updatedBy: emptyUUID(),
          date: new Date(),
          name: '',
          lab: '',
          comment: '',
        });
    const values = this.valueStore.valuesByReportId.get(report.id) ?? [];
    const details = new ReportDetailsModel(report, [], values);
    return reactive(details); //TODO for some reason the return value is not reactive automatically
  }

  get sharedDarkMode() {
    return sharedDarkMode;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async mounted(): Promise<void> {
    resetValidity(this.$el);
    await this.labelStore.loadIfAbsent();
    await this.reportStore.loadIfAbsent();
    await this.valueStore.loadIfAbsent();
  }

  async save(): Promise<void> {
    //copy values to locale vars, because the reportDetails might change while we call different api endpoints
    let report = this.reportDetails.report;
    const newLabels = [...this.reportDetails.newLabels]; // shallow copy array, or it might change while we save
    const values = [...this.reportDetails.values]; // shallow copy array, or it might change while we save

    this.saving = true;
    try {
      if (!checkValidity(this.$el)) {
        return;
      }

      //create labels on the fly
      const usedLabelIds = values.map(e => e.labelId);
      const newLabelsToCreate = newLabels.filter(e => usedLabelIds.includes(e.id));
      for (let label of newLabelsToCreate) {
        const res = await this.api.labelApi.add(label);
        this.labelStore.addLabel(res);

        //update label ids in values
        values.filter(e => e.labelId === label.id).forEach(e => e.labelId = res.id);
      }

      //save report
      if (report.id === emptyUUID()) {
        const res = await this.api.reportApi.add(report);
        this.reportStore.addReport(res);
        report = res;
      } else {
        const res = await this.api.reportApi.update(report);
        this.reportStore.updateReport(res);
      }

      //save values
      values.forEach(e => e.reportId = report.id);

      const res = await this.api.valueApi.updateBatchByReportId(report.id, values);
      this.valueStore.forgetValuesByReportId(report.id);
      this.valueStore.addValues(res);

      savedToast(this.$i18n);
      this.$router.push('/reports');
    } catch (err) {
      return handleError(this.$i18n, err);
    } finally {
      this.saving = false;
    }
  }

  dateTimeFormat(d: Date): string {
    return this.$d(d, 'datetime');
  }
}
</script>

<template>
  <Loading v-if="labelStore.loading || reportStore.loading || valueStore.loading"/>
  <div v-else class="d-flex flex-column">
    <div class="mb-3">
      <label :for="uid + '_date'" class="form-value">{{ $t('report.model.date') }}</label>
      <VueDatePicker v-model="reportDetails.report.date"
                     :auto-apply="true"
                     :clearable="false"
                     :config="{closeOnAutoApply: false}"
                     :dark="sharedDarkMode.darkMode"
                     :format="dateTimeFormat"
                     :id="uid + '_date'"
                     :locale="$i18n.locale"
                     :time-picker-inline="true"
                     :disabled="readonly"/>
    </div>
    <div class="mb-3">
      <label :for="uid + '_name'" class="form-report">{{ $t('report.model.name') }}</label>
      <input type="text" class="form-control" :id="uid + '_name'" v-model="reportDetails.report.name"
             v-validate="[Report, 'name', $i18n]" :disabled="readonly">
    </div>
    <div class="mb-3">
      <label :for="uid + '_lab'" class="form-report">{{ $t('report.model.lab') }}</label>
      <input type="text" class="form-control" :id="uid + '_lab'" v-model="reportDetails.report.lab"
             v-validate="[Report, 'lab', $i18n]" :disabled="readonly">
    </div>
    <div class="mb-3">
      <label :for="uid + '_comment'" class="form-report">{{ $t('report.model.comment') }}</label>
      <input type="text" class="form-control" :id="uid + '_comment'" v-model="reportDetails.report.comment"
             v-validate="[Report, 'comment', $i18n]" :disabled="readonly">
    </div>
    <div class="mb-3 overflow-auto">
      <ReportValuesTable ref="newValuesTable" :details="reportDetails" :readonly="readonly"/>
    </div>
    <div class="d-flex flex-row" v-if="!readonly">
      <button class="btn btn-primary ms-auto" @click="save" :disabled="saving">
        <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
        {{ $t('general.save') }}
      </button>
    </div>
  </div>
</template>
