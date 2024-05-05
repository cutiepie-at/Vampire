import type {Express} from 'express';
import {handleRequests, handleResponses, type OpenAPIV3, SPEC_OUTPUT_FILE_BEHAVIOR} from 'express-oas-generator';
import type {ConfigType} from './config/confighelper';
import {main} from './openapihelper';
import {isDevEnv} from './util/env';

export async function registerOpenApiFirst(express: Express, config: ConfigType): Promise<void> {
  if (!isDevEnv()) {
    return;
  }
  const specPath = '../swagger.json';
  await main(specPath);
  handleResponses(express, {
    specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE,
    swaggerDocumentOptions: {},
    specOutputPath: specPath,
    writeIntervalMs: 10000,
    ignoredNodeEnvironments: [''],//NODE_ENV will be empty in production
    tags: ['/api/v1/auth', '/api/v1/usersession/', '/api/v1/user/'],

    predefinedSpec: (spec: OpenAPIV3.Document) => {
      spec.servers ??= [];

      //add current server
      if (!spec.servers.some(s => s.url === config.server.baseUrl)) {
        spec.servers.push({
          url: config.server.baseUrl,
          description: 'default',
          variables: {
            // [variable: string]: ServerVariableObject;
          },
        });
      }

      return spec;
    },
  });
}

export function registerOpenApiLast(express: Express): void {
  if (!isDevEnv()) {
    return;
  }
  handleRequests();
}
