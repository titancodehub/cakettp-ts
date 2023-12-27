import fs from 'fs';
import { History, isTestDesc, isTestStart, isTestContent, isTestEnd , isBodyLine, isEndOfRequestBlock, isHeaderLine, isRequestNameLine, isUrlLine, RecordType, getPreviousHistory } from './helper';
import { RequestBlock } from './interface';
import { Expect, Test } from '../testtool';

export class HttpParser {
  parse(path: string) : RequestBlock[]{
    const rawtext =  fs.readFileSync(path);
    const splitLines = rawtext.toString().split('\n');
    const requests: RequestBlock[] = [];
    const history : History[] =[];

    let requestBlock: RequestBlock = {
      method: '',
      url: '',
      name: '',
      headers: new Map(),
      body: '',
    };

    for (const [lineNumber, line] of splitLines.entries()) {
      const sanitizedLine = line.trim();

      if(isRequestNameLine(sanitizedLine)) {
        const substr = sanitizedLine.split(' @name ');
        requestBlock.name = substr[1];
        history.push({
          type: RecordType.REQUEST_NAME
        });
        
      } else if (isTestStart(sanitizedLine)) {
        const substr = sanitizedLine.split(' @test start ');
        requestBlock.test = new Test(substr[1]);
        history.push({type: RecordType.TEST_START});
      } else if (isTestDesc(history,sanitizedLine)) {
        const substr = sanitizedLine.split(' @test desc ');
        if (!requestBlock.test) {
          throw new Error('Failed to parse request, assertion is not set correctly. make sure you follow assertion format')
        }
        requestBlock.test!.description += ` | ${substr[1]}`;
        history.push({type: RecordType.TEST_DESC });

      } else if(isTestContent(history, sanitizedLine)) {
        if (!requestBlock.test) {
          throw new Error('Failed to parse request, assertion is not set correctly. make sure you follow assertion format')
        }
        const substr = sanitizedLine.split(' ');
        const [_, actualField, comparator, ...expectation] = substr;
        requestBlock.test!.expect.push(new Expect(actualField, comparator, expectation.join(' ')))
        history.push({type: RecordType.TEST_CONTENT });

      }else if (sanitizedLine === '') { 
        history.push({type: RecordType.EMPTY_LINE});

      } else if (isUrlLine(sanitizedLine)) {
        const substr = sanitizedLine.split(' ');
        requestBlock.method = substr[0];
        requestBlock.url = substr[1];
        history.push({type: RecordType.URL_METHOD});

      } else if(isHeaderLine(history, sanitizedLine)) {
        const substr = line.split(':');
        requestBlock.headers.set(substr[0], substr[1]);
        history.push({type: RecordType.HEADER })

      } else if(isBodyLine(history)) {
        requestBlock.body += sanitizedLine
        history.push({type: RecordType.BODY });
      }

      if (isEndOfRequestBlock(sanitizedLine) || lineNumber === splitLines.length - 1) {
        requests.push(requestBlock);
        requestBlock = {
          name: '',
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
