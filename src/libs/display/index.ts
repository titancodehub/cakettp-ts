import color from 'cli-color';
import { ClientResponse } from '@/libs/client';
import { highlight } from 'cli-highlight';

export class ClientResponseDisplay {
  show(res: ClientResponse) {
    console.log(`${this.printMethod(res.reqMethod)} ${color.cyan(res.reqUrl)}`);
    console.log(`${color.bold.yellow('Status')} ${color.white(`${res.status}`)}`);
    console.log(`${color.bold.yellow('Latency')} ${color.white(`${res.duration}ms`)}`);
    this.newLine();
    this.printHeader(res.headers);
    this.newLine();
    this.printBody(res.body);
  }

  newLine() {
    console.log('')
  }

  printHeader(header: Map<string, string>) {
    for (const [key, value] of header.entries()) {
      console.log(`${color.bold.blue(key)} ${color.white(value)}`);
    }
  }

  printMethod(method: string) {
    let col = color.white;
    switch(method.toUpperCase()) {
      case 'GET': col = col.bgGreen; break;
      case 'POST': col = col.bgBlue; break;
      case 'PATCH': col = col.bgYellow; break;
      case 'DELETE': col = col.bgRed; break;
      default: col = col.bgMagenta; break;
    }
    return col(` ${method.toUpperCase()} `);
  }

  printBody(body: string) {
    console.log(highlight(JSON.stringify(body, null, 2)));
  }
}