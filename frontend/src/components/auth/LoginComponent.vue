<script lang="ts">
import {ApiException, LoginRequest, LoginResponse} from 'vampire-oas';
import {Options, Vue} from 'vue-class-component';
import {SessionStore} from '@/stores/SessionStore';
import {ApiStore} from '@/stores/ApiStore';
import CenterOnParent from '@/components/CenterOnParent.vue';
import Spinner from '@/components/Spinner.vue';

@Options({
  name: 'LoginComponent',
  components: {CenterOnParent, Spinner},
  emits: {
    'loggedIn': () => undefined,
  },
})
export default class LoginComponent extends Vue {
  username: string = '';
  password: string = '';

  error: string = '';

  private readonly apiStore = new ApiStore();
  private readonly sessionStore = new SessionStore();

  async login(): Promise<void> {
    this.error = '';
    try {
      const res = await this.apiStore.authApi.apiV1AuthLoginPost(LoginRequest.fromJson({
        username: this.username,
        password: this.password,
      }));
      if (res.success) {
        this.sessionStore.setSession(res.user!, res.session!);
        this.$emit('loggedIn');
      } else {
        this.error = 'Something went wrong (unknown reason).';
      }
    } catch (err) {
      this.error = (err as ApiException<LoginResponse>).body.message ?? '';
    }
  }
}
</script>

<template>
  <div>
    <div class="width"></div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <template v-else>
      <div class="mb-3">
        Username
        <input type="text" class="form-control" v-model="username"/>
      </div>
      <div class="mb-3">
        Password
        <input type="password" class="form-control" v-model="password" @keydown.enter="login"/>
      </div>
      <div class="float-end mb-3">
        <button class="btn btn-primary" @click="login">{{ $t('auth.login') }}</button>
      </div>
      <div class="clearfix"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-down(sm) {
  .width {
    width: calc(100vw - 3em);
    transition: width .125s ease-in-out;
  }
}

@include media-breakpoint-up(sm) {
  .width {
    width: 18em;
    transition: width .125s ease-in-out;
  }
}
</style>
