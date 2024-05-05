<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {LabelStore} from '@/stores/LabelStore';
import {Prop} from 'vue-property-decorator';

@Options({
  name: 'EditValueModal',
  components: {BootstrapModal},
  emits: ['update:modelValue'],
})
export default class EditValueModal extends Vue {
  readonly labelStore = new LabelStore();

  @Prop({required: true})
  readonly modelValue!: string;
}
</script>

<template>
  <select :value="modelValue" @input="$emit('update:modelValue', ($event.target! as HTMLSelectElement).value)">
    <option v-for="label in labelStore.labels" :key="label.id" :value="label.id" :selected="label.id === modelValue">
      {{ label.name }}
    </option>
  </select>
</template>
