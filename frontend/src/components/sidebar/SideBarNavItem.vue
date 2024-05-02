<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';

@Options({
  name: 'SideBarNavItem',
  components: {},
})
export default class SideBarNavItem extends Vue {
  @Prop({required: true})
  faIcon!: string;
  @Prop({required: true})
  text!: string;
  @Prop({required: true})
  routerTarget!: string;
  @Prop({required: true})
  collapsed!: boolean;
}
</script>

<template>
  <li class="nav-item ql-nav-item">
    <RouterLink :to="routerTarget" class="ql-nav-link no-wrap overflow-hidden"
                style="max-height: 1em;white-space: nowrap;vertical-align: middle;">
      <i class="ql-nav-item-icon align-middle d-inline-block me-2 text-center fa" :class="[faIcon]"></i>
      <span class="ql-nav-item-text align-middle d-inline-block" :class="{collapsed: collapsed}">{{ text }}</span>
    </RouterLink>
  </li>
</template>

<style lang="scss" scoped>
@import '@/assets/menu.scss';

.ql-nav-item-text {
  opacity: 1;
  overflow: hidden;
  max-width: 10em;
  transition: display ease-in-out 0.25s, opacity ease-in-out 0.25s, max-width ease-in-out 0.25s;

  @media (min-width: $desktop-min-width) {
    &.collapsed {
      opacity: 0;
      max-width: 0;
    }
  }
}

.ql-nav-item-icon {
  width: 1em;
  text-align: center;
}
</style>
