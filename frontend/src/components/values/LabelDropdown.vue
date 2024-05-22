<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {LabelVmV1} from 'vampire-oas';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import '@/assets/vue-select/bootstrap.css';
import {createPopper, type Placement} from '@popperjs/core';

@Component({
  name: 'LabelDropdown',
  components: {vSelect},
  emits: ['update:modelValue', 'label:created'],
})
export default class LabelDropdown extends Vue {
  @Prop({required: true})
  readonly labels!: LabelVmV1[];
  @Prop({required: true})
  readonly modelValue!: string;
  @Prop({default: false})
  readonly allowNewOptions!: boolean;
  @Prop({default: (_: string) => undefined})
  readonly createLabel!: (name: string) => LabelVmV1;
  @Prop({default: 'bottom'})
  readonly dropDirection!: Placement;

  get sortedLabels(): LabelVmV1[] {
    return [...this.labels].sort((l, r) => l.name.localeCompare(r.name));
  }

  // see https://vue-select.org/guide/positioning.html#popper-js-integration
  withPopper(dropdownList: any, component: any, {width}: any) {
    /**
     * We need to explicitly define the dropdown width since
     * it is usually inherited from the parent with CSS.
     */
    dropdownList.style.width = width;
    dropdownList.style.zIndex = 10000;

    /**
     * Here we position the dropdownList relative to the $refs.toggle Element.
     *
     * The 'offset' modifier aligns the dropdown so that the $refs.toggle and
     * the dropdownList overlap by 1 pixel.
     *
     * The 'toggleClass' modifier adds a 'drop-up' class to the Vue Select
     * wrapper so that we can set some styles for when the dropdown is placed
     * above.
     */
    const popper = createPopper(component.$refs.toggle, dropdownList, {
      placement: this.dropDirection,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -1],
          },
        },
        {
          name: 'toggleClass',
          enabled: true,
          phase: 'write',
          fn: ({state}) => {
            component.$el.classList.toggle('drop-' + this.dropDirection, state.placement === this.dropDirection);
          },
        },
      ],
    });

    /**
     * To prevent memory leaks Popper needs to be destroyed.
     * If you return function, it will be called just before dropdown is removed from DOM.
     */
    return () => popper.destroy();
  }
}
</script>

<template>
  <div>
    <vSelect :class="{}"
             :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"
             :options="sortedLabels"
             label="name"
             :reduce="(label: LabelVmV1) => label.id"
             :append-to-body="true"
             :calculate-position="withPopper"
             :clearable="false"
             :taggable="allowNewOptions"
             :createOption="createLabel"
             @option:created="$emit('label:created', $event)"/>
  </div>
</template>
<style>
.v-select.drop-top.vs--open .vs__dropdown-toggle {
  border-radius: 0 0 4px 4px;
  border-top-color: transparent;
  border-bottom-color: rgba(60, 60, 60, 0.26);
}

[data-popper-placement='top'] {
  border-radius: 4px 4px 0 0;
  border-top-style: solid;
  border-bottom-style: none;
  box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15);
}

.vs__dropdown-menu {
  --vs-dropdown-max-height: min(45vh, 350px); /* default: 350px*/
  --vs-dropdown-min-width: min(30px, 160px); /* default: 160px*/
}
</style>
