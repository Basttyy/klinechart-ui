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

import { Coordinate, OverlayTemplate, Point } from '@basttyy/klinecharts'
import { instanceapi } from '../ChartProComponent'
import { currenttick } from '../store/tickStore'
import { userOrderSettings } from '../store/overlaySettingStore'

const rect: OverlayTemplate = {
  name: 'rect',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  styles: {
    polygon: {
      color: 'rgba(22, 119, 255, 0.15)'
    }
  },
  createPointFigures: ({ overlay, coordinates, bounding, precision }) => {
    if (coordinates.length > 1) {
      // for (let i = 0; i < coordinates.length; i++) {
      //   let coordinate: Partial<Coordinate>[] = [
      //     {x: coordinates[i].x, y: coordinates[i].y}
      //   ]
      //   const points = instanceapi()?.convertFromPixel(coordinate, {
      //     paneId: overlay.paneId
      //   })
      //   console.log(`${(points as Partial<Point>[])[0].timestamp!}    ${overlay.points[i].timestamp}    ${currenttick()?.timestamp}`)
      //   if ((points as Partial<Point>[])[0].timestamp === undefined && overlay.points[i].timestamp === undefined) {
      //       let point: Partial<Point> = {value: currenttick()?.close, timestamp: currenttick()?.timestamp}
      //       let overlayxy = instanceapi()?.convertToPixel(point, {
      //         paneId: overlay.paneId
      //       })
      //       let x = (overlayxy as Partial<Coordinate>).x!
      //       coordinates[i].x = x
      //   }
      // }
      return [
        {
          type: 'polygon',
          attrs: {
            coordinates: [
              coordinates[0],
              { x: coordinates[1].x, y: coordinates[0].y },
              coordinates[1],
              { x: coordinates[0].x, y: coordinates[1].y }
            ]
          },
          styles: { style: 'stroke_fill' }
        }
      ]
    }
    return []
  }
}

export default rect

