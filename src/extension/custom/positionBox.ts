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

import { createSignal, createMemo, createEffect } from 'solid-js';
import { OverlayTemplate } from 'klinecharts'
import { currenttick } from '../../store/tickStore'

const [initialMiddlePos, setInitialMiddlePos] = createSignal(0);


const calcTarget = (top:number, middle:number, dp:number) => {
  return (top - middle).toFixed(dp)
}

const calcStop = (middle:number, bottom:number, dp:number) => {
  return (middle - bottom).toFixed(dp)
}

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

const positionBox: OverlayTemplate = {
  name: 'positionBox',
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
    let multiplier = 10**precision.price
    console.log(currenttick()?.close)
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
          styles: { style: 'stroke_fill' }
        })
      }

      // console.log('outside', coordinates[1].y, coordinates[0].y)
      // making sure the middle line does not cross over the top line
      // if(coordinates[1].y < coordinates[0].y+10) {
      //   coordinates[1].y = coordinates[0].y+10
      // }
      

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
            styles: { style: 'stroke_fill', color: '#dcc4de7b'}
          })
        }

        // make sure middle line does not meet top or bottom line 
        setInitialMiddlePos(coordinates[1].y)
        if(coordinates[1].y !== initialMiddlePos()) {
          alert('moving')
        }

        let target = calcTarget(points[0].value!, points[1].value!, precision.price)
        let stop = calcStop(points[1].value!, points[2].value!, precision.price)
        const tags = [
          `Target: ${target} (NN%) ${(Number(target)*multiplier).toFixed(0)}, Amount:`, 
          `Open P&L: ${currenttick()!.close-points[1].value!}, Qty: qty, \n Risk/Reward ratio: ${(Number(target)/Number(stop)).toFixed(1)}`, 
          `Stop: ${stop} (NN%) ${(Number(stop)*multiplier).toFixed(0)}, Amount:`
        ]

        texts = [coordinates[0],coordinates[1]].map((coordinate, i) => ({
          x: coordinates[0].x, y: coordinate.y-10,
          baseline: 'bottom',
          text: `${tags[i]}`
        }))

        result.push({
          type: 'rectText',
          // ignoreEvent: true,
          attrs: texts,
          styles: {
            backgroundColor: 'green',
            ...textStyle
          }
        })

        // for the third text with different background
        result.push({
          type: 'rectText',
          // ignoreEvent: true,
          attrs: {
            x: coordinates[0].x, y: coordinates[2].y+35,
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
  }
}

export default positionBox
