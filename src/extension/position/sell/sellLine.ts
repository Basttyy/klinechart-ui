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

import { OverlayTemplate, utils } from 'klinecharts'
import { orderList, setOrderList, useOrder } from '../../../store/positionStore'
import { OrderInfo } from '../../../types'
import { symbol } from '../../../ChartProComponent'
import { sellStyle } from '../../../store/overlayStyleStore'
import { useOverlaySetting } from '../../../store/overlaySettingStore'

const sellLine: OverlayTemplate = {
  name: 'sellLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    let text = useOrder().calcPL(overlay.points[0].value!, precision.price, true, 'sell')
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
        styles: {
          style: 'dashed',
          dashedValue: [4, 4],
          size: 1,
          color: sellStyle().backgroundColor
        },
        ignoreEvent: true
      },
      {
        type: 'rectText',
        attrs: { x: bounding.width, y: coordinates[0].y, text: `sell | ${text}` ?? '', align: 'right', baseline: 'middle' },
        styles: sellStyle(),
        ignoreEvent: true
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
    return { type: 'rectText', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: sellStyle() }
  },
  onRightClick: (event): boolean => {
    // useOrder().closeOrder(event.overlay, 'manualclose')    //TODO: if the user doesn't enable one-click trading then we should alert the user before closing
    //the overlay represented an order that does not exist on our pool, it should be handled here
    useOverlaySetting().singlePopup(event, 'sell')
    return true
  }
}

export default sellLine