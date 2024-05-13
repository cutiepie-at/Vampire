<script lang="ts">
import LoggedInComponent from '@/components/navbar/LoggedInComponent.vue';
import LoginComponent from '@/components/auth/LoginComponent.vue';
import {SessionStore} from '@/stores/SessionStore';
import {Options, Vue} from 'vue-class-component';
import {getCurrentInstance} from 'vue';
import ProfilePicture from '@/components/navbar/ProfilePicture.vue';

@Options({
  name: 'UserAccountDropdown',
  methods: {getCurrentInstance},
  components: {
    LoggedInComponent,
    LoginComponent,
    ProfilePicture,
  },
})
export default class UserAccountDropdown extends Vue {
  sessionStore!: SessionStore;

  get uid(): number {
    return getCurrentInstance()!.uid;
  }

  beforeCreate(): void {
    this.sessionStore = new SessionStore();
  }

  async created(): Promise<void> {
    await this.sessionStore.reload();
  }
}
</script>
<template>
  <div class="dropdown">
    <div class="m-1 d-flex align-items-center c-pointer" :id="'userdropdown' + uid"
         data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
      <ProfilePicture size="32"/>
    </div>
    <!--      <a href="#"-->
    <!--         class="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle"-->
    <!--         data-bs-toggle="dropdown" aria-expanded="false">-->
    <!--        <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24" class="rounded-circle">-->
    <!--      </a>-->
    <ul class="dropdown-menu dropdown-menu-end text-small shadow"
        :aria-labelledby="'userdropdown' + uid">
      <li v-if="!sessionStore.session" style="margin: -.5em 0">
        <LoginComponent class="m-3"/>
      </li>
      <LoggedInComponent v-if="sessionStore.user"/>
    </ul>
  </div>
</template>
