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

import { OverlayTemplate } from 'klinecharts'




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
  createPointFigures: ({ coordinates, precision }) => {
    const tags = ['Target: 10.06', 'Open P&L: 10.68', 'Stop: 10.06']
    const attrsData:any = []
    if (coordinates.length > 1) {
      // console.log('length', coordinates.length, coordinates)
      attrsData.push({ coordinates: [
          coordinates[0],
          { x: coordinates[1].x, y: coordinates[0].y },
          coordinates[1],
          { x: coordinates[0].x, y: coordinates[1].y },
        ]
      })

      if(coordinates.length > 2) {
        console.log('precision', coordinates.length, precision)
        attrsData.push({ coordinates: [
            coordinates[1],
            { x: coordinates[0].x, y: coordinates[1].y },
            { x: coordinates[0].x, y: coordinates[2].y },
            { x: coordinates[1].x, y: coordinates[2].y },
          ]
        })
      }
    }
    const texts = coordinates.map((coordinate, i) => ({
      // ...coordinate,
      x: coordinates[0].x, y: coordinate.y,
      baseline: 'bottom',
      text: `(${tags[i]})`
    }))
    
    if(attrsData.length) {
      return [
        {
          type: 'polygon',
          attrs: attrsData[0],
          styles: { style: 'stroke_fill', color: '#dcc4de7b' }
        },
        {
          type: 'polygon',
          attrs: attrsData[1],
          styles: { style: 'stroke_fill'}
        },
        {
          type: 'text',
          // ignoreEvent: true,
          attrs: texts,
          styles: {style: 'stroke', color: 'black'}
        }
      ]
    }
    return []
  }
}

export default positionBox