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

import { OverlayTemplate, CircleAttrs, TextAttrs, LineAttrs, Figure, Coordinate, Bounding, utils, Overlay, Point } from '@basttyy/klinecharts'
import { useOrder, setOrderList, orderList } from '../../../store/positionStore'
import { currenttick } from '../../../store/tickStore'
import { instanceapi } from '../../../ChartProComponent'
import { OrderInfo } from '../../../types'
import { sellStyle } from '../../../store/overlaystyle/positionStyleStore'
import { useOverlaySettings } from '../../../store/overlaySettingStore'
import { createSignal } from 'solid-js'

const [ isDrawing, setIsDrawing ] = createSignal(false)

const sellLimitLine: OverlayTemplate = {
  name: 'sellLimitLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    let text = useOrder().calcPL(overlay.points[0].value!, precision.price, true)
    if (overlay.points[0].value! <= currenttick()?.close! || (!isDrawing() && overlay.points[1].value! <= currenttick()?.high!)) {
      useOrder().triggerPending(overlay, 'sell')
    }
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: 0, y: coordinates[0].y }, { x: bounding.width, y: coordinates[0].y }] },
        styles: sellStyle().lineStyle,
        ignoreEvent: true
      },
      {
        type: 'text',
        attrs: { x: bounding.width, y: coordinates[0].y, text: `sellLimit | ${text}` ?? '', align: 'right', baseline: 'middle' },
        styles: sellStyle().labelStyle
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
    return { type: 'text', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: sellStyle().labelStyle }
  },
  onPressedMoving: (event): boolean => {
    setIsDrawing(true)
    let coordinate: Partial<Coordinate>[] = [
      {x: event.x, y: event.y}
    ]
    const points = instanceapi()?.convertFromPixel(coordinate, {
      paneId: event.overlay.paneId
    })
    
    if ((points as Partial<Point>[])[0].value! > currenttick()?.close!) {
      const res = useOrder().updateEntryPointAndReturnValue(event, points)
      if(res) event.overlay.points[0].value = res
    }
    return true
  },
  onPressedMoveEnd: (event): boolean => {
    setIsDrawing(false)
    useOrder().updatePositionOrder(event)
    return false
  },
  onRightClick: (event): boolean => {
    useOverlaySettings().singlePopup(event, 'sell')
    return true
  }
}

export default sellLimitLine