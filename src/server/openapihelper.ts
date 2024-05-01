import type {OpenAPIV2, OpenAPIV3} from 'express-oas-generator';
import * as fs from 'fs';
import * as path from 'path';
import type {ConvertOutputOptions, S2OError} from 'swagger2openapi';
import {convertObj} from 'swagger2openapi';
import {GLOBALS} from '$/util/GlobalVar';
import {mergeDeep} from '$/util/merge';

async function cleanupSpec(spec: OpenAPIV2.Document): Promise<boolean> {
  let modified = false;

  console.log('cleaning up openapi spec');

  //drop '/' from spec
  delete spec.paths['/'];
  delete spec.paths['*'];

  //TODO rewrite tags to not contain slashes
  //TODO make this function run before build:oas
  //TODO drop 304s and 500s from spec
  //drop html responses in /api/ from spec
  for (let path in spec.paths) {
    // console.log('path', path)
    if (path.startsWith("/api/")) {
      const pathItemObject = spec.paths[path] as OpenAPIV2.PathItemObject;
      // console.log('pathItemObject', pathItemObject)
      for (let method of ['get', 'post', 'put', 'patch', 'delete']) {
        // console.log('method', method)
        const operationsObject = (pathItemObject as any)[method] as OpenAPIV2.OperationObject;
        if (!operationsObject) {
          continue;
        }
        // console.log('operationsObject', operationsObject)
        for (let httpCode in operationsObject.responses) {
          // console.log('httpCode', httpCode)
          const reObject = operationsObject.responses[httpCode] as (OpenAPIV2.ResponseObject | OpenAPIV2.ReferenceObject) & any;
          // console.log('reObject', reObject)
          if (reObject.schema?.type === 'string' && reObject.schema?.example?.startsWith("<!DOCTYPE html>")) {
            delete reObject.schema;
            modified = true;
          }
        }
        const produces = (operationsObject.produces as string[] | undefined);
        // console.log('produces', produces)
        if (produces) {
          const idx = produces.indexOf('text/html');
          if (idx > -1) {
            produces.splice(idx, 1);
            modified = true;
          }
        }
      }
    }
  }

  console.log('cleaning up openapi spec done');

  return modified;
}

async function updateSpec(spec: OpenAPIV2.Document): Promise<boolean> {
  let modified = false;

  console.log('updating openapi spec');

  //update models
  const definitions = mergeDeep({}, GLOBALS.jsonSchemaDefinitions.definitions);
  Object.keys(definitions).forEach(k => delete definitions[k].$id);
  spec.definitions ??= {} as OpenAPIV2.DefinitionsObject;
  Object.assign(spec.definitions, definitions as OpenAPIV2.DefinitionsObject);
  modified = true;

  console.log('updating openapi spec done');

  return modified;
}

function convertOpenApiVersionToV3(specV2: OpenAPIV2.Document): Promise<OpenAPIV3.Document> {
  const options = {patch: true, warnOnly: true};

  return new Promise((resolve, reject) => {
    //specV2 as any because weird error: Argument of type 'Document<{}>' is not assignable to parameter of type 'Document'.
    convertObj(specV2 as any, options, function (err: S2OError | undefined, options: ConvertOutputOptions) {
      if (err) {
        reject(err);
      } else {
        resolve(options.openapi as any);//options.openapi as any because weird error: Argument of type 'Document<{}>' is not assignable to parameter of type 'Document'.
      }
    });
  })
}

export async function main(specPath: string): Promise<void> { //TODO rename this function
  if (!fs.existsSync(specPath)) {
    return;
  }
  const specOutputFileContent = fs.readFileSync(specPath).toString();
  const spec = JSON.parse(specOutputFileContent) as OpenAPIV2.Document;

  let modified = await cleanupSpec(spec);
  modified ||= await updateSpec(spec);

  if (modified) {
    fs.writeFileSync(specPath, JSON.stringify(spec, null, 2), 'utf8');

    try {
      const specV3 = await convertOpenApiVersionToV3(spec);
      const parsedSpecOutputPath = path.parse(specPath);
      const {name, ext} = parsedSpecOutputPath;
      parsedSpecOutputPath.base = name.concat('_').concat('v3').concat(ext);

      const v3Path = path.format(parsedSpecOutputPath);

      fs.writeFileSync(v3Path, JSON.stringify(specV3, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to generate V3 api spec');
    }
  }
}

