import { Overlay, OverlayEvent } from '@basttyy/klinecharts';
import { createSignal } from 'solid-js';
import { ExitType } from '../types';
import { useOrder } from './positionStore';
import { ctrlKeyedDown, setCtrlKeyedDown } from './keyEventStore';
import { getScreenSize } from '../helpers';

export interface OtherTypes {
  exitType?: ExitType
  overlayType?: 'buy'|'sell'|'tp'|'sl'
}

export const [showPopup, setShowPopup] = createSignal(false)
export const [popupTop, setPopupTop] = createSignal(0)
export const [popupLeft, setPopupLeft] = createSignal(0)
export const [popupOverlay, setPopupOverlay] = createSignal<Overlay>()
export const [popupOtherInfo, setPopupOtherInfo] = createSignal<OtherTypes>()

export const [showBuySetting, setShowBuySetting] = createSignal(false)
export const [showSellSetting, setShowSellSetting] = createSignal(false)
export const [showTpSetting, setShowTpSetting] = createSignal(false)
export const [showSlSetting, setShowSlSetting] = createSignal(false)

export const getOverlayType = () => {
	// console.log(popupOtherInfo()?.overlayType)
	if(popupOtherInfo()?.overlayType == 'buy'){
		return 'Buy'
	} else if(popupOtherInfo()?.overlayType == 'sell') {
		return 'Sell'
	} else if(popupOtherInfo()?.overlayType == 'sl') {
		return 'Stop loss'
	} else if(popupOtherInfo()?.overlayType == 'tp') {
		return 'Take profit'
	} else {
		return popupOverlay()?.name ?? 'Object'
	}
}

const ctrl_rightClick = (event:OverlayEvent, type:'buy'|'sell'|'tp'|'sl') => {
	if(type == 'buy' || type == 'sell') {
		useOrder().closeOrder(event.overlay, 'manualclose')
	} else {
		useOrder().removeStopOrTP(event.overlay, type as 'tp'|'sl')
	}
}

export const userOrderSettings = () => {
	const openPopup = (event: OverlayEvent, others?: OtherTypes) => {
		setPopupTop(getScreenSize().y - event.pageY! > 200 ? event.pageY! : getScreenSize().y-200)
		setPopupLeft(getScreenSize().x - event.pageX! > 200 ? event.pageX! : getScreenSize().x-200)
		setPopupOverlay(event.overlay)
		setPopupOtherInfo(others)
		setShowPopup(true)
	}

	const closePopup = () => {
		setShowPopup(false)
		// setPopupOtherInfo({})
	}

	const profitLossPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
		if(ctrlKeyedDown()) {
			if (event.figureIndex == 0 || event.figureIndex == 3){
				ctrl_rightClick(event, type)
			} else if (event.figureIndex == 1 || event.figureIndex == 4) {
				ctrl_rightClick(event, 'tp')
			} else if(event.figureIndex == 2 || event.figureIndex == 5){
				ctrl_rightClick(event, 'sl')
			}
			return
		}
		if (event.figureIndex == 0 || event.figureIndex == 3){
      openPopup(event, {overlayType: type})
    } else if (event.figureIndex == 1 || event.figureIndex == 4) {
      openPopup(event, {overlayType: 'tp'})
    } else if(event.figureIndex == 2 || event.figureIndex == 5){
      openPopup(event, {overlayType: 'sl'})
    }
	}

	const profitPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
		if(ctrlKeyedDown()) {
			if (event.figureIndex == 0 || event.figureIndex == 2){
				ctrl_rightClick(event, type)
			} else {
				ctrl_rightClick(event, 'tp')
			} 
			return
		}
		if (event.figureIndex == 0 || event.figureIndex == 2) {
      openPopup(event, {overlayType: type})
    } else {
			openPopup(event, {overlayType: 'tp'})
    } 
	}

	const lossPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
		if(ctrlKeyedDown()) {
			if (event.figureIndex == 0 || event.figureIndex == 2){
				ctrl_rightClick(event, type)
			} else {
				ctrl_rightClick(event, 'sl')
			} 
			return
		}
		if (event.figureIndex == 0 || event.figureIndex == 2) {
      openPopup(event, {overlayType: type})
    } else {
			openPopup(event, {overlayType: 'sl'})
    } 
	}

	const singlePopup = (event:OverlayEvent, type: 'buy'|'sell') => {
		if(ctrlKeyedDown()) {
			ctrl_rightClick(event, type)
			return
		}
		openPopup(event, {overlayType: type})
	}

	return { openPopup, closePopup, profitLossPopup, profitPopup, lossPopup, singlePopup}
}

// export const useOverlaySettings = () => {
// 	const openPopup = (event:OverlayEvent, others?:OtherTypes) => {
// 		console.log(getScreenSize().x, event.pageX!)
// 		setPopupTop(getScreenSize().y - event.pageY! > 200 ? event.pageY! : getScreenSize().y-200)
// 		setPopupLeft(getScreenSize().x - event.pageX! > 200 ? event.pageX! : getScreenSize().x-200)
// 		setPopupOverlay(event.overlay)
// 		setPopupOtherInfo(others)
// 		setShowPopup(true)
// 	}

// 	const closePopup = () => {
// 		setShowPopup(false)
// 		// setPopupOtherInfo({})
// 	}

// 	const profitLossPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
// 		if(ctrlKeyedDown()) {
// 			if (event.figureIndex == 0 || event.figureIndex == 3){
// 				ctrl_rightClick(event, type)
// 			} else if (event.figureIndex == 1 || event.figureIndex == 4) {
// 				ctrl_rightClick(event, 'tp')
// 			} else if(event.figureIndex == 2 || event.figureIndex == 5){
// 				ctrl_rightClick(event, 'sl')
// 			}
// 			return
// 		}
// 		if (event.figureIndex == 0 || event.figureIndex == 3){
//       openPopup(event, {overlayType: type})
//     } else if (event.figureIndex == 1 || event.figureIndex == 4) {
//       openPopup(event, {overlayType: 'tp'})
//     } else if(event.figureIndex == 2 || event.figureIndex == 5){
//       openPopup(event, {overlayType: 'sl'})
//     }
// 	}

// 	const profitPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
// 		if(ctrlKeyedDown()) {
// 			if (event.figureIndex == 0 || event.figureIndex == 2){
// 				ctrl_rightClick(event, type)
// 			} else {
// 				ctrl_rightClick(event, 'tp')
// 			} 
// 			return
// 		}
// 		if (event.figureIndex == 0 || event.figureIndex == 2) {
//       openPopup(event, {overlayType: type})
//     } else {
// 			openPopup(event, {overlayType: 'tp'})
//     } 
// 	}

// 	const lossPopup = (event:OverlayEvent, type: 'buy'|'sell') => {
// 		if(ctrlKeyedDown()) {
// 			if (event.figureIndex == 0 || event.figureIndex == 2){
// 				ctrl_rightClick(event, type)
// 			} else {
// 				ctrl_rightClick(event, 'sl')
// 			} 
// 			return
// 		}
// 		if (event.figureIndex == 0 || event.figureIndex == 2) {
//       openPopup(event, {overlayType: type})
//     } else {
// 			openPopup(event, {overlayType: 'sl'})
//     } 
// 	}

// 	const singlePopup = (event:OverlayEvent, type: 'buy'|'sell') => {
// 		if(ctrlKeyedDown()) {
// 			ctrl_rightClick(event, type)
// 			return
// 		}
// 		openPopup(event, {overlayType: type})
// 	}

// 	return { openPopup, closePopup, profitLossPopup, profitPopup, lossPopup, singlePopup}
// }