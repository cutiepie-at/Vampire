import {Pinia, Store} from 'pinia-class-component';
import {ApiV1AuthApi, ApiV1LabelApi, createConfiguration, HttpMethod, RequestContext} from 'vampire-oas';

@Store({
  id: 'ApiStore',
  name: 'ApiStore',
})
export class ApiStore extends Pinia {
  private readonly _config = createConfiguration({
    baseServer: {
      makeRequestContext(endpoint: string, httpMethod: HttpMethod): RequestContext {
        return new RequestContext(endpoint, httpMethod);
      },
    },
  });

  //api
  private readonly _authApi = new ApiV1AuthApi(this._config);
  private readonly _labelApi = new ApiV1LabelApi(this._config);

  get authApi(): ApiV1AuthApi {
    return this._authApi;
  }

  get labelApi(): ApiV1LabelApi {
    return this._labelApi;
  }
}