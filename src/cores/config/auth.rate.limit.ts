type Methods = "login" | "register" | "refreshToken";

interface MethodProps {
  max: number;
  errorHandling: object;
}

const login = {
  max: 5,
  errorHandling: {
    statusCode: 429,
    message: "Too many login attempt",
    code: "TOO_MANY",
  },
};

const register = {
  max: 5,
  errorHandling: {
    statusCode: 429,
    message: "Too many register attempt",
    code: "TOO_MANY",
  },
};

const refreshToken = {
  max: 30,
  errorHandling: {
    statusCode: 429,
    message: "Too many refresh attempt",
    code: "TOO_MANY",
  },
};

export default function rateLimitConfig(method: Methods) {
  if (!method) {
    throw new Error("Method needed!");
  }

  let currentMethod!: MethodProps;

  if (method === "login") {
    currentMethod = login;
  } else if (method === "register") {
    currentMethod = register;
  } else {
    currentMethod = refreshToken;
  }

  return {
    rateLimit: {
      max: currentMethod.max,
      timeWindow: "1 minute",
      errorResponseBuilder: (req: any, context: any) => {
        return {
          ...currentMethod.errorHandling,
          retryAfter: context.after,
        };
      },
    },
  };
}
