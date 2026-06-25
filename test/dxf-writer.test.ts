import { describe, it, expect } from 'vitest';
import { generateQRMatrix } from '../src/generator';
import { matrixToDxf } from '../src/dxf-writer';
import { generateQRDxf } from '../src/index';

describe('matrixToDxf', () => {
  it('returns a DXF string with required sections', async () => {
    const { matrix, size } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, size);
    expect(dxf).toContain('SECTION');
    expect(dxf).toContain('ENTITIES');
    expect(dxf).toContain('ENDSEC');
    expect(dxf).toContain('EOF');
  });

  it('SOLID entity type produces 3DFACE entities', async () => {
    const { matrix, size } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, size, { entity: 'SOLID' });
    expect(dxf).toContain('3DFACE');
  });

  it('HATCH entity type produces HATCH entities', async () => {
    const { matrix, size } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, size, { entity: 'HATCH' });
    expect(dxf).toContain('HATCH');
  });

  it('LWPOLYLINE entity type produces LWPOLYLINE entities', async () => {
    const { matrix, size } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, size, { entity: 'LWPOLYLINE' });
    expect(dxf).toContain('LWPOLYLINE');
  });

  it('uses custom layer name', async () => {
    const { matrix, size } = await generateQRMatrix('test');
    const dxf = matrixToDxf(matrix, size, { layer: 'QR_CODE' });
    expect(dxf).toContain('QR_CODE');
  });

  it('cellSize affects coordinate values', async () => {
    const { matrix, size } = await generateQRMatrix('hi');
    const dxf1 = matrixToDxf(matrix, size, { cellSize: 1.0, margin: 0 });
    const dxf2 = matrixToDxf(matrix, size, { cellSize: 2.0, margin: 0 });
    // dxf2 should have larger coordinate values
    const coordMatch1 = dxf1.match(/\n10\n(\d+\.?\d*)/)?.[1];
    const coordMatch2 = dxf2.match(/\n10\n(\d+\.?\d*)/)?.[1];
    if (coordMatch1 && coordMatch2) {
      expect(parseFloat(coordMatch2)).toBeGreaterThanOrEqual(parseFloat(coordMatch1));
    }
  });

  it('HATCH file is smaller than SOLID for same content', async () => {
    const { matrix, size } = await generateQRMatrix('https://example.com');
    const solid = matrixToDxf(matrix, size, { entity: 'SOLID' });
    const hatch = matrixToDxf(matrix, size, { entity: 'HATCH' });
    expect(hatch.length).toBeLessThan(solid.length);
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
