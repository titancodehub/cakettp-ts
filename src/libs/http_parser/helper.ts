import { TEST_START, TEST_DESC, TEST_END, END_BLOCK, HTTP_METHOD, REQUEST_NAME_BLOCK, TEST_CONTENT } from "./regex";
export enum RecordType {
  URL_METHOD = 'URL_METHOD',
  HEADER = 'HEADER',
  BODY = 'BODY',
  EMPTY_LINE = 'EMPTY_LINE',
  REQUEST_NAME = 'REQUEST_NAME',
  TEST_START = 'TEST_START',
  TEST_DESC = 'TEST_DESC',
  TEST_END = 'TEST_END',
  TEST_CONTENT = 'TEST_CONTENT',
}

export interface History {
  type: RecordType,
  metadata?: Map<string, any>,
}

export function getPreviousHistory(arr: History[], idx=1): History | undefined {
  const length = arr.length;
  if (length === 0) {
    return undefined;
  }
  return arr[length - idx];
}

export function isUrlLine(line: string): boolean {
  const re = new RegExp(HTTP_METHOD,'i');
  return re.test(line);
}

export function isHeaderLine(history: History[], line: string): boolean {
  const h = getPreviousHistory(history);
  return h !== undefined && (h.type === RecordType.URL_METHOD || h.type === RecordType.HEADER) && line !== '';
}

export function isBodyLine(history: History[]) : boolean {
  const h = getPreviousHistory(history);
  const h_2 = getPreviousHistory(history, 2)

  return (
    h !== undefined &&
    // check if 2 line before are not undefined
    h_2 !== undefined &&
    ((h_2.type === RecordType.HEADER && h.type=== RecordType.EMPTY_LINE) || h.type === RecordType.BODY)
  )
}

export function isEndOfRequestBlock(line: string) : boolean {
  const re = new RegExp(END_BLOCK);
  return re.test(line);
}

export function isRequestNameLine(line: string): boolean {
  const re = new RegExp(REQUEST_NAME_BLOCK);
  return re.test(line);
}

export function isTestStart(line: string): boolean {
  const re = new RegExp(TEST_START);
  return re.test(line);
}

export function isTestDesc(history: History[], line: string): boolean {
  const re = new RegExp(TEST_DESC);
  const match = re.test(line);
  const h = getPreviousHistory(history);
  return h !== undefined && (h.type === RecordType.TEST_START && match);
}

export function isTestContent(history: History[], line: string): boolean {
  const re = new RegExp(TEST_CONTENT);
  const h = getPreviousHistory(history);
  return h !== undefined && (h.type === RecordType.TEST_DESC || h.type === RecordType.TEST_CONTENT) && re.test(line);
}

export function isTestEnd(line: string): boolean {
  const re = new RegExp(TEST_END);
  return re.test(line);
}