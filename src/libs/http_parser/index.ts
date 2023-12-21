import fs from 'fs';
import { HistoryLine, isBodyLine, isEndOfRequestBlock, isHeaderLine, isUrlLine } from './helper';
import { RequestBlock } from './interface';

export class HttpParser {
  parse(path: string) : RequestBlock[]{
    const rawtext =  fs.readFileSync(path);
    const splitLines = rawtext.toString().split('\n');
    const requests: RequestBlock[] = [];
    const history : HistoryLine[] =[];

    let requestBlock: RequestBlock = {
      method: '',
      url: '',
      headers: new Map(),
      body: '',
    };

    for (const [lineNumber, line] of splitLines.entries()) {
      const sanitizedLine = line.trim();

      if (sanitizedLine === '') { 
        history.push(HistoryLine.EMPTY_LINE);
      } else if (isUrlLine(sanitizedLine)) {
        const substr = sanitizedLine.split(' ');
        requestBlock.method = substr[0];
        requestBlock.url = substr[1];
        history.push(HistoryLine.URL_METHOD);

      } else if(isHeaderLine(history, sanitizedLine)) {
        const substr = line.split(':');
        requestBlock.headers.set(substr[0], substr[1]);
        history.push(HistoryLine.HEADER)

      } else if(isBodyLine(history, sanitizedLine)) {
        requestBlock.body += sanitizedLine
        history.push(HistoryLine.BODY);
      }

      if (isEndOfRequestBlock(sanitizedLine) || lineNumber === splitLines.length - 1) {
        requests.push(requestBlock);
        requestBlock = {
          method: '',
          url: '',
          headers: new Map(),
          body: '',
        };
      }
    }

    return requests;
  }
}
