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

const longPositionTool: OverlayTemplate = {
  name: 'longPositionTool',
  totalStep: 4,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    polygon: {
      color: 'rgba(22, 119, 255, 0.15)'
    }
  },
  createPointFigures: ({ coordinates, precision, overlay }) => {
    const points = overlay.points
    let high;
    let texts;
    const result:any = []
    let multiplier = Math.pow(10, precision.price -1)
    
    const targetStyle = JSON.parse(JSON.stringify(polygonStyle().polygon))
    targetStyle.borderSize = 0
    const stopStyle = JSON.parse(JSON.stringify(targetStyle))
    stopStyle.color = '#dcc4de7b'

    if (coordinates.length > 1) {
      if(coordinates[0].y > coordinates[1].y) {
        coordinates[0].y = coordinates[1].y
      } else {
        result.push({
          type: 'polygon',
          attrs: { coordinates: [
              coordinates[0],
              { x: coordinates[1].x, y: coordinates[0].y },
              coordinates[1],
              { x: coordinates[0].x, y: coordinates[1].y },
            ]
          },
          styles: targetStyle
        })
      }

      if(coordinates.length > 2) {

        if(coordinates[2].y < coordinates[1].y) {
          coordinates[2].y = coordinates[1].y
        } else {
          result.push({
            type: 'polygon',
            attrs: { coordinates: [
                coordinates[1],
                { x: coordinates[0].x, y: coordinates[1].y },
                { x: coordinates[0].x, y: coordinates[2].y },
                { x: coordinates[1].x, y: coordinates[2].y },
              ]
            },
            styles: stopStyle
          })
        }

        
        /**
         * TODO: this should show a shadow of current running loss or profit level
         */
        // const _points: Partial<Point>[] = [
        //   {value: currenttick()?.close, timestamp: currenttick()?.timestamp}
        // ]
        // const _coordinates = instanceapi()?.convertToPixel(_points, {
        //   paneId: overlay.paneId
        // })
        // result.push({
        //   type: 'polygon',
        //   attrs: {
        //     coordinates: [
        //       coordinates[0],
        //       { x: coordinates[1].x, y: (_coordinates as Partial<Coordinate>[])[0].y },
        //       coordinates[1],
        //       { x: (_coordinates as Partial<Coordinate>[])[0].x, y: coordinates[1].y }
        //     ]
        //   },
        //   styles: (_coordinates as Partial<Coordinate>[])[0].y! >= coordinates[1].y ? targetStyle : stopStyle
        // })

        let target = useOrder().calcTarget(points[0].value!, points[1].value!, precision.price)
        let stop = useOrder().calcStopOrTarget(points[1].value!, points[2].value!, precision.price)
        const tags = [
          `Target: ${target} (${((Number(points[0].value! - points[1].value!)/points[1].value!)*100).toFixed(2)}%) ${(Number(target)*multiplier).toFixed(1)}`, 
          `Open P&L: ${useOrder().calcPL(points[1].value!, precision.price, true, 'buy')}, RRR: ${(Number(target)/Math.abs(Number(stop))).toFixed(1)}`, 
          `Stop: ${stop} (${((Number(points[2].value! - points[1].value!)/points[1].value!)*100).toFixed(2)}%) ${(Number(stop)*multiplier).toFixed(1)}`
        ]

        texts = [coordinates[0],coordinates[1]].map((coordinate, i) => {
          const boxwidth = Math.abs((coordinates[1].x - coordinates[0].x))/2
          const textwidth = utils.calcTextWidth(tags[i], textStyle.size, textStyle.weight)/2
          const xpos = coordinates[1].x >= coordinates[0].x ? coordinates[0].x + (boxwidth - textwidth) : coordinates[1].x + (boxwidth - textwidth)
          return {
            x: xpos, y: coordinate.y-10,
            baseline: 'bottom',
            text: `${tags[i]}`
          }
        })

        result.push({
          type: 'text',
          // ignoreEvent: true,
          attrs: texts,
          styles: {
            backgroundColor: 'green',
            ...textStyle
          }
        })

        const boxwidth = Math.abs((coordinates[1].x - coordinates[0].x))/2
        const textwidth = utils.calcTextWidth(tags[2], textStyle.size, textStyle.weight)/2
        const xpos = coordinates[1].x >= coordinates[0].x ? coordinates[0].x + (boxwidth - textwidth) : coordinates[1].x + (boxwidth - textwidth)
        // for the third text with different background
        result.push({
          type: 'text',
          // ignoreEvent: true,
          attrs: {
            x: xpos, y: coordinates[2].y+25,
            baseline: 'bottom',
            text: `${tags[2]}`
          }
          ,
          styles: {
            backgroundColor: 'red',
            ...textStyle
          }
        })
      }
    }
    
    
    return result
  },
  performEventPressedMove: ({ points, performPointIndex }) => {
    if (points.length < 3) return;

    if (performPointIndex === 0) {
      points[2].timestamp = points[0].timestamp
      points[2].dataIndex = points[0].dataIndex
    }

    if (performPointIndex === 1) {

    }

    if (performPointIndex === 2) {
      points[0].timestamp = points[2].timestamp
      points[0].dataIndex = points[2].dataIndex
    }
  },
  
  performEventMoveForDrawing: ({ points, performPointIndex }) => {
    if (points.length < 2) return;

    if (performPointIndex === 0) {
      points[2].timestamp = points[0].timestamp
      points[2].dataIndex = points[0].dataIndex
    }

    if (performPointIndex === 1) {

    }

    if (performPointIndex === 2) {
      points[0].timestamp = points[2].timestamp
      points[0].dataIndex = points[2].dataIndex
    }
  },
  // onRightClick: (event): boolean => {
  //   alert(`object ${event.overlay.name} was clicked`)
  //   return true;
  // }
}

export default longPositionTool
