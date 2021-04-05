// Create an Error with custom message and code
export class ApiError extends Error {
  message: string;
  code: number;
  constructor(code: number, message = 'Api Error') {
    super(message);
    this.code = code;
    this.message = message;
  }
  toString() {
    return `ApiError ${this.code} - ${this.message}`;
  }
}

export async function request<
  Data = Record<string, unknown>,
  Body = Record<string, unknown>
>({
  uri,
  method = 'GET',
  contentType = 'application/json',
  body,
  token,
}: {
  uri: string;
  method?: string;
  contentType?: string;
  body?: Body;
  token?: string;
}) {
  const stringifiedBody = (() => {
    if (contentType === 'application/json') {
      return JSON.stringify(body);
    }
    if (contentType === 'application/x-www-form-urlencoded') {
      return new URLSearchParams(body as Record<string, any>);
    }
  })();

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(uri, {
      method: method,
      headers,
      body: stringifiedBody,
    });

    // @ts-ignore ignore default value
    let payload: Data = undefined;

    try {
      payload = await response.json();
    } catch (err) {
      /* noop */
    }

    if (response.status < 200 || response.status > 299) {
      const errorPayload = (payload as unknown) as {
        error_description?: string;
        error?: string;
      };
      const message: string =
        (errorPayload
          ? errorPayload.error_description
            ? errorPayload.error_description
            : errorPayload.error
          : null) ||
        response.statusText ||
        'Request error';

      throw new ApiError(response.status, message);
    }

    return payload || ({} as Data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
