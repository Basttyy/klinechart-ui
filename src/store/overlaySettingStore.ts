import { Overlay, OverlayEvent } from '@basttyy/klinecharts';
import { createSignal } from 'solid-js';
import { ExitType } from '../types';
import { useOrder } from './positionStore';
import { ctrlKeyedDown, setCtrlKeyedDown } from './keyEventStore';
import { getScreenSize } from '../helpers';
import { useChartState } from './chartStateStore';

export type overlayType =
'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit'|'tp'|'sl'|'point'|'line'|'rect'|'polygon'|'circle'|'arc'|'text'|
'horizontalStraightLine'|'horizontalRayLine'|'horizontalSegment'|'verticalStraightLine'|'verticalRayLine'|'verticalSegment'|
'straightLine'|'rayLine'|'segment'|'arrow'|'priceLine'
export interface OtherTypes {
  exitType?: ExitType
  overlayType?: overlayType
}

export const [showOverlayPopup, setShowOverlayPopup] = createSignal(false)
export const [popupTop, setPopupTop] = createSignal(0)
export const [popupLeft, setPopupLeft] = createSignal(0)
export const [popupOverlay, setPopupOverlay] = createSignal<Overlay>()
export const [popupOtherInfo, setPopupOtherInfo] = createSignal<OtherTypes>()

export const [showPositionSetting, setShowPositionSetting] = createSignal(false)
export const [showOverlaySetting, setShowOverlaySetting] = createSignal(false)
export const [showSellSetting, setShowSellSetting] = createSignal(false)
export const [showTpSetting, setShowTpSetting] = createSignal(false)
export const [showSlSetting, setShowSlSetting] = createSignal(false)

export const getOverlayType = () => {
	if(popupOtherInfo()?.overlayType == 'buy'){
		return 'Buy'
	} else if (popupOtherInfo()?.overlayType == 'buylimit') {
		return 'Buy Limit'
	} else if (popupOtherInfo()?.overlayType == 'buystop') {
		return 'Buy Stop'
	} else if(popupOtherInfo()?.overlayType == 'sell') {
		return 'Sell'
	} else if (popupOtherInfo()?.overlayType == 'selllimit') {
		return 'Sell Limit'
	} else if (popupOtherInfo()?.overlayType == 'sellstop') {
		return 'Sell Stop'
	} else if(popupOtherInfo()?.overlayType == 'sl') {
		return 'Stop loss'
	} else if(popupOtherInfo()?.overlayType == 'tp') {
		return 'Take profit'
	} else {
		return popupOverlay()?.name ?? 'Object'
	}
}

const ctrl_rightClick = (event: OverlayEvent, type: 'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit'|'tp'|'sl') => {
	if(type == 'buy' || type == 'sell') {
		useOrder().closeOrder(event.overlay, 'manualclose')
	} else if (type == 'tp' || type == 'sl') {
		useOrder().removeStopOrTP(event.overlay, type as 'tp'|'sl')
	} else if (['buystop', 'buylimit', 'sellstop', 'selllimit'].includes(type)) {
		useOrder().closeOrder(event.overlay, 'cancel')
 	} else {
		useChartState().popOverlay(event.overlay.id)
	}
}

export const useOverlaySettings = () => {
	const openPopup = (event: OverlayEvent, others?: OtherTypes) => {
		setPopupTop(getScreenSize().y - event.pageY! > 200 ? event.pageY! : getScreenSize().y-200)
		setPopupLeft(getScreenSize().x - event.pageX! > 200 ? event.pageX! : getScreenSize().x-200)
		setPopupOverlay(event.overlay)
		setPopupOtherInfo(others)
		setShowOverlayPopup(true)
	}

	const closePopup = () => {
		setShowOverlayPopup(false)
		// setPopupOtherInfo({})
	}

	const profitLossPopup = (event:OverlayEvent, type: 'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit') => {
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

	const profitPopup = (event:OverlayEvent, type: 'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit') => {
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

	const lossPopup = (event:OverlayEvent, type: 'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit') => {
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

	const singlePopup = (event:OverlayEvent, type: 'buy'|'buystop'|'buylimit'|'sell'|'sellstop'|'selllimit') => {
		if(ctrlKeyedDown()) {
			ctrl_rightClick(event, type)
			return
		}
		openPopup(event, {overlayType: type})
	}

	return { openPopup, closePopup, profitLossPopup, profitPopup, lossPopup, singlePopup }
}
