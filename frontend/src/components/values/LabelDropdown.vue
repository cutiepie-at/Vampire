<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {Label} from 'vampire-oas';

@Options({
  name: 'LabelDropdown',
  components: {},
  emits: ['update:modelValue'],
})
export default class LabelDropdown extends Vue {
  @Prop({required: true})
  readonly labels!: Label[];
  @Prop({required: true})
  readonly modelValue!: string;

  get sortedLabels(): Label[] {
    return [...this.labels].sort((l, r) => l.name.localeCompare(r.name));
  }
}
</script>

<template>
  <select :value="modelValue" @input="$emit('update:modelValue', ($event.target! as HTMLSelectElement).value)">
    <option v-for="label in sortedLabels" :key="label.id" :value="label.id" :selected="label.id === modelValue">
      {{ label.name }}
    </option>
  </select>
</template>
