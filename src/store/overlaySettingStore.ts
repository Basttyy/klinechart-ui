import { Overlay, OverlayEvent } from 'klinecharts';
import { createSignal } from 'solid-js';
import { ExitType } from '../types';

export const [showPopup, setShowPopup] = createSignal(false)
export const [popupTop, setPopupTop] = createSignal(0)
export const [popupLeft, setPopupLeft] = createSignal(0)
export const [popupOverlay, setPopupOverlay] = createSignal<Overlay>()
export const [popup_overlay_exit_type, set_popup_overlay_exit_type] = createSignal<ExitType>()


export const useOverlaySetting = () => {
	const openPopup = (overlay: Overlay, event:OverlayEvent, exitType?:ExitType) => {
		setPopupTop(event.pageY!)
		setPopupLeft(event.pageX!)
		setPopupOverlay(overlay)
		set_popup_overlay_exit_type(exitType)
		setShowPopup(true)
	}

	const closePopup = () => {
		setShowPopup(false)
	}

	return { openPopup, closePopup}
}