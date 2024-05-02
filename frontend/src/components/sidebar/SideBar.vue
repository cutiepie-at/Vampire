<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import SideBarNavItem from '@/components/sidebar/SideBarNavItem.vue';

@Options({
  name: 'SideBar',
  components: {
    SideBarNavItem,
  },
})
export default class SideBar extends Vue {
  collapsed: boolean = false;
  toggled: boolean = false;

  public toggle(toggle: boolean): void {
    this.toggled = toggle;
  }
}
</script>

<template>
  <div class="ql-sidebar d-flex flex-column border-right shadow bg-body"
       :class="{ collapsed: collapsed, toggled: toggled }">
    <!-- <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip"
      data-bs-placement="right" data-bs-original-title="Icon-only">
      <svg class="bi" width="40" height="32">
        <use xlink:href="#bootstrap"></use>
      </svg>
      <span class="visually-hidden">Icon-only</span>
    </a> -->
    <ul class="nav flex-column mb-auto">
      <side-bar-nav-item class="ql-sidebar-nav-item p-3 border-bottom" fa-icon="fa-home" text="Home"
                         router-target="/" :collapsed="collapsed"/>
      <side-bar-nav-item class="ql-sidebar-nav-item p-3 border-bottom" fa-icon="fa-ribbon" text="Labels"
                         router-target="/labels" :collapsed="collapsed"/>
      <side-bar-nav-item class="ql-sidebar-nav-item p-3 border-bottom" fa-icon="fa-question" text="About"
                         router-target="/about" :collapsed="collapsed"/>
      <!-- TODO menu localization -->
    </ul>
    <div class="border-top float-right">
      <button class="btn btn-secondary ql-collapse-btn" @click="collapsed = !collapsed">
        <i :class="{ fa: true, 'fa-angles-left': !collapsed, 'fa-angles-right': collapsed }"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/menu.scss';

@media (max-width: $mobile-max-width) {
  .ql-sidebar {
    position: fixed;
    height: 100%;
    z-index: 10000;
    margin-bottom: auto;

    &:not(.toggled) {
      width: 0;
    }
  }

  /* we don't need the collapse button on phones*/
  .ql-collapse-btn {
    display: none;
  }
}

@media (min-width: $desktop-min-width) {
  .ql-sidebar {
    &.collapsed {
      width: $collapsedWidth;

      .ql-nav-item-text {
        max-width: 0;
        overflow: hidden;
        /* opacity: 0; */
      }
    }
  }
}

.ql-sidebar {
  width: $width;
  max-width: $width;
  transition: width ease-in-out 0.25s;
  overflow-x: hidden;

  .ql-sidebar-nav-item {
    border-top: 0;
    border-bottom: 0;
  }
}
</style>
