import {
  DxfWriter,
  point2d,
  point3d,
  HatchBoundaryPaths,
  HatchPolylineBoundary,
  HatchPredefinedPatterns,
  LWPolylineFlags,
  pattern,
  vertex,
} from '@tarikjabiri/dxf';
import type { QRDxfOptions } from './types.js';

const DEFAULTS = {
  cellSize: 1.0,
  margin: 4,
  layer: '0',
  entity: 'SOLID' as const,
} as const;

const INVALID_LAYER_CHARS = /[<>/\\":;?*|=']/;

export function matrixToDxf(
  matrix: boolean[][],
  options: QRDxfOptions = {}
): string {
  const size = matrix.length;
  const cellSize = options.cellSize ?? DEFAULTS.cellSize;
  const margin = options.margin ?? DEFAULTS.margin;
  const layerName = options.layer ?? DEFAULTS.layer;
  const entityType = options.entity ?? DEFAULTS.entity;

  if (!Number.isFinite(cellSize) || cellSize <= 0) {
    throw new RangeError(`cellSize must be a positive finite number, got ${cellSize}`);
  }
  if (!Number.isFinite(margin) || margin < 0) {
    throw new RangeError(`margin must be a non-negative finite number, got ${margin}`);
  }
  if (margin < 4) {
    console.warn(
      `[qr-to-dxf] margin=${margin} is below the QR spec minimum of 4 (ISO/IEC 18004). ` +
        `The generated QR code may not be scannable.`
    );
  }
  if (layerName.length > 255 || INVALID_LAYER_CHARS.test(layerName)) {
    throw new Error(`Invalid DXF layer name: "${layerName}"`);
  }

  const dxf = new DxfWriter();

  if (layerName !== '0') {
    dxf.addLayer(layerName, 7, 'Continuous');
  }

  const opts = { layerName };

  if (entityType === 'SOLID') {
    writeSolid(dxf, matrix, size, cellSize, margin, opts);
  } else if (entityType === 'HATCH') {
    writeHatch(dxf, matrix, size, cellSize, margin, opts);
  } else {
    writeLwPolyline(dxf, matrix, size, cellSize, margin, opts);
  }

  return dxf.stringify();
}

function cellCoords(
  row: number,
  col: number,
  size: number,
  cellSize: number,
  margin: number
): { x: number; y: number } {
  return {
    x: (col + margin) * cellSize,
    y: (size - 1 - row + margin) * cellSize,
  };
}

function writeSolid(
  dxf: DxfWriter,
  matrix: boolean[][],
  size: number,
  cellSize: number,
  margin: number,
  opts: { layerName: string }
): void {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!matrix[row][col]) continue;
      const { x, y } = cellCoords(row, col, size, cellSize, margin);
      const cs = cellSize;
      // 3DFACE entity: four corners of a filled quadrilateral
      dxf.add3dFace(
        point3d(x, y),
        point3d(x + cs, y),
        point3d(x, y + cs),
        point3d(x + cs, y + cs),
        opts
      );
    }
  }
}

function writeHatch(
  dxf: DxfWriter,
  matrix: boolean[][],
  size: number,
  cellSize: number,
  margin: number,
  opts: { layerName: string }
): void {
  const bp = new HatchBoundaryPaths();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!matrix[row][col]) continue;
      const { x, y } = cellCoords(row, col, size, cellSize, margin);
      const cs = cellSize;
      const poly = new HatchPolylineBoundary([
        vertex(x, y),
        vertex(x + cs, y),
        vertex(x + cs, y + cs),
        vertex(x, y + cs),
      ]);
      bp.addPolylineBoundary(poly);
    }
  }

  dxf.addHatch(bp, pattern({ name: HatchPredefinedPatterns.SOLID }), opts);
}

function writeLwPolyline(
  dxf: DxfWriter,
  matrix: boolean[][],
  size: number,
  cellSize: number,
  margin: number,
  opts: { layerName: string }
): void {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!matrix[row][col]) continue;
      const { x, y } = cellCoords(row, col, size, cellSize, margin);
      const cs = cellSize;
      dxf.addRectangle(point2d(x, y + cs), point2d(x + cs, y), {
        ...opts,
        flags: LWPolylineFlags.Closed,
      });
    }
  }
}
