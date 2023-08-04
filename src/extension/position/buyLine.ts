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

import { OverlayTemplate, CircleAttrs, TextAttrs, LineAttrs, Figure, Coordinate, Bounding, utils, Overlay } from 'klinecharts'

import { currenttick } from '../../store/tickStore'
import { instanceapi } from '../../ChartProComponent'

type lineobj = { 'lines': LineAttrs[], 'texts': TextAttrs[] }

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param extendParallelLineCount
 * @returns {Array}
 */
function getParallelLines (coordinates: Coordinate[], bounding: Bounding, overlay: Overlay): lineobj {
  const lines: LineAttrs[] = []
  const texts: TextAttrs[] = []
  let data: lineobj = { 'lines': lines, 'texts': texts }
  if (coordinates.length > 0) {
      const startX = 0
      const endX = bounding.width
      data.lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })
      data.texts.push({ x: endX - utils.calcTextWidth('buy '), y: coordinates[0].y, text: 'buy', baseline: 'bottom' })
      // overlay.currentStep = 1
  }
  return data
}

const buyLine: OverlayTemplate = {
  name: 'buyLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, }) => {
    // console.log(`overlay ${overlay.id} with x: ${coordinates[0].x} and y: ${coordinates[0].y} , with time: ${overlay.points[0].timestamp} and price: ${overlay.points[0].value}`)
    // const parallel = getParallelLines(coordinates, bounding, overlay)
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: 0, y: coordinates[0].y }, { x: bounding.width, y: coordinates[0].y }] },
        styles: {
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1,
          color: '#00698b'
        },
        ignoreEvent: true
      },
      {
        type: 'text',
        attrs: { x: bounding.width - utils.calcTextWidth('buy '), y: coordinates[0].y, text: 'buy', baseline: 'bottom' },
        // isCheckEvent: false,
        styles: {
          color: '#00698b'
        }
      }
    ]
  },
  createYAxisFigures: ({ overlay, coordinates, bounding, yAxis, precision }) => {
    const isFromZero = yAxis?.isFromZero() ?? false
    let textAlign: CanvasTextAlign
    let x: number
    if (isFromZero) {
      textAlign = 'left'
      x = 0
    } else {
      textAlign = 'right'
      x = bounding.width
    }
    let text
    if (utils.isValid(overlay.extendData)) {
      if (!utils.isFunction(overlay.extendData)) {
        text = overlay.extendData ?? ''
      } else {
        text = overlay.extendData(overlay)
      }
    }
    if (!utils.isValid(text) && overlay.points[0].value !== undefined) {
      text = utils.formatPrecision(overlay.points[0].value, precision.price)
    }
    return { type: 'rectText', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: { color: 'white', backgroundColor: '#00698b' } }
  }
}

export default buyLine