export const validateRequest = (schema, target = 'body') => {
  return async (req, res, next) => {
    let dataToValidate;

    switch (target) {
    case 'query':
      dataToValidate = { query: req.query };
      break;
    case 'params':
      dataToValidate = { params: req.params };
      break;
    case 'body':
    default:
      dataToValidate = { body: req.body };
      break;
    }

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format())
        .filter(([key]) => key !== '_errors')
        .map(([field, error]) => ({
          field,
          message: Array.isArray(error)
            ? error.join(', ')
            : error._errors?.join(', ') || 'Invalid input',
        }));

      return res.status(400).json({
        success: false,
        statusCode: 400,
        request: {
          ip: req.ip || null,
          method: req.method,
          url: req.originalUrl,
        },
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    switch (target) {
    case 'query':
      Object.assign(req.query, result.data.query);
      break;
    case 'params':
      Object.assign(req.params, result.data.params);
      break;
    case 'body':
    default:
      Object.assign(req.body, result.data.body);
      break;
    }

    return next();
  };
};

export default validateRequest;
