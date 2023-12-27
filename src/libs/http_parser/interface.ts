import { Test } from "../testtool";

export type Environment = Map<string, string>;
export type Metadata = Map<string, string>;

export interface RequestBlock {
    name: string;
    method: string;
    url: string;
    headers: Map<string, string>;
    body: string;
    test?: Test;
}
