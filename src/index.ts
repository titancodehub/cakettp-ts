import { HttpParser } from '@/libs/http_parser';

import { program } from 'commander';
import { ClientResponseDisplay } from '@/libs/display';
import { Client } from '@/libs/client';
import { AxiosError } from 'axios';
import { Expect } from './libs/testtool';

function handleError(err: any) {
  if (err instanceof AxiosError) {
    console.log(err.code, err.message, err.response?.status, err.response?.data);
    return;
  }
  console.log(err);
}

(async () => {
  
  program.requiredOption('--file <path>', '--file <file.http>').parse();
  const path = program.getOptionValue('file');
  const request = new HttpParser().parse(path)[0];
  const res =await  new Client().send(request);
  new ClientResponseDisplay().show(res);
  if (request.test) {
    request.test.setResponse(res);
    request.test.run();
  }
})().catch(e => handleError(e));
