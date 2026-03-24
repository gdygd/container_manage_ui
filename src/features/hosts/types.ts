export interface Host {
  id: number;
  host: string;
  addr: string;
}

export interface ParsedAddress {
  ip: string;
  port: string;
}
