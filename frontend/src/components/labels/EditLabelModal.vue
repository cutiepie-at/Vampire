<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {LabelStore} from '@/stores/LabelStore';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {getCurrentInstance} from 'vue';
import {Label} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';

@Options({
  name: 'EditLabelModal',
  components: {BootstrapModal},
})
export default class EditLabelModal extends Vue {
  api = new ApiStore();
  store = new LabelStore();
  label = new Label();
  isNew = false;

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
      color: '',
      minReference: 0,
      maxReference: 0,
    });
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  async save(): Promise<void> {
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
    } catch (e2) {
      return handleError(this.$i18n, e2);
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
          <input type="color" class="form-control" :id="uid + '_color'" v-model="label.color">
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
        <button class="btn btn-secondary" type="button" @click="dismiss">{{ $t('general.cancel') }}</button>
        <button class="btn btn-primary" type="button" @click="save">
          {{ isNew ? $t('label.create.button') : $t('label.edit.button') }}
        </button>
      </template>
    </BootstrapModal>
  </div>
</template>
