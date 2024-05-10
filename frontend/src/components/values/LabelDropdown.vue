<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {Label} from 'vampire-oas';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import '@/assets/vue-select/bootstrap.css';

@Options({
  name: 'LabelDropdown',
  components: {vSelect},
  emits: {
    'update:modelValue': (value: string) => true,
    'label:created': (value: Label) => true,
  },
})
export default class LabelDropdown extends Vue {
  @Prop({required: true})
  readonly labels!: Label[];
  @Prop({required: true})
  readonly modelValue!: string;
  @Prop({default: false})
  readonly allowNewOptions!: boolean;
  @Prop({default: (_: string) => undefined})
  readonly createLabel!: (name: string) => Label;

  get sortedLabels(): Label[] {
    return [...this.labels].sort((l, r) => l.name.localeCompare(r.name));
  }
}
</script>

<template>
  <div>
    <vSelect :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"
             :options="sortedLabels"
             label="name"
             :reduce="(label: Label) => label.id"
             :clearable="false"
             :taggable="allowNewOptions"
             :createOption="createLabel"
             @option:created="$emit('label:created', $event)"/>
  </div>
</template>
