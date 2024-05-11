<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {LabelStore} from '@/stores/LabelStore';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {getCurrentInstance} from 'vue';
import {Label} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import {sharedDarkMode} from '../bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import {ColorPicker} from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import {findNewColor} from '@/util/label';
import Spinner from '@/components/Spinner.vue';

@Options({
  name: 'EditLabelModal',
  components: {
    BootstrapModal,
    ColorPicker,
    Spinner,
  },
})
export default class EditLabelModal extends Vue {
  readonly api = new ApiStore();
  readonly store = new LabelStore();
  label = new Label();
  isNew = false;
  saving = false;

  get sharedDarkMode() {
    return sharedDarkMode;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  open(label?: Label): Promise<void> {
    this.isNew = !label;
    this.label = Label.fromJson(!this.isNew ? label : {
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      name: '',
      description: '',
      unit: '',
      color: findNewColor(this.store.labels.map(e => e.color)),
      minReference: 0,
      maxReference: 0,
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
        const res = await this.api.labelApi.apiV1LabelPost(this.label);
        this.store.addLabel(res);
        savedToast(this.$i18n);
      } else {
        const res = await this.api.labelApi.apiV1LabelPut(this.label);
        this.store.updateLabel(res);
        savedToast(this.$i18n);
      }
      await this.dismiss();
    } catch (err) {
      return handleError(this.$i18n, err);
    } finally {
      this.saving = false;
    }
  }
}
</script>

<template>
  <div>
    <BootstrapModal ref="modal">
      <template #modal-title>
        {{ isNew ? $t('label.create.modalTitle') : $t('label.edit.modalTitle') }}
      </template>
      <div>
        <div class="mb-3">
          <label :for="uid + '_name'" class="form-label">{{ $t('label.model.name') }}</label>
          <input type="text" class="form-control" :id="uid + '_name'" v-model="label.name">
        </div>
        <div class="mb-3">
          <label :for="uid + '_description'" class="form-label">{{ $t('label.model.description') }}</label>
          <input type="text" class="form-control" :id="uid + '_description'" v-model="label.description">
        </div>
        <div class="mb-3">
          <label :for="uid + '_unit'" class="form-label">{{ $t('label.model.unit') }}</label>
          <input type="text" class="form-control" :id="uid + '_unit'" v-model="label.unit">
        </div>
        <div class="mb-3">
          <label :for="uid + '_color'" class="form-label">{{ $t('label.model.color') }}</label>
          <ColorPicker
              :id="uid + '_color'"
              style="height: 2em"
              :disable-alpha="true"
              lang="En"
              :theme="sharedDarkMode.darkMode ? 'black' : 'white'"
              v-model:pureColor="label.color"
          />
        </div>
        <div class="mb-3">
          <label :for="uid + '_minReference'" class="form-label">{{ $t('label.model.minReference') }}</label>
          <input type="number" class="form-control" :id="uid + '_minReference'" v-model="label.minReference" min="0"
                 :max="label.maxReference">
        </div>
        <div class="mb-3">
          <label :for="uid + '_maxReference'" class="form-label">{{ $t('label.model.maxReference') }}</label>
          <input type="number" class="form-control" :id="uid + '_maxReference'" v-model="label.maxReference"
                 :min="label.minReference">
        </div>
      </div>
      <template #modal-footer>
        <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="saving">
          {{ $t('general.cancel') }}
        </button>
        <button class="btn btn-primary" type="button" @click="save" :disabled="saving">
          <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
          {{ isNew ? $t('label.create.button') : $t('label.edit.button') }}
        </button>
      </template>
    </BootstrapModal>
  </div>
</template>

<style>
.vc-color-wrap {
  width: 100% !important;
  height: 2.375em !important;
  margin-right: 0 !important;
  display: block !important;
  border-radius: var(--bs-border-radius);
  border: var(--bs-border-width) solid var(--bs-border-color);
}
</style>
