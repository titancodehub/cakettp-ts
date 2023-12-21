import { END_BLOCK, HTTP_METHOD } from "./regex";
export enum HistoryLine {
  URL_METHOD = 'URL_METHOD',
  HEADER = 'HEADER',
  BODY = 'BODY',
  EMPTY_LINE = 'EMPTY_LINE',
}

function getLastElement<T>(arr: T[]): T | undefined {
  const length = arr.length;
  if (length === 0) {
    return undefined;
  }
  return arr[length - 1];
}

export function isUrlLine(line: string): boolean {
  const re = new RegExp(HTTP_METHOD,'i');
  return re.test(line);
}

export function isHeaderLine(historyLine: HistoryLine[], line: string): boolean {
  const h = getLastElement(historyLine);
  return (h === HistoryLine.URL_METHOD || h === HistoryLine.HEADER) && line !== '';
}

export function isBodyLine(historyLine: HistoryLine[], line: string) : boolean {
  const h = getLastElement(historyLine);
  return (h === HistoryLine.HEADER || h === HistoryLine.BODY);
}

export function isEndOfRequestBlock(line: string) : boolean {
  return line === END_BLOCK;
}
