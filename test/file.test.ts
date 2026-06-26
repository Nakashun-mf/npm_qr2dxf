import { describe, it, expect, afterEach } from 'vitest';
import { generateQRDxfFile } from '../src/index';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('generateQRDxfFile', () => {
  const tmpPath = join(tmpdir(), `qr-test-${Date.now()}.dxf`);

  afterEach(async () => {
    await unlink(tmpPath).catch(() => {});
  });

  it('writes a valid DXF file to disk', async () => {
    await generateQRDxfFile('https://example.com', tmpPath);
    const content = await readFile(tmpPath, 'utf-8');
    expect(content).toContain('SECTION');
    expect(content).toContain('ENTITIES');
    expect(content).toContain('EOF');
  });

  it('overwrites an existing file', async () => {
    await generateQRDxfFile('first', tmpPath);
    await generateQRDxfFile('second', tmpPath);
    const content = await readFile(tmpPath, 'utf-8');
    expect(content).toContain('EOF');
  });

  it('throws when directory does not exist', async () => {
    const badPath = '/nonexistent/dir/output.dxf';
    await expect(generateQRDxfFile('test', badPath)).rejects.toThrow();
  });

  it('passes options through to DXF generation', async () => {
    await generateQRDxfFile('test', tmpPath, { entity: 'HATCH', layer: 'MY_LAYER' });
    const content = await readFile(tmpPath, 'utf-8');
    expect(content).toContain('HATCH');
    expect(content).toContain('MY_LAYER');
  });
});
