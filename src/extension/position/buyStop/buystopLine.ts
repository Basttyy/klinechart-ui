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

import { Coordinate, OverlayTemplate, Point, utils } from '@basttyy/klinecharts'
import { orderList, setOrderList, useOrder } from '../../../store/positionStore'
import { currenttick } from '../../../store/tickStore'
import { OrderInfo } from '../../../types'
import { instanceapi, symbol } from '../../../ChartProComponent'
import { buyStopStyle } from '../../../store/overlaystyle/positionStyleStore'
import { useOverlaySettings } from '../../../store/overlaySettingStore'
import { createSignal } from 'solid-js'

const [ isDrawing, setIsDrawing ] = createSignal(false)

const buystopLine: OverlayTemplate = {
  name: 'buystopLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    if (overlay.points[0].value! <= currenttick()?.close! || (!isDrawing() && overlay.points[1].value! <= currenttick()?.high!)) {
      useOrder().triggerPending(overlay, 'buy')
    }
    let text = useOrder().calcPL(overlay.points[0].value!, precision.price, true)
    let id = overlay.id
    let order: OrderInfo|null
    if (order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null) { // order found
      order.pips = parseFloat(text)
      order.pl = order.pips * symbol()?.dollarPerPip!
      const orderlist = orderList().map(orda => (orda.orderId === order?.orderId ? order : orda))
      setOrderList(orderlist)
    }
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: 0, y: coordinates[0].y }, { x: bounding.width, y: coordinates[0].y }] },
        styles: buyStopStyle().lineStyle,
        ignoreEvent: true
      },
      {
        type: 'text',
        attrs: { x: bounding.width, y: coordinates[0].y, text: `buystop | ${text}` ?? '', align: 'right', baseline: 'middle' },
        styles: buyStopStyle().labelStyle
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
    return { type: 'text', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: buyStopStyle().labelStyle }
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
    useOrder().updatePositionOrder(event)
    setIsDrawing(false)
    return false
  },
  onRightClick: (event): boolean => {
    useOverlaySettings().singlePopup(event, 'buy')
    return true
  }
}

export default buystopLine