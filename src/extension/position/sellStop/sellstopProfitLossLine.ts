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

import { OverlayTemplate, TextAttrs, LineAttrs, Coordinate, Bounding, utils, Point, Overlay, Precision } from '@basttyy/klinecharts'

import { currenttick } from '../../../store/tickStore'
import { orderList, setOrderList, useOrder } from '../../../store/positionStore'
import { OrderInfo } from '../../../types'
import { instanceapi, symbol } from '../../../ChartProComponent'
import { sellStyle, stopLossStyle, takeProfitStyle } from '../../../store/overlayStyleStore'
import { userOrderSettings } from '../../../store/overlaySettingStore'

type lineobj = { 'lines': LineAttrs[], 'recttexts': rectText[] }
type rectText = { x: number, y: number, text: string, align: CanvasTextAlign, baseline: CanvasTextBaseline }

/**
 * 获取平行线
 * @param coordinates
 * @param bounding
 * @param overlay
 * @param precision
 * @returns {Array}
 */
function getParallelLines (coordinates: Coordinate[], bounding: Bounding, overlay: Overlay, precision: Precision): lineobj {
  const lines: LineAttrs[] = []
  const recttext: rectText[] = []
  let text
  let data: lineobj = { 'lines': lines, 'recttexts': recttext }
  const startX = 0
  const endX = bounding.width

  if (coordinates.length > 0) {
      data.lines.push({ coordinates: [{ x: startX, y: coordinates[0].y }, { x: endX, y: coordinates[0].y }] })

      text = useOrder().calcPL(overlay.points[0].value!, precision.price, true, 'sell')
      data.recttexts.push({ x: endX, y: coordinates[0].y, text: `sellstop | ${text}` ?? '', align: 'right', baseline: 'middle' })
  }
  if (coordinates.length > 1) {
    data.lines.push({ coordinates: [{ x: startX, y: coordinates[1].y }, { x: endX, y: coordinates[1].y }] })

    text = useOrder().calcStopOrTarget(overlay.points[0].value!, overlay.points[1].value!, precision.price, true, 'sell')
    data.recttexts.push({ x: endX, y: coordinates[1].y, text: `tp | ${text}` ?? '', align: 'right', baseline: 'middle' })
  }
  if (coordinates.length > 2) {
    data.lines.push({ coordinates: [{ x: startX, y: coordinates[1].y }, { x: endX, y: coordinates[1].y }] })

    text = useOrder().calcStopOrTarget(overlay.points[0].value!, overlay.points[1].value!, precision.price, true, 'sell')
    data.recttexts.push({ x: endX, y: coordinates[1].y, text: `sl | ${text}` ?? '', align: 'right', baseline: 'middle' })
  }
  return data
}

const sellstopProfitLossLine: OverlayTemplate = {
  name: 'sellstopProfitLossLine',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    if (overlay.points[0].value! >= currenttick()?.close! || overlay.points[0].value! >= currenttick()?.high!) {
      useOrder().triggerPending(overlay, 'sell')
    }
    const parallel = getParallelLines(coordinates, bounding, overlay, precision)
    return [
      {
        type: 'line',
        attrs: parallel.lines,
        styles: [
          sellStyle().lineStyle,
          takeProfitStyle().lineStyle,
          stopLossStyle().lineStyle
        ],
      },
      {
        type: 'text',
        attrs: parallel.recttexts,
        styles: [
          sellStyle().labelStyle,
          takeProfitStyle().labelStyle,
          stopLossStyle().labelStyle
        ]
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
    let text, text2, text3

    if (!utils.isValid(text) && overlay.points[0].value !== undefined) {
      text = utils.formatPrecision(overlay.points[0].value, precision.price)
    }
    if (!utils.isValid(text2) && overlay.points[1].value !== undefined) {
      text2 = utils.formatPrecision(overlay.points[1].value, precision.price)
    }
    if (!utils.isValid(text3) && overlay.points[2].value !== undefined) {
      text3 = utils.formatPrecision(overlay.points[2].value, precision.price)
    }
    return [
      {
        type: 'text',
        attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' },
        styles: sellStyle().labelStyle
      },
      {
        type: 'text',
        attrs: { x, y: coordinates[1].y, text: text2 ?? '', align: textAlign, baseline: 'middle' },
        styles: takeProfitStyle().labelStyle
      },
      {
        type: 'text',
        attrs: { x, y: coordinates[2].y, text: text3 ?? '', align: textAlign, baseline: 'middle' },
        styles: stopLossStyle().labelStyle
      }
    ]
  },
  onPressedMoving: (event): boolean => {
    let coordinate: Partial<Coordinate>[] = [
      {x: event.x, y: event.y}
    ]
    const points = instanceapi()?.convertFromPixel(coordinate, {
      paneId: event.overlay.paneId
    })
    let id = event.overlay.id
    let order: OrderInfo|null
    
    if (order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null) { // order found
      if ((points as Partial<Point>[])[0].value! > currenttick()?.close!) {
        order!.entryPoint = parseFloat( (points as Partial<Point>[])[0].value?.toFixed(instanceapi()?.getPriceVolumePrecision().price)!)
        const orderlist = orderList().map(orda => (orda.orderId === order?.orderId ? order : orda))
        setOrderList(orderlist)
        event.overlay.points[0].value = order?.entryPoint
        //the overlay represented an order that does not exist on our pool, it should be handled here
      }
      else if ((points as Partial<Point>[])[0].value! > event.overlay.points[0].value! && event.figureIndex == 1) {
        order!.takeProfit = parseFloat( (points as Partial<Point>[])[0].value?.toFixed(instanceapi()?.getPriceVolumePrecision().price)!)
        const orderlist = orderList().map(orda => (orda.orderId === order?.orderId ? order : orda))
        setOrderList(orderlist)
        event.overlay.points[1].value = order?.takeProfit
        //the overlay represented an order that does not exist on our pool, it should be handled here
      }
      if ((points as Partial<Point>[])[0].value! < event.overlay.points[0].value! && event.figureIndex == 2) {
        order!.stopLoss = parseFloat( (points as Partial<Point>[])[0].value?.toFixed(instanceapi()?.getPriceVolumePrecision().price)!)
        const orderlist = orderList().map(orda => (orda.orderId === order?.orderId ? order : orda))
        setOrderList(orderlist)
        event.overlay.points[2].value = order?.stopLoss
        //the overlay represented an order that does not exist on our pool, it should be handled here
      }
    }    
    return true
  },
  onPressedMoveEnd: (event): boolean => {
    let id = event.overlay.id
    let order: OrderInfo|null

    if (order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null) { // order found
      if (event.figureIndex === 0) {
        useOrder().updateOrder({
          id: order.orderId,
          entrypoint: order.entryPoint
        })
        return false
      } else if (event.figureIndex === 1) {
          useOrder().updateOrder({
          id: order.orderId,
          stoploss: order.takeProfit
        })
        return false
      } else if (event.figureIndex === 2) {
        useOrder().updateOrder({
          id: order.orderId,
          stoploss: order.stopLoss
        })
        return false
      }
    }
    //the overlay represented an order that does not exist on our pool, it should be handled here
    return false
  },
  onRightClick: (event): boolean => {
    userOrderSettings().profitLossPopup(event, 'sell')
    return true;
  }
}

export default sellstopProfitLossLine