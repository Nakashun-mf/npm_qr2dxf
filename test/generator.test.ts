import { describe, it, expect } from 'vitest';
import { generateQRMatrix } from '../src/generator';

describe('generateQRMatrix', () => {
  it('returns a square boolean matrix', async () => {
    const { matrix, size } = await generateQRMatrix('https://example.com');
    expect(matrix).toHaveLength(size);
    expect(matrix[0]).toHaveLength(size);
    expect(typeof matrix[0][0]).toBe('boolean');
  });

  it('throws on empty content', async () => {
    await expect(generateQRMatrix('')).rejects.toThrow('content must not be empty');
  });

  it('respects errorCorrectionLevel', async () => {
    const low = await generateQRMatrix('test', 'L');
    const high = await generateQRMatrix('test', 'H');
    // Higher correction level produces same or larger QR code
    expect(high.size).toBeGreaterThanOrEqual(low.size);
  });

  it('matrix contains dark and light cells', async () => {
    const { matrix, size } = await generateQRMatrix('hello');
    const darkCells = matrix.flat().filter(Boolean).length;
    expect(darkCells).toBeGreaterThan(0);
    expect(darkCells).toBeLessThan(size * size);
  });

  it('handles URL content', async () => {
    const { matrix, size } = await generateQRMatrix('https://github.com/Nakashun-mf/qr-to-dxf');
    expect(size).toBeGreaterThan(20);
  });
});
