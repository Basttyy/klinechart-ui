import { createSignal } from 'solid-js';



export const [buyStyle, setBuyStyle] = createSignal({
	style: 'fill',
	size: 12,
	family:'Helvetica Neue',
	weight: 'normal',
	borderStyle: 'solid',
	borderSize: 1,
	color: '#FFFFFF',
	borderColor: '#00698b',
	backgroundColor: '#00698b'
})

export const [sellStyle, setSellStyle] = createSignal({
	style: 'fill',
	size: 12,
	family:'Helvetica Neue',
	weight: 'normal',
	borderStyle: 'solid',
	borderSize: 1,
	color: '#FFFFFF',
	borderColor: '#00698b',
	backgroundColor: '#fb7b50'
})

export const [takeProfitStyle, setTakeProfitStyle] = createSignal({
	style: 'fill',
	size: 12,
	family:'Helvetica Neue',
	weight: 'normal',
	borderStyle: 'solid',
	borderSize: 1,
	color: '#FFFFFF',
	borderColor: '#00698b',
	backgroundColor: '#00698b'
})

export const [stopLossStyle, setStopLossStyle] = createSignal({
	style: 'fill',
	size: 12,
	family:'Helvetica Neue',
	weight: 'normal',
	borderStyle: 'solid',
	borderSize: 1,
	color: '#FFFFFF',
	borderColor: '#00698b',
	backgroundColor: '#fb7b50'
})