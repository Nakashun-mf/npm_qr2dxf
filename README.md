# qr-to-dxf

> Generate DXF files from QR codes for laser cutting, CNC machining, and engraving.

[![npm version](https://badge.fury.io/js/qr-to-dxf.svg)](https://badge.fury.io/js/qr-to-dxf)
[![CI](https://github.com/Nakashun-mf/qr-to-dxf/actions/workflows/ci.yml/badge.svg)](https://github.com/Nakashun-mf/qr-to-dxf/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

When you need to engrave or cut a QR code using a laser cutter or CNC machine, you need a DXF file. This package converts any text or URL into a ready-to-use DXF file with no manual steps.

## Install

```bash
npm install qr-to-dxf
```

## Quick Start

```typescript
import { generateQRDxf, generateQRDxfFile } from 'qr-to-dxf';

// Get DXF string
const dxf = await generateQRDxf('https://example.com');

// Write directly to file (Node.js)
await generateQRDxfFile('https://example.com', './output.dxf');
```

## Options

```typescript
const dxf = await generateQRDxf('https://example.com', {
  cellSize: 2.0,               // Cell size in mm. Default: 1.0
  errorCorrectionLevel: 'M',   // 'L' | 'M' | 'Q' | 'H'. Default: 'M'
  margin: 4,                   // Quiet zone in cells. Default: 4
  layer: 'QR_CODE',            // DXF layer name. Default: '0'
  entity: 'SOLID',             // 'SOLID' | 'HATCH' | 'LWPOLYLINE'. Default: 'SOLID'
});
```

### Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cellSize` | `number` | `1.0` | Size of each QR module in millimeters |
| `errorCorrectionLevel` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | QR error correction level |
| `margin` | `number` | `4` | Quiet zone width in cells (QR spec requires ≥4) |
| `layer` | `string` | `'0'` | DXF layer name for all entities |
| `entity` | `'SOLID' \| 'HATCH' \| 'LWPOLYLINE'` | `'SOLID'` | DXF entity type used for each dark cell |

## Output Formats

### `SOLID` (default)
Each dark cell is output as a **3DFACE entity** (filled quadrilateral). Best compatibility with CNC controllers and older CAD software.

### `HATCH`
All dark cells are combined into a single **HATCH entity** with solid fill. Produces the smallest file size, ideal when file size matters.

### `LWPOLYLINE`
Each dark cell is output as a closed **LWPOLYLINE rectangle**. Best for vector-cutting workflows where the laser traces the outline.

## Coordinate System

- **Units**: Millimeters
- **Origin**: Bottom-left (0, 0)
- **Y-axis**: Positive upward (standard CAD convention)
- **Format**: AC1021 (AutoCAD 2007+)

## TypeScript Types

```typescript
import type { QRDxfOptions, GenerateQRDxf, GenerateQRDxfFile } from 'qr-to-dxf';
```

## Tested With

- Trotec Speedy series
- Epilog laser cutters
- AutoCAD 2010+
- LightBurn
- RDWorks

## Contributing

Issues and pull requests are welcome at [GitHub](https://github.com/Nakashun-mf/qr-to-dxf).

## License

MIT © Nakashun-mf
