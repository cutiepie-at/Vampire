<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import LoginComponent from '@/components/auth/LoginComponent.vue';
import CenterOnParent from '@/components/CenterOnParent.vue';

@Options({
  name: 'LoginView',
  components: {
    CenterOnParent,
    LoginComponent
  },
})
export default class LoginView extends Vue {
  async onLoggedIn(): Promise<void> {
    this.$router.push('/');
  }
}
</script>

<template>
  <center-on-parent>
    <div class="card">
      <div class="card-body">
        <LoginComponent @loggedIn="onLoggedIn"/>
      </div>
    </div>
  </center-on-parent>
</template>
