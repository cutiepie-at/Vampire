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
import {formatInputDateTime, parseInputDateTime} from '@/util/date';

@Options({
  name: 'EditValueModal',
  components: {LabelDropdown, BootstrapModal},
})
export default class EditValueModal extends Vue {
  readonly api = new ApiStore();
  readonly store = new ValueStore();
  value = new Value();
  isNew = false;

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  get date(): string {
    return formatInputDateTime(this.value.date);
  }

  set date(value: string) {
    this.value.date = parseInputDateTime(value);
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
    try {
      if (this.isNew) {
        const res = await this.api.valueApi.apiV1ValuePost(this.value);
        this.store.addValue(res);
        savedToast(this.$i18n);
      } else {
        const res = await this.api.valueApi.apiV1ValuePut(this.value);
        this.store.updateValue(res);
        savedToast(this.$i18n);
      }
      await this.dismiss();
    } catch (err) {
      return handleError(this.$i18n, err);
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
          <LabelDropdown class="form-select" :id="uid + '_labelId'" v-model="value.labelId"/>
        </div>
        <div class="mb-3">
          <label :for="uid + '_date'" class="form-value">{{ $t('value.model.date') }}</label>
          <input type="datetime-local" class="form-control" :id="uid + '_date'" v-model="date">
        </div>
        <div class="mb-3">
          <label :for="uid + '_value'" class="form-value">{{ $t('value.model.value') }}</label>
          <input type="number" class="form-control" :id="uid + '_value'" v-model="value.value">
        </div>
      </div>
      <template #modal-footer>
        <button class="btn btn-secondary" type="button" @click="dismiss">{{ $t('general.cancel') }}</button>
        <button class="btn btn-primary" type="button" @click="save">
          {{ isNew ? $t('value.create.button') : $t('value.edit.button') }}
        </button>
      </template>
    </BootstrapModal>
  </div>
</template>
