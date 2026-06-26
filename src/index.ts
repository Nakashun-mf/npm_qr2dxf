import { writeFile } from 'fs/promises';
import { generateQRMatrix } from './generator.js';
import { matrixToDxf } from './dxf-writer.js';
import type { QRDxfOptions, GenerateQRDxf, GenerateQRDxfFile } from './types.js';

export type { QRDxfOptions, GenerateQRDxf, GenerateQRDxfFile };

export const generateQRDxf: GenerateQRDxf = async (content, options = {}) => {
  const ecLevel = options.errorCorrectionLevel ?? 'M';
  const { matrix } = await generateQRMatrix(content, ecLevel);
  return matrixToDxf(matrix, options);
};

/**
 * Write a QR code as a DXF file to disk.
 * @remarks **Node.js only** — uses `fs/promises`. Not available in browser environments.
 * For browser use, call `generateQRDxf` and handle the DXF string yourself.
 */
export const generateQRDxfFile: GenerateQRDxfFile = async (
  content,
  outputPath,
  options = {}
) => {
  const dxf = await generateQRDxf(content, options);
  await writeFile(outputPath, dxf, 'utf-8');
};
