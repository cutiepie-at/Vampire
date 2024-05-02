<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {SessionStore} from '@/stores/SessionStore';
import {ApiStore} from '@/stores/ApiStore';
import ProfilePicture from '@/components/navbar/ProfilePicture.vue';

@Options({
  name: 'LoggedInComponent',
  components: {ProfilePicture},
})
export default class LoggedInComponent extends Vue {
  apiStore!: ApiStore;
  sessionStore!: SessionStore;

  beforeCreate(): void {
    this.apiStore = new ApiStore();
    this.sessionStore = new SessionStore();
  }

  onGotoSettings(): void {
    this.$router.push('/settings');
  }

  onGotoProfile(): void {
    this.$router.push('/profile');
  }

  async onLogout(): Promise<void> {
    const res = await this.apiStore.authApi.apiV1AuthLogoutPost();
    if (res.success) {
      this.sessionStore.clear();
    }
    this.$router.push('/');
  }
}
</script>
<template>
  <div class="width"></div>
  <li>
    <div class="logged-in-header d-flex flex-row">
      <div>
        <ProfilePicture :size="64"/>
      </div>
      <div class="ms-3 d-flex flex-column justify-content-center">
        <div>{{ sessionStore.user?.displayName ?? sessionStore.user?.name }}</div>
        <div><small>{{ sessionStore.user?.email }}</small></div>
      </div>
    </div>
  </li>
  <div class="dropdown-divider"></div>
  <li>
    <a class="dropdown-item c-pointer" @click="onGotoSettings">
      <i class="fa fa-cog"></i>
      Settings
    </a>
  </li>
  <li>
    <a class="dropdown-item c-pointer" @click="onGotoProfile">
      <i class="fa fa-user"></i>
      Profile
    </a>
  </li>
  <div class="dropdown-divider"></div>
  <li>
    <a class="dropdown-item c-pointer" @click="onLogout">
      <i class="fa fa-power-off"></i>
      {{ $t('auth.logout') }}
    </a>
  </li>
</template>

<style lang="scss" scoped>
@import '@/assets/menu.scss';

.logged-in-header {
  padding: var(--bs-dropdown-item-padding-y) var(--bs-dropdown-item-padding-x);
}

@media (max-width: $mobile-max-width) {
  .width {
    width: 100%;
  }
}

@media (min-width: $desktop-min-width) {
  .width {
    width: 18em;
  }
}
</style>