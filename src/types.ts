export interface QRDxfOptions {
  cellSize?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  layer?: string;
  entity?: 'SOLID' | 'HATCH' | 'LWPOLYLINE';
}

export type GenerateQRDxf = (
  content: string,
  options?: QRDxfOptions
) => Promise<string>;

export type GenerateQRDxfFile = (
  content: string,
  outputPath: string,
  options?: QRDxfOptions
) => Promise<void>;
