<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {ValueStore} from '@/stores/ValueStore';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {getCurrentInstance} from 'vue';
import {Value} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import LabelDropdown from '@/components/values/LabelDropdown.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {sharedDarkMode} from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import {LabelStore} from '@/stores/LabelStore';
import Spinner from '@/components/Spinner.vue';

@Options({
  name: 'EditValueModal',
  components: {
    BootstrapModal,
    LabelDropdown,
    Spinner,
    VueDatePicker,
  },
})
export default class EditValueModal extends Vue {
  readonly api = new ApiStore();
  readonly labelStore = new LabelStore();
  readonly valueStore = new ValueStore();
  value = new Value();
  isNew = false;
  saving = false;

  get sharedDarkMode() {
    return sharedDarkMode;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  open(value?: Value): Promise<void> {
    this.isNew = !value;
    this.value = Value.fromJson(!this.isNew ? value : {
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      labelId: '',
      date: new Date(),
      value: 0,
    });
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      if (this.isNew) {
        const res = await this.api.valueApi.apiV1ValuePost(this.value);
        this.valueStore.addValue(res);
        savedToast(this.$i18n);
      } else {
        const res = await this.api.valueApi.apiV1ValuePut(this.value);
        this.valueStore.updateValue(res);
        savedToast(this.$i18n);
      }
      await this.dismiss();
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
  <div>
    <BootstrapModal ref="modal">
      <template #modal-title>
        {{ isNew ? $t('value.create.modalTitle') : $t('value.edit.modalTitle') }}
      </template>
      <div>
        <div class="mb-3">
          <label :for="uid + '_labelId'" class="form-value">{{ $t('value.model.labelId') }}</label>
          <LabelDropdown :labels="labelStore.labels" :id="uid + '_labelId'" v-model="value.labelId"/>
        </div>
        <div class="mb-3">
          <label :for="uid + '_date'" class="form-value">{{ $t('value.model.date') }}</label>
          <VueDatePicker v-model="value.date"
                         :auto-apply="true"
                         :clearable="false"
                         :config="{closeOnAutoApply: false}"
                         :dark="sharedDarkMode.darkMode"
                         :format="dateTimeFormat"
                         :id="uid + '_date'"
                         :locale="$i18n.locale"
                         :time-picker-inline="true"/>
        </div>
        <div class="mb-3">
          <label :for="uid + '_value'" class="form-value">{{ $t('value.model.value') }}</label>
          <input type="number" class="form-control" :id="uid + '_value'" v-model="value.value">
        </div>
      </div>
      <template #modal-footer>
        <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="saving">
          {{ $t('general.cancel') }}
        </button>
        <button class="btn btn-primary" type="button" @click="save" :disabled="saving">
          <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
          {{ isNew ? $t('value.create.button') : $t('value.edit.button') }}
        </button>
      </template>
    </BootstrapModal>
  </div>
</template>
