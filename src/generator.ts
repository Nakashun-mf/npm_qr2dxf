import QRCode from 'qrcode';

export interface QRMatrix {
  matrix: boolean[][];
  size: number;
}

export async function generateQRMatrix(
  content: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M'
): Promise<QRMatrix> {
  if (!content) throw new Error('content must not be empty');

  const qrData = await QRCode.create(content, { errorCorrectionLevel });
  const size = qrData.modules.size;
  // modules.data is a flat row-major array where non-zero = dark cell
  const data = qrData.modules.data as unknown as Uint8ClampedArray;

  const matrix: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    matrix.push([]);
    for (let col = 0; col < size; col++) {
      matrix[row].push(data[row * size + col] !== 0);
    }
  }

  return { matrix, size };
}
