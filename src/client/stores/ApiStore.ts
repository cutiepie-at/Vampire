import {Pinia, Store} from 'pinia-class-component';
import {ApiV1AuthApi, createConfiguration} from 'vampire-oas';

@Store({
  id: 'ApiStore',
  name: 'ApiStore',
})
export class ApiStore extends Pinia {
  //api
  private readonly _authApi = new ApiV1AuthApi(createConfiguration());

  get authApi(): ApiV1AuthApi {
    return this._authApi;
  }
}