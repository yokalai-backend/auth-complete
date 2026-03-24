export function bodyValidation(schema: any) {
  return async (req: any) => {
    req.body = schema.parse(req.body);
  };
}

export function paramsValidation(schema: any) {
  return async (req: any) => {
    req.params = schema.parse(req.params);
  };
}

export function queryValidation(schema: any) {
  return async (req: any) => {
    req.query = schema.parse(req.query);
  };
}
