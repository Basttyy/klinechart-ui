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

import { OverlayTemplate, utils } from '@basttyy/klinecharts'
import { useOrder } from '../../store/positionStore';
import { polygonStyle } from '../../store/overlaystyle/inbuiltOverlayStyleStore';
import { getRotateCoordinate } from '../utils';
import { instanceapi } from '../../ChartProComponent';

const textStyle = {
  style: 'fill',
  color: 'white',
  borderColor: 'white',
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 5,
  paddingLeft: 5,
  borderRadius: 5,
  size: 12,
  weight: 15
}

const measure: OverlayTemplate = {
  name: 'measure',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    // polygon: {
    //   color: 'rgba(22, 119, 255, 0.15)'
    // },
    point: {
      color: 'rgba(0, 0, 0, 0.0)',
      borderColor: 'rgba(0, 0, 0, 0.0)',
      borderSize: 1,
      radius: 5,
      activeColor: 'rgba(0, 0, 0, 0.0)',
      activeBorderColor: 'rgba(0, 0, 0, 0.0)',
      activeBorderSize: 3,
      activeRadius: 5
    }
  },
  createPointFigures: ({ coordinates, precision, overlay }) => {
    const points = overlay.points
    let texts;
    const result: any[] = []
    let multiplier = Math.pow(10, precision.price -1)
    
    const targetStyle = JSON.parse(JSON.stringify(polygonStyle().polygon))
    targetStyle.borderSize = 0
    const stopStyle = JSON.parse(JSON.stringify(targetStyle))
    stopStyle.color = '#dcc4de7b'

    if (coordinates.length > 1) {    
      let coordinates1 = []
      let coordinates2 = []
      const line0y = Math.min(coordinates[0].y, coordinates[1].y) + Math.abs(coordinates[0].y - coordinates[1].y)/2
      coordinates1 = [ { x: coordinates[0].x, y: line0y }, { x: coordinates[1].x, y: line0y }]

      const line1x = Math.min(coordinates[0].x, coordinates[1].x) + Math.abs(coordinates[0].x - coordinates[1].x)/2
      coordinates2 = [ { x: line1x, y: coordinates[0].y }, { x: line1x, y: coordinates[1].y }]
      
      const flag = coordinates1[1].x > coordinates1[0].x ? 0 : 1
      const flag2 = coordinates2[1].x > coordinates2[0].x ? 0 : 1
      const kb = utils.getLinearSlopeIntercept(coordinates1[0], coordinates1[1])
      const kb2 = utils.getLinearSlopeIntercept(coordinates2[0], coordinates2[1])
      let offsetAngle, offsetAngle2
      if (kb) {
        offsetAngle = Math.atan(kb[0]) + Math.PI * flag
      } else {
        offsetAngle = Math.PI / 2 * 3
      }
      if (kb2) {
        offsetAngle2 = Math.atan(kb2[0]) + Math.PI * flag2
      } else {
        if (coordinates2[1].y > coordinates2[0].y) {
          offsetAngle2 = Math.PI / 2
        } else {
          offsetAngle2 = Math.PI / 2 * 3
        }
      }
      const rotateCoordinate1 = getRotateCoordinate({ x: coordinates1[1].x - 8, y: coordinates1[1].y + 4 }, coordinates1[1], offsetAngle)
      const rotateCoordinate2 = getRotateCoordinate({ x: coordinates1[1].x - 8, y: coordinates1[1].y - 4 }, coordinates1[1], offsetAngle)
      const rotateCoordinate3 = getRotateCoordinate({ x: coordinates2[1].x - 8, y: coordinates2[1].y + 4 }, coordinates2[1], offsetAngle2)
      const rotateCoordinate4 = getRotateCoordinate({ x: coordinates2[1].x - 8, y: coordinates2[1].y - 4 }, coordinates2[1], offsetAngle2)

      result.push({
        type: 'polygon',
        attrs: { coordinates: [
            coordinates[0],
            { x: coordinates[1].x, y: coordinates[0].y },
            coordinates[1],
            { x: coordinates[0].x, y: coordinates[1].y },
          ]
        },
        styles: coordinates2[1].y < coordinates2[0].y ? targetStyle : stopStyle,
      })

      result.push(
        {
          type: 'line',
          attrs: { coordinates: coordinates1},
          ignoreEvent: true,
          styles: {
            color: coordinates2[1].y < coordinates2[0].y ? targetStyle : stopStyle,
          }
        },
        {
          type: 'line',
          ignoreEvent: true,
          attrs: { coordinates: [rotateCoordinate1, coordinates1[1], rotateCoordinate2] },
          styles: {
            color: coordinates2[1].y < coordinates2[0].y ? targetStyle : stopStyle,
          }
        },
        {
          type: 'line',
          attrs: { coordinates: coordinates2},
          ignoreEvent: true,
          styles: {
            color: coordinates2[1].y < coordinates2[0].y ? targetStyle : stopStyle,
          }
        },
        {
          type: 'line',
          ignoreEvent: true,
          attrs: { coordinates: [rotateCoordinate3, coordinates2[1], rotateCoordinate4] },
          styles: {
            color: coordinates2[1].y < coordinates2[0].y ? targetStyle : stopStyle,
          }
        }
      )

      let target = useOrder().calcTarget(points[1].value!, points[0].value!, precision.price)
      const tag = `${target} (${((Number(points[1].value! - points[0].value!)/points[1].value!)*100).toFixed(2)}%) ${(Number(target)*multiplier).toFixed(1)}`

      const boxwidth = Math.abs((coordinates[1].x - coordinates[0].x))/2
      const textwidth = (utils.calcTextWidth(tag, textStyle.size, textStyle.weight) + textStyle.paddingLeft + textStyle.paddingRight)/2
      const xpos = coordinates[1].x >= coordinates[0].x ? coordinates[0].x + (boxwidth - textwidth) : coordinates[1].x + (boxwidth - textwidth)

      // for the third text with different background
      result.push({
        type: 'text',
        attrs: {
          x: xpos, y: Math.max(coordinates[0].y, coordinates[1].y) + 25,
          baseline: 'bottom',
          text: `${tag}`
        },
        styles: {
          backgroundColor: coordinates2[1].y < coordinates2[0].y ? 'green' : 'red',
          ...textStyle
        }
      })
        
    }

    return result
  },
  onRightClick: (event): boolean => {
    return false;
  },
  // onClick: (event): boolean => {
  //   if (event.figureIndex == 1)
  //     instanceapi()?.removeOverlay(event.overlay.id)
  //   return false;
  // },
  onDeselected: (event): boolean => {
    instanceapi()?.removeOverlay(event.overlay.id)
    return true;
  }
}

export default measure
