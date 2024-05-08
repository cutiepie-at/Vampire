import {Pinia, Store} from 'pinia-class-component';
import type {UserInfo, UserSessionInfo} from 'vampire-oas';
import {ApiStore} from '@/stores/ApiStore';
import useEmitter from '@/composables/emitter';

@Store({
  id: 'SessionStore',
  name: 'SessionStore',
})
export class SessionStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loading: boolean = false;
  private _user: UserInfo | null = null;
  private _session: UserSessionInfo | null = null;

  //getter
  get loading(): boolean {
    return this._loading;
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get user(): UserInfo | null {
    return this._user;
  }

  get session(): UserSessionInfo | null {
    return this._session;
  }

  //actions
  clear() {
    this._user = null;
    this._session = null;
    this.triggerEvent();
  }

  setSession(user: UserInfo, session: UserSessionInfo) {
    this._user = user;
    this._session = session;
    this.triggerEvent();
  }

  async reload() {
    this._loading = true;
    try {
      const res = await this.apiStore.authApi.apiV1AuthVerifyPost();
      this._user = res.user ?? null;
      this._session = res.session ?? null;
      this.triggerEvent();
    } catch (err) {
      this.clear();
    } finally {
      this._loading = false;
    }
  }

  //
  private triggerEvent(): void {
    useEmitter().emit('authChanged');
  }
}