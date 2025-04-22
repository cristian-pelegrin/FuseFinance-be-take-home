export class StockItemResponseDto {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  lastUpdated: string;
}

export class StockResponseDto {
  items: StockItemResponseDto[];
  nextToken?: string;
}