import {Pinia, Store} from 'pinia-class-component';
import {type UserInfo, type UserSessionInfo, VerifyResponse} from 'vampire-oas';
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
  private _loadedOnce: boolean = false;
  private _loadingPromise: Promise<VerifyResponse> | null = null;
  private _user: UserInfo | null = null;
  private _session: UserSessionInfo | null = null;

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
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

  async reload(force: boolean = false) {
    if (this._loadingPromise) {
      await this._loadingPromise;
      if (!force) {// when force is true, wait for the current operation to complete, then reload
        return;
      }
    }

    try {
      this._loadingPromise =this.apiStore.authApi.apiV1AuthVerifyPost()
      const res = await this._loadingPromise;
      this._user = res.user ?? null;
      this._session = res.session ?? null;
      this.triggerEvent();
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
      this._loadedOnce = true;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._loadedOnce) {
      return;
    }
    return await this.reload();
  }

  //
  private triggerEvent(): void {
    useEmitter().emit('authChanged');
  }
}