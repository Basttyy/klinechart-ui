/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { OverlayTemplate, CircleAttrs, TextAttrs, LineAttrs, Figure, Coordinate, Bounding } from 'klinecharts'

import { formatThousands, getLinearSlopeIntercept } from '../utils'

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
function getParallelLines (coordinates: Coordinate[], bounding: Bounding, extendParallelLineCount?: number, canSlope: boolean = false): LineAttrs[] {
  const count = extendParallelLineCount ?? 0
  const lines: LineAttrs[] = []
  if (coordinates.length > 0) {
      const startX = 0
      const endX = bounding.width
      lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })
      if (coordinates.length > 1) {
        lines.push({ coordinates: [{ x: startX, y: coordinates[1].y }, { x: endX, y: coordinates[1].y }] })
        if (coordinates.length > 2) {
          lines.push({ coordinates: [{ x: startX, y: coordinates[2].y }, { x: endX, y: coordinates[2].y }] })
        }
      }
  }
  return lines
}

const positionLine: OverlayTemplate = {
  name: 'positionLine',
  totalStep: 4,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding }) => {
    return [
      {
        type: 'line',
        attrs: getParallelLines(coordinates, bounding, 1),
        styles: {
          style: 'dashed',
          color: 'green'
        }
      }
    ]
  }
}

export default positionLine