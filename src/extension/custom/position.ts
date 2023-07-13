import { OverlayTemplate } from 'klinecharts'

const positionBox:OverlayTemplate = {
	name: 'positionBox',
	totalStep: 3,
	// Create the graphic information corresponding to the point
	createPointFigures: ({ coordinates }) => {
    if (coordinates.length > 1) {
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

export default positionBox