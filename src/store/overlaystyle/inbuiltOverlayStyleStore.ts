import { createSignal } from 'solid-js';

export const [circleStyle, setCircleStyle] = createSignal({
		// 'fill' | 'stroke' | 'stroke_fill'
		style: 'fill',
		color: 'rgba(22, 119, 255, 0.25)',
		borderColor: '#1677FF',
		borderSize: 1,
		// 'solid' | 'dashed'
		borderStyle: 'solid',
		borderDashedValue: [2, 2]
})




export const [circleyle, setCircStyle] = createSignal({
	lineStyle: {
		style: 'dashed',
		size: 1,
		color: '#00698b',
		dashedValue: [4, 4]
	},
	labelStyle: {
		style: 'fill',
		size: 12,
		family:'Helvetica Neue',
		weight: 'normal',
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 5,
		paddingTop: 5,
		borderStyle: 'solid',
		borderSize: 1,
		color: '#FFFFFF',
		borderColor: '#00698b',
		backgroundColor: '#00698b'
	}
})