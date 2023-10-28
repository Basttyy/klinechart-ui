import { createSignal } from 'solid-js';

const point = {
	color: '#1677FF',
	borderColor: 'rgba(22, 119, 255, 0.35)',
	borderSize: 1,
	radius: 5,
	activeColor: '#1677FF',
	activeBorderColor: 'rgba(22, 119, 255, 0.35)',
	activeBorderSize: 3,
	activeRadius: 5
}

const text = {
	// 'fill' | 'stroke' | 'stroke_fill'
	style: 'fill',
	color: '#FFFFFF',
	size: 12,
	family: 'Helvetica Neue',
	weight: 'normal',
	// 'solid' | 'dashed'
	borderStyle: 'solid',
	borderDashedValue: [2, 2],
	borderSize: 0,
	borderRadius: 2,
	borderColor: '#1677FF',
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
	paddingBottom: 0,
	backgroundColor: 'transparent'
}
const line = {
	// 'solid' | 'dashed'
	style: 'solid',
	smooth: false,
	color: '#1677FF',
	size: 1,
	dashedValue: [2, 2]
}

const rect = {
	// 'fill' | 'stroke' | 'stroke_fill'
	style: 'fill',
	color: 'rgba(22, 119, 255, 0.25)',
	borderColor: '#1677FF',
	borderSize: 1,
	borderRadius: 0,
	// 'solid' | 'dashed'
	borderStyle: 'solid',
	borderDashedValue: [2, 2]
}

const polygon = {
	// 'fill' | 'stroke' | 'stroke_fill'
	style: 'fill',
	color: '#1677FF',
	borderColor: '#1677FF',
	borderSize: 1,
	// 'solid' | 'dashed'
	borderStyle: 'solid',
	borderDashedValue: [2, 2]
}

const circle = {
	// 'fill' | 'stroke' | 'stroke_fill'
	style: 'fill',
	color: 'rgba(22, 119, 255, 0.25)',
	borderColor: '#1677FF',
	borderSize: 1,
	// 'solid' | 'dashed'
	borderStyle: 'solid',
	borderDashedValue: [2, 2]
}

const arc = {
	// 'solid' | 'dashed'
	style: 'solid',
	color: '#1677FF',
	size: 1,
	dashedValue: [2, 2]
}

export const [pointStyle, setPointStyle] = createSignal({
	point: point
})

export const [horizontalStraightLineStyle, setHorizontalStraightLineStyle] = createSignal({
	line: line
})

export const [horizontalSegmentStyle, setHorizontalSegmentStyle] = createSignal({
	line: line
})

export const [horizontalRayLineStyle, setHorizontalRayLineStyle] = createSignal({
	line: line
})

export const [verticalRayLineStyle, setVerticalRayLineStyle] = createSignal({
	line: line
})

export const [verticalSegmentStyle, setVerticalSegmentStyle] = createSignal({
	line: line
})

export const [verticalStraightLineStyle, setVerticalStraightLineStyle] = createSignal({
	line: line
})

export const [rayLineStyle, setRayLineStyle] = createSignal({
	line: line
})

export const [segmentStyle, setSegmentStyle] = createSignal({
	line: line
})

export const [arrowStyle, setArrowStyle] = createSignal({
	line: line
})

export const [priceLineStyle, setPriceLineStyle] = createSignal({
	line: line
})

export const [straightLineStyle, setStraightLineStyle] = createSignal({
	line: line
})

export const [rectStyle, setRectStyle] = createSignal({
	rect: rect
})

export const [polygonStyle, setPolygonStyle] = createSignal({
	polygon: polygon
})

export const [circleStyle, setCircleStyle] = createSignal({
	circle: circle
})

export const [arcStyle, setArcStyle] = createSignal({
 arc: arc
})

export const [textStyle, setTextStyle] = createSignal({
	text: text
})