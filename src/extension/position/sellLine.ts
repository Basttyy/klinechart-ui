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

import { OverlayTemplate, CircleAttrs, TextAttrs, LineAttrs, Figure, Coordinate, Bounding, utils } from 'klinecharts'

import { currenttick } from '../../store/tickStore'

type lineobj = { 'lines': LineAttrs[], 'texts': TextAttrs[] }

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
function getParallelLines (coordinates: Coordinate[], bounding: Bounding): lineobj {
  const lines: LineAttrs[] = []
  const texts: TextAttrs[] = []
  let data: lineobj = { 'lines': lines, 'texts': texts }
  if (coordinates.length > 0) {
      const startX = 0
      const endX = bounding.width
      data.lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })
      data.texts.push({ x: endX - utils.calcTextWidth('sell '), y: coordinates[0].y, text: 'sell', baseline: 'bottom' })
  }
  return data
}

const sellLine: OverlayTemplate = {
  name: 'sellLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, }) => {
    const parallel = getParallelLines(coordinates, bounding)
    return [
      {
        type: 'line',
        attrs: parallel.lines,
        styles: {
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1,
          color: '#fb7b50'
        }
      },
      {
        type: 'text',
        attrs: parallel.texts,
        // isCheckEvent: false,
        styles: {
          color: '#fb7b50'
        }
      }
    ]
  }
}

export default sellLine