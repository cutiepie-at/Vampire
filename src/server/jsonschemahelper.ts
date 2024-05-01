export function getSchemaDefinitions(): { definitions: { [key: string]: any } } {
  const ret = {
    definitions: {} as { [key: string]: any },
  };

  //update models
  const modules = import.meta.glob([
    '$/models/**/*.ts',
    '!./**/__tests__/*',
    '!$/models/db/BaseModel.ts',
    '!$/models/db/BaseModelId.ts',
    '!$/models/db/BaseModelCreatedUpdated.ts',
    '!$/models/db/User.ts',
    '!$/models/db/UserSession.ts',
  ], {eager: true});
  for (let path in modules) {
    // console.log(path, modules[path]);
    const mod: any = modules[path];
    // console.log(path, mod, Object.keys(mod));
    for (const name of Object.keys(mod)) {
      const schema = mod[name]?.jsonSchemaWithReferences;
      if (!schema) {
        continue;
      }
      const clsname = name === 'default' ? mod[name].name : name;
      // console.log(name, mod[name], typeof mod[name], clsname, schema);

      ret.definitions[clsname] = schema;
    }
  }

  return ret;
}
