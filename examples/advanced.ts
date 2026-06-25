import { generateQRDxfFile } from '../src/index';

async function main() {
  // 2mm cells, high error correction, custom layer, HATCH fill
  await generateQRDxfFile('https://github.com/Nakashun-mf/qr-to-dxf', './qr_hatch.dxf', {
    cellSize: 2.0,
    errorCorrectionLevel: 'H',
    margin: 4,
    layer: 'QR_CODE',
    entity: 'HATCH',
  });
  console.log('Saved qr_hatch.dxf');

  // LWPOLYLINE for vector cutting
  await generateQRDxfFile('https://github.com/Nakashun-mf/qr-to-dxf', './qr_polyline.dxf', {
    cellSize: 1.5,
    errorCorrectionLevel: 'M',
    margin: 4,
    layer: 'CUT',
    entity: 'LWPOLYLINE',
  });
  console.log('Saved qr_polyline.dxf');

  // Default SOLID (3DFACE) for maximum compatibility
  await generateQRDxfFile('https://github.com/Nakashun-mf/qr-to-dxf', './qr_solid.dxf', {
    cellSize: 1.0,
    errorCorrectionLevel: 'M',
    margin: 4,
    layer: 'ENGRAVE',
    entity: 'SOLID',
  });
  console.log('Saved qr_solid.dxf');
}

main().catch(console.error);
