import {Pinia, Store} from 'pinia-class-component';
import {ApiV1AuthApi, ApiV1LabelApi, createConfiguration} from 'vampire-oas';

@Store({
  id: 'ApiStore',
  name: 'ApiStore',
})
export class ApiStore extends Pinia {
  //api
  private readonly _authApi = new ApiV1AuthApi(createConfiguration());
  private readonly _labelApi = new ApiV1LabelApi(createConfiguration());

  get authApi(): ApiV1AuthApi {
    return this._authApi;
  }

  get labelApi(): ApiV1LabelApi {
    return this._labelApi;
  }
}