import {Pinia, Store} from 'pinia-class-component';
import {
  AuthApi,
  createConfiguration,
  HttpMethod,
  LabelsApi,
  ReportsApi,
  RequestContext,
  UsersApi,
  ValuesApi,
} from 'vampire-oas';

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
  private readonly _authApi = new AuthApi(this._config);
  private readonly _labelApi = new LabelsApi(this._config);
  private readonly _reportApi = new ReportsApi(this._config);
  private readonly _userApi = new UsersApi(this._config);
  private readonly _valueApi = new ValuesApi(this._config);

  get authApi(): AuthApi {
    return this._authApi;
  }

  get labelApi(): LabelsApi {
    return this._labelApi;
  }

  get reportApi(): ReportsApi {
    return this._reportApi;
  }

  get userApi(): UsersApi {
    return this._userApi;
  }

  get valueApi(): ValuesApi {
    return this._valueApi;
  }
}