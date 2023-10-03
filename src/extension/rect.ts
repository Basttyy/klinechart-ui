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

import { Coordinate, OverlayTemplate, Point } from 'klinecharts'
import { instanceapi } from '../ChartProComponent'
import { currenttick } from '../store/tickStore'

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
      for (let i = 0; i < coordinates.length; i++) {
        let coordinate: Partial<Coordinate>[] = [
          {x: coordinates[i].x, y: coordinates[i].y}
        ]
        const points = instanceapi()?.convertFromPixel(coordinate, {
          paneId: overlay.paneId
        })
        console.log(`${(points as Partial<Point>[])[0].timestamp!}    ${overlay.points[i].timestamp}    ${currenttick()?.timestamp}`)
        if ((points as Partial<Point>[])[0].timestamp === undefined && overlay.points[i].timestamp === undefined) {
            let point: Partial<Point> = {value: currenttick()?.close, timestamp: currenttick()?.timestamp}
            let overlayxy = instanceapi()?.convertToPixel(point, {
              paneId: overlay.paneId
            })
            let x = (overlayxy as Partial<Coordinate>).x!
            coordinates[i].x = x
        }
      }
      // for (let i = 0; i < coordinates.length; i++) {
      //   let coordinate: Partial<Coordinate>[] = [
      //     {x: coordinates[i].x, y: coordinates[i].y}
      //   ]
      //   const points = instanceapi()?.convertFromPixel(coordinate, {
      //     paneId: overlay.paneId
      //   })
        
      //   // console.log(`${(points as Partial<Point>[])[0].timestamp!}    ${overlay.points[i].timestamp}    ${currenttick()?.timestamp}`)
      //   let datalist = instanceapi()?.getDataList()
      //   if ((points as Partial<Point>[])[0].timestamp! === datalist![datalist?.length! - 2].timestamp) {
      //     console.log('drawing is crossing current timestamp')
      //     let point: Partial<Point> = {value: currenttick()?.close, timestamp: datalist![datalist?.length! - 5].timestamp}
      //     let overlayxy = instanceapi()?.convertToPixel(point, {
      //       paneId: overlay.paneId
      //     })
      //     let x = (overlayxy as Partial<Coordinate>).x!
      //     console.log(`${(points as Partial<Point>[])[0].timestamp!}    ${datalist![datalist?.length! - 5].timestamp}`)
      //     console.log(`${coordinates[i].x}   ${x}`)
      //     coordinates[i].x = x
      //     console.log(`${coordinates[i].x}   ${x}`)
      //     break
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
  },
  // onPressedMoving(event): boolean {
  //   console.log('pressed moving')
  //   let coordinate: Partial<Coordinate>[] = [
  //     {x: event.x, y: event.y}
  //   ]
  //   const points = instanceapi()?.convertFromPixel(coordinate, {
  //     paneId: event.overlay.paneId
  //   })

  //   let overlaypoints = event.overlay.points

  //   for (let i = 0; i < overlaypoints.length; i++) {
  //     if ((points as Partial<Point>[])[0].timestamp! >= currenttick()?.timestamp!) {
  //       console.log('moving is crossing current timestamp')
  //       let point: Partial<Point> = {value: currenttick()?.close, timestamp: currenttick()?.timestamp}
  //       let overlayxy = instanceapi()?.convertToPixel(point, {
  //         paneId: event.overlay.paneId
  //       })
  //       event.x = (overlayxy as Partial<Coordinate>).x
  //     }
  //   }

  //   return false
  // },
  // onDrawing(event): boolean {
  //   console.log('drawing')
  //   let coordinate: Partial<Coordinate>[] = [
  //     {x: event.x, y: event.y}
  //   ]
  //   const points = instanceapi()?.convertFromPixel(coordinate, {
  //     paneId: event.overlay.paneId
  //   })

  //   let overlaypoints = event.overlay.points

  //   for (let i = 0; i < overlaypoints.length; i++) {
  //     if ((points as Partial<Point>[])[0].timestamp! >= currenttick()?.timestamp!) {
  //       console.log('drawing is crossing current timestamp')
  //       let point: Partial<Point> = {value: currenttick()?.close, timestamp: currenttick()?.timestamp}
  //       let overlayxy = instanceapi()?.convertToPixel(point, {
  //         paneId: event.overlay.paneId
  //       })
  //       event.x = (overlayxy as Partial<Coordinate>).x
  //     }
  //   }

  //   return false
  // }
}

export default rect

