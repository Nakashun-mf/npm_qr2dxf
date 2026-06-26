import { describe, it, expect, vi } from 'vitest';
import { generateQRMatrix } from '../src/generator';
import { matrixToDxf } from '../src/dxf-writer';
import { generateQRDxf } from '../src/index';

describe('matrixToDxf', () => {
  it('returns a DXF string with required sections', async () => {
    const { matrix } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix);
    expect(dxf).toContain('SECTION');
    expect(dxf).toContain('ENTITIES');
    expect(dxf).toContain('ENDSEC');
    expect(dxf).toContain('EOF');
  });

  it('SOLID entity type produces 3DFACE entities', async () => {
    const { matrix } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, { entity: 'SOLID' });
    expect(dxf).toContain('3DFACE');
  });

  it('HATCH entity type produces HATCH entities', async () => {
    const { matrix } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, { entity: 'HATCH' });
    expect(dxf).toContain('HATCH');
  });

  it('LWPOLYLINE entity type produces LWPOLYLINE entities', async () => {
    const { matrix } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, { entity: 'LWPOLYLINE' });
    expect(dxf).toContain('LWPOLYLINE');
  });

  it('uses custom layer name', async () => {
    const { matrix } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, { layer: 'QR_CODE' });
    expect(dxf).toContain('QR_CODE');
  });

  it('cellSize doubles all coordinate values', async () => {
    const { matrix } = await generateQRMatrix('hi');
    const dxf1 = matrixToDxf(matrix, { cellSize: 1.0, margin: 4 });
    const dxf2 = matrixToDxf(matrix, { cellSize: 2.0, margin: 4 });
    const maxCoord = (dxf: string) =>
      Math.max(...[...dxf.matchAll(/\n1[0-3]\n([\d.]+)/g)].map(m => parseFloat(m[1])));
    const max1 = maxCoord(dxf1);
    const max2 = maxCoord(dxf2);
    expect(max1).toBeGreaterThan(0);
    expect(max2).toBeCloseTo(max1 * 2);
  });

  it('HATCH file is smaller than SOLID for same content', async () => {
    const { matrix } = await generateQRMatrix('https://example.com');
    const solid = matrixToDxf(matrix, { entity: 'SOLID' });
    const hatch = matrixToDxf(matrix, { entity: 'HATCH' });
    expect(hatch.length).toBeLessThan(solid.length);
  });

  describe('input validation', () => {
    it('throws RangeError for cellSize <= 0', async () => {
      const { matrix } = await generateQRMatrix('test');
      expect(() => matrixToDxf(matrix, { cellSize: 0 })).toThrow(RangeError);
      expect(() => matrixToDxf(matrix, { cellSize: -1 })).toThrow(RangeError);
    });

    it('throws RangeError for non-finite cellSize', async () => {
      const { matrix } = await generateQRMatrix('test');
      expect(() => matrixToDxf(matrix, { cellSize: Infinity })).toThrow(RangeError);
      expect(() => matrixToDxf(matrix, { cellSize: NaN })).toThrow(RangeError);
    });

    it('throws RangeError for negative margin', async () => {
      const { matrix } = await generateQRMatrix('test');
      expect(() => matrixToDxf(matrix, { margin: -1 })).toThrow(RangeError);
    });

    it('warns when margin is below QR spec minimum of 4', async () => {
      const { matrix } = await generateQRMatrix('test');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      matrixToDxf(matrix, { margin: 2 });
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('margin=2'));
      warn.mockRestore();
    });

    it('throws for invalid DXF layer name', async () => {
      const { matrix } = await generateQRMatrix('test');
      expect(() => matrixToDxf(matrix, { layer: 'bad/layer' })).toThrow();
      expect(() => matrixToDxf(matrix, { layer: 'no:colon' })).toThrow();
    });
  });
});

describe('generateQRDxf', () => {
  it('generates valid DXF from URL', async () => {
    const dxf = await generateQRDxf('https://example.com');
    expect(dxf).toContain('SECTION');
    expect(dxf).toContain('ENTITIES');
    expect(dxf).toContain('EOF');
  });

  it('accepts all options', async () => {
    const dxf = await generateQRDxf('test', {
      cellSize: 2.0,
      errorCorrectionLevel: 'H',
      margin: 4,
      layer: 'QR_CODE',
      entity: 'LWPOLYLINE',
    });
    expect(dxf).toContain('QR_CODE');
    expect(dxf).toContain('LWPOLYLINE');
  });

  it('throws on empty content', async () => {
    await expect(generateQRDxf('')).rejects.toThrow();
  });
});
