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
import { currenttick } from '../../store/tickStore'

type lineobj = { 'lines': LineAttrs[], 'texts': TextAttrs[] }

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
function getParallelLines (coordinates: Coordinate[], bounding: Bounding, extendParallelLineCount?: number, canSlope: boolean = false): lineobj {
  const count = extendParallelLineCount ?? 0
  const lines: LineAttrs[] = []
  const texts: TextAttrs[] = []
  let data: lineobj = { 'lines': lines, 'texts': texts }
  if (coordinates.length > 0) {
      const startX = 0
      const endX = bounding.width
      data.lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })
      data.texts.push({ x: endX - endX*0.0027*5, y: coordinates[0].y, text: 'entry', baseline: 'bottom' })
      if (coordinates.length > 1) {
        data.lines.push({ coordinates: [{ x: startX, y: coordinates[1].y }, { x: endX, y: coordinates[1].y }] })
        data.texts.push({ x: endX - endX*0.0027*2, y: coordinates[1].y, text: 'sl', baseline: 'bottom' })
        if (coordinates.length > 2) {
          data.lines.push({ coordinates: [{ x: startX, y: coordinates[2].y }, { x: endX, y: coordinates[2].y }] })
          data.texts.push({ x: endX - endX*0.0027*11, y: coordinates[2].y, text: 'tp', baseline: 'bottom' })
        }
      }
  }
  return data
}

const positionLine: OverlayTemplate = {
  name: 'positionLine',
  totalStep: 4,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, }) => {
    console.log(`hello from overlay ${overlay.id} and ${currenttick()?.close}`)
    const parallel = getParallelLines(coordinates, bounding, 1)
    return [
      {
        type: 'line',
        attrs: parallel.lines,
        styles: {
          style: 'dashed',
          color: 'green'
        }
      },
      {
        type: 'text',
        attrs: parallel.texts,
        // isCheckEvent: false,
        styles: {
          color: 'green'
        }
      }
    ]
  }
}

export default positionLine