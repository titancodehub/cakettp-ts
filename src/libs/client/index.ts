import { RequestBlock } from "@/libs/http_parser/interface";
import axios, { AxiosError } from 'axios';
import { Test } from "../testtool";

export interface ClientResponse {
  reqMethod: string;
  reqUrl: string;
  status: number;
  body: string;
  headers: Map<string, string>;
  duration: number;
  request: RequestBlock;
}

export class Client {
  async send(request: RequestBlock) {
    const opts = {
      baseURL: request.url,
      method: request.method,
      data: request.body,
    }

    const c = axios.create({});
    const startTime = new Date();
    try {
      const res = await c.request(opts);
      const endTime = new Date();
      const headers = new Map<string, string>();
      for (const [key, value] of Object.entries(res.headers)) {
        headers.set(key, value);
      }
  
      return {
        reqMethod: res.config.method!,
        reqUrl: res.config.baseURL!,
        status: res.status,
        body: res.data,
        duration: endTime.getTime() - startTime.getTime(),
        headers,
        request,
      }
    } catch (e) {
      const endTime = new Date();
      if (e instanceof AxiosError) {
        const headers = new Map<string, string>();
        for (const [key, value] of Object.entries(e.response?.headers as any)) {
          headers.set(key, value as string);
        }
        return {
          reqMethod: e.response?.config.method!,
          reqUrl: e.response?.config.baseURL!,
          status: e.response?.status!,
          body: e.response?.data!,
          duration: endTime.getTime() - startTime.getTime(),
          headers,
          request,
        } as ClientResponse;
      }

      throw e;
    }
  }
}
