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

import { OverlayTemplate, TextAttrs, LineAttrs, Coordinate, Bounding, utils } from 'klinecharts'

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
      const startX = 0
      const endX = bounding.width
  if (coordinates.length > 0) {
      data.lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })
      data.texts.push({ x: endX - utils.calcTextWidth('buy '), y: coordinates[0].y, text: 'buy', baseline: 'bottom' })
  }
  if (coordinates.length > 1) {
    data.lines.push({ coordinates: [{ x: startX, y: coordinates[1].y }, { x: endX, y: coordinates[1].y }] })
    data.texts.push({ x: endX - utils.calcTextWidth('sl '), y: coordinates[1].y, text: 'sl', baseline: 'bottom' })
  }
  return data
}

const buyLossLine: OverlayTemplate = {
  name: 'buyLossLine',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, xAxis, yAxis }) => {
    const parallel = getParallelLines(coordinates, bounding)
    return [
      {
        type: 'line',
        attrs: parallel.lines,
        styles: {
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1,
          color: '#00698b'
        }
      },
      {
        type: 'text',
        attrs: parallel.texts,
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
    let text, text2
    // if (utils.isValid(overlay.extendData)) {
    //   if (!utils.isFunction(overlay.extendData)) {
    //     text = overlay.extendData ?? ''
    //   } else {
    //     text = overlay.extendData(overlay)
    //   }
    // }
    if (!utils.isValid(text) && overlay.points[0].value !== undefined) {
      text = utils.formatPrecision(overlay.points[0].value, precision.price)
    }
    if (!utils.isValid(text2) && overlay.points[1].value !== undefined) {
      text2 = utils.formatPrecision(overlay.points[1].value, precision.price)
    }
    return [
      {
        type: 'rectText',
        attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' },
        styles: { color: 'white', backgroundColor: '#00698b' },
      },
      {
        type: 'rectText',
        attrs: { x, y: coordinates[1].y, text: text2 ?? '', align: textAlign, baseline: 'middle' },
        styles: { color: 'white', backgroundColor: '#00698b' },
      }
    ]
  },
  performEventMoveForDrawing({currentStep, points, performPoint, performPointIndex}) {
    console.log('event move for drawing') 
    console.log(points)
    console.log(performPoint)
    console.log(currentStep)
    console.log(performPointIndex)
  },
  performEventPressedMove({points, performPoint, currentStep, mode, performPointIndex}) {
    // console.log(points)
    // console.log(performPoint)
    // console.log(currentStep)
    // console.log(performPointIndex)
    console.log('event pressed move')
  },
  onDrawStart: (event): boolean => {
    console.log('on draw start')
    console.log(event)
    return true
  },
  onDrawing: (event): boolean => {
    console.log('on drawing')
    // console.log(event)
    return true
  },
  onDrawEnd: (event): boolean => {
    console.log('on draw end')
    // console.log(event)
    return true
  },
  onPressedMoveStart: (event): boolean => {
    console.log('on pressed move start')
    // console.log(event)
    return true
  },
  onPressedMoving: (event): boolean => {
    console.log('on pressed moving')
    const point = utils
    // console.log(event)
    
    // event.overlay.createPointFigures: { overlay, coordinates, bounding, xAxis, yAxis } => {

    // }
    // event.overlay.performEventMoveForDrawing!({
    //   currentStep: 3,
    //   mode: event.overlay.mode,
    //   points: [],
    //   performPointIndex: event.overlay.,
    //   performPoint: event. 
    // })
    return true
  },
  onPressedMoveEnd: (event): boolean => {
    console.log('on pressed move end')
    // console.log(event)
    return true
  }
}

export default buyLossLine