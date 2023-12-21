export type Environment = Map<string, string>;
export type Metadata = Map<string, string>;

export interface RequestBlock {
    method: string;
    url: string;
    headers: Map<string, string>;
    body: string;
}
