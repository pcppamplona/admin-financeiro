import ky, { Options as KyOptions, HTTPError } from "ky";

type RequestMethod = "get" | "post" | "put" | "patch" | "delete" | "head";
type Interceptor = (options: KyOptions) => Promise<void>;
type ResponseInterceptor = (response: Response) => Promise<Response>;

export class HttpClient {
  private instance: typeof ky;
  private requestInterceptors: Interceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseURL: string, defaultOptions: KyOptions = {}) {
    this.instance = ky.create({
      prefixUrl: baseURL,
      ...defaultOptions,
    });
  }

  // Adiciona um interceptador de requisição

  addRequestInterceptor(interceptor: Interceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  //Adiciona um interceptador de resposta

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  //Executa uma requisição HTTP

  private async request<T>(
    method: RequestMethod,
    url: string,
    data?: unknown,
    options: KyOptions = {}
  ): Promise<T> {
    // Clona as opções para evitar mutações
    const mergedOptions: KyOptions = { ...options, method };

    // Adiciona o corpo da requisição para métodos que não sejam GET/HEAD
    if (data && !["get", "head"].includes(method)) {
      mergedOptions.json = data;
    }

    // Executa interceptadores de requisição
    for (const interceptor of this.requestInterceptors) {
      await interceptor(mergedOptions);
    }

    try {
      let response = await this.instance(url, mergedOptions);

      // Executa interceptadores de resposta
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response.clone());
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof HTTPError) {
        const response = error.response;
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          data: errorData,
          message: error.message,
        };
      }
      throw error;
    }
  }

  //Métodos HTTP simplificados

  public get<T>(url: string, options?: KyOptions): Promise<T> {
    return this.request<T>("get", url, undefined, options);
  }

  public post<T>(url: string, data?: unknown, options?: KyOptions): Promise<T> {
    return this.request<T>("post", url, data, options);
  }

  public put<T>(url: string, data?: unknown, options?: KyOptions): Promise<T> {
    return this.request<T>("put", url, data, options);
  }

  public patch<T>(
    url: string,
    data?: unknown,
    options?: KyOptions
  ): Promise<T> {
    return this.request<T>("patch", url, data, options);
  }

  public delete<T>(url: string, options?: KyOptions): Promise<T> {
    return this.request<T>("delete", url, undefined, options);
  }
}
