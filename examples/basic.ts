import { generateQRDxf, generateQRDxfFile } from '../src/index';

async function main() {
  // Generate DXF string
  const dxf = await generateQRDxf('https://example.com');
  console.log('DXF generated, length:', dxf.length);

  // Write to file
  await generateQRDxfFile('https://example.com', './output.dxf');
  console.log('Saved to output.dxf');
}

main().catch(console.error);
