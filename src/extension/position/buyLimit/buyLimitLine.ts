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

import { OverlayTemplate, CircleAttrs, TextAttrs, LineAttrs, Figure, Coordinate, Bounding, utils, Overlay, Point } from 'klinecharts'
import { useOrder } from '../../../store/positionStore'
import { currenttick } from '../../../store/tickStore'
import { instanceapi } from '../../../ChartProComponent'

const buyLimitLine: OverlayTemplate = {
  name: 'buyLimitLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    let text = useOrder().calcPL(overlay.points[0].value!, precision.price, true)
    if (overlay.points[0].value! >= currenttick()?.close! ) {
      instanceapi()?.removeOverlay({
        id: overlay.id,
        groupId: overlay.groupId,
        name: overlay.name
      })
      useOrder().triggerPending(overlay, 'buy')
    }
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
        type: 'rectText',
        attrs: { x: bounding.width, y: coordinates[0].y, text: `buyLimit | ${text}` ?? '', align: 'right', baseline: 'middle' },
        styles: {
          color: 'white',
          backgroundColor: '#00698b'
        },
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
    return { type: 'rectText', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: { color: 'white', backgroundColor: '#00698b' } }
  },
  onPressedMoving: (event): boolean => {
    let coordinate: Partial<Coordinate>[] = [
      {x: event.x, y: event.y}
    ]
    const points = instanceapi()?.convertFromPixel(coordinate, {
      paneId: event.overlay.paneId
    })
    
    if ((points as Partial<Point>[])[0].value! < currenttick()?.close!) {
      event.overlay.points[0].value = (points as Partial<Point>[])[0].value
    }
    return true
  }
}

export default buyLimitLine