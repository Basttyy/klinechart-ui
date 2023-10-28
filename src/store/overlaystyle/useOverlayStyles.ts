import {
  setPointStyle, setRectStyle, setPolygonStyle, setCircleStyle, setArcStyle, setTextStyle, pointStyle, rectStyle, polygonStyle,
  circleStyle, arcStyle, textStyle, horizontalStraightLineStyle, horizontalRayLineStyle, horizontalSegmentStyle, verticalStraightLineStyle,
  verticalRayLineStyle, setRayLineStyle, rayLineStyle, segmentStyle, verticalSegmentStyle, arrowStyle, straightLineStyle, priceLineStyle, setHorizontalStraightLineStyle,
  setHorizontalRayLineStyle, setHorizontalSegmentStyle, setVerticalStraightLineStyle, setVerticalRayLineStyle, setVerticalSegmentStyle,
  setStraightLineStyle, setSegmentStyle, setPriceLineStyle } from './inbuiltOverlayStyleStore'

// Define an object that maps function names to functions
export const useGetOverlayStyle: { [key: string]: () => object } = {
  pointStyle,
  horizontalStraightLineStyle,
  horizontalRayLineStyle,
  horizontalSegmentStyle,
  verticalStraightLineStyle,
  verticalRayLineStyle,
  verticalSegmentStyle,
  straightLineStyle,
  rayLineStyle,
  segmentStyle,
  arrowStyle,
  priceLineStyle,
  rectStyle,
  polygonStyle,
  circleStyle,
  arcStyle,
  textStyle
}

// Define an object that maps function names to functions
export const useSetOverlayStyle = {
  setPointStyle: () => setPointStyle,
  setHorizontalStraightLineStyle: () => setHorizontalStraightLineStyle
}