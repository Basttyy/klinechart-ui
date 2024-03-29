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

import { OverlayTemplate,utils} from '@basttyy/klinecharts'
import { useOrder } from '../../../store/positionStore'
import { buyStyle } from '../../../store/overlaystyle/positionStyleStore'
import { useOverlaySettings } from '../../../store/overlaySettingStore'

const buyLine: OverlayTemplate = {
  name: 'buyLine',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    let text = useOrder().calcPL(overlay.points[0].value!, precision.price, true)
    useOrder().updatePipsAndPL(overlay, text)
    return [
      {
        type: 'line',
        attrs: { coordinates: [{ x: 0, y: coordinates[0].y }, { x: bounding.width, y: coordinates[0].y }] },
        styles: buyStyle().lineStyle,
        ignoreEvent: true
      },
      {
        type: 'text',
        attrs: { x: bounding.width, y: coordinates[0].y, text: `buy | ${text}` ?? '', align: 'right', baseline: 'middle' },
        styles: buyStyle().labelStyle
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
    let text: string|null|undefined
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
    // let width = utils.calcTextWidth((text as string))
    // const height = width/(text as string).length * 3
    // width = width + height * 2
    return { type: 'text', attrs: { x, y: coordinates[0].y, text: text ?? '', align: textAlign, baseline: 'middle' }, styles: buyStyle().labelStyle }
  },
  onRightClick: (event): boolean => {
    useOverlaySettings().singlePopup(event, 'buy')
    return true
  }
}

export default buyLine