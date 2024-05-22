<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {ValueStore} from '@/stores/ValueStore';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {getCurrentInstance} from 'vue';
import {ValueVmV1} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import LabelDropdown from '@/components/values/LabelDropdown.vue';
import {LabelStore} from '@/stores/LabelStore';
import Spinner from '@/components/Spinner.vue';
import {Validate} from '@/directives/Validate';
import {checkValidity, resetValidity} from '@/util/validation';

@Component({
  name: 'EditValueModal',
  components: {
    BootstrapModal,
    LabelDropdown,
    Spinner,
  },
  directives: {
    Validate,
  },
})
export default class EditValueModal extends Vue {
  readonly api = new ApiStore();
  readonly labelStore = new LabelStore();
  readonly valueStore = new ValueStore();
  value = new ValueVmV1();
  isNew = false;
  saving = false;

  get Value() {
    return ValueVmV1;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  open(value?: ValueVmV1): Promise<void> {
    this.isNew = !value;
    this.value = ValueVmV1.fromJson(!this.isNew ? value : {
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      labelId: '',
      date: new Date(),
      value: 0,
    });
    resetValidity(this.$el)
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      if (!checkValidity(this.$el)) {
        return;
      }

      if (this.isNew) {
        const res = await this.api.valueApi.add(this.value);
        this.valueStore.addValue(res);
        savedToast(this.$i18n);
      } else {
        const res = await this.api.valueApi.update(this.value);
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
          <LabelDropdown :labels="labelStore.labels" :id="uid + '_labelId'" v-model="value.labelId"
                         v-validate="{type: Value, prop: 'labelId', i18n: $i18n}"/>
        </div>
        <div class="mb-3">
          <label :for="uid + '_value'" class="form-value">{{ $t('value.model.value') }}</label>
          <input type="number" class="form-control" :id="uid + '_value'" v-model="value.value"
                 v-validate="{type: Value, prop: 'value', i18n: $i18n}">
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
