import { writeFile } from 'fs/promises';
import { generateQRMatrix } from './generator.js';
import { matrixToDxf } from './dxf-writer.js';
import type { QRDxfOptions, GenerateQRDxf, GenerateQRDxfFile } from './types.js';

export type { QRDxfOptions, GenerateQRDxf, GenerateQRDxfFile };

export const generateQRDxf: GenerateQRDxf = async (content, options = {}) => {
  const ecLevel = options.errorCorrectionLevel ?? 'M';
  const { matrix, size } = await generateQRMatrix(content, ecLevel);
  return matrixToDxf(matrix, size, options);
};

export const generateQRDxfFile: GenerateQRDxfFile = async (
  content,
  outputPath,
  options = {}
) => {
  const dxf = await generateQRDxf(content, options);
  await writeFile(outputPath, dxf, 'utf-8');
};
