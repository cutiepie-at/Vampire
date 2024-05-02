<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import LoginComponent from '@/components/auth/LoginComponent.vue';
import UserAccountDropdown from '@/components/navbar/UserAccountDropdown.vue';
import NavBar from '@/components/navbar/NavBar.vue';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';

@Options({
  name: 'SiteNavBar',
  components: {BootstrapThemeSwitch, NavBar, LoginComponent, UserAccountDropdown},
  emits: {
    'toggle': (show: boolean) => show,
  },
})
export default class SiteNavBar extends Vue {
  private toggled: boolean = true;

  toggle(): void {
    this.toggled = !this.toggled;
    this.$emit('toggle', this.toggled);
  }
}
</script>

<template>
  <NavBar>
    <template #left="">
      <a class="ql-sidebar-toggler ms-3" @click="toggle">
        <!--      <i class="fa fa-bars"></i>-->
        <span class="navbar-toggler-icon"></span>
      </a>
      <!--    <a class="navbar-brand" href="#">Navbar</a>-->
    </template>
    <template #center="">
      <ul class="navbar-nav mr-auto">
      </ul>
    </template>
    <template #right="">
      <div class="d-flex align-items-center">
        <BootstrapThemeSwitch/>
        <UserAccountDropdown class="me-2"/>
      </div>
    </template>
  </NavBar>
</template>

<style lang="scss" scoped>
@import '@/assets/menu.scss';

@media (max-width: $mobile-max-width) {
  .ql-sidebar-toggler {

  }
}

@media (min-width: $desktop-min-width) {
  .ql-sidebar-toggler {
    display: none;
  }
}
</style>
