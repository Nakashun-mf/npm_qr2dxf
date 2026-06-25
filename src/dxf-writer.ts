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
  errorCorrectionLevel: 'M' as const,
  margin: 4,
  layer: '0',
  entity: 'SOLID' as const,
};

export function matrixToDxf(
  matrix: boolean[][],
  size: number,
  options: QRDxfOptions = {}
): string {
  const cellSize = options.cellSize ?? DEFAULTS.cellSize;
  const margin = options.margin ?? DEFAULTS.margin;
  const layerName = options.layer ?? DEFAULTS.layer;
  const entityType = options.entity ?? DEFAULTS.entity;

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
