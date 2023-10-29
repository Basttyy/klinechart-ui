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

import { Show } from 'solid-js'
import { useOverlaySettings, popupLeft, popupTop, popupOtherInfo, popupOverlay, 
	setShowPositionSetting,
	getOverlayType,
	setPopupOverlay,
	setShowOverlaySetting
} from '../../../store/overlaySettingStore'
import { useOrder } from '../../../store/positionStore'
import { instanceapi } from '../../../ChartProComponent'
import { useChartState } from '../../../store/chartStateStore'

const triggerAction = () => {
	if(popupOtherInfo()?.overlayType == 'buy' || popupOtherInfo()?.overlayType == 'sell') {
		useOrder().closeOrder(popupOverlay()!, 'manualclose')
	} else if (popupOtherInfo()?.overlayType == 'tp' || popupOtherInfo()?.overlayType == 'sl') {
		useOrder().removeStopOrTP(popupOverlay()!, popupOtherInfo()?.overlayType as 'tp'|'sl')
	} else if (popupOtherInfo()?.overlayType && ['buystop', 'buylimit', 'sellstop', 'selllimit'].includes(popupOtherInfo()?.overlayType!)) {
		useOrder().closeOrder(popupOverlay()!, 'cancel')
	} else {
    useChartState().popOverlay(popupOverlay()!.id)
	}
}

const ifBuyOrSell = () => {
	if(popupOtherInfo()?.overlayType?.includes('buy') || popupOtherInfo()?.overlayType?.includes('sell')) {
		return true
	} else {
		return false
	}
}

const ifTpOrSl = () => {
	if(popupOtherInfo()?.overlayType == 'tp' || popupOtherInfo()?.overlayType == 'sl') {
		return true
	} else {
		return false
	}
}

const setStyle = (type: 'position'|'overlay') => {
	if (type === 'position')
		setShowPositionSetting(true)
	else if (type === 'overlay')
		setShowOverlaySetting(true)
}

const sendBack = () => {
	const overlay = popupOverlay()
	instanceapi()?.overrideOverlay({id: overlay?.id, zLevel: +overlay!.zLevel+1})

	setPopupOverlay(instanceapi()?.getOverlayById(popupOverlay()!.id)?? popupOverlay())
}

const sendFront = () => {
	const overlay = popupOverlay()
	instanceapi()?.overrideOverlay({id: overlay?.id, zLevel: +overlay!.zLevel-1})

	setPopupOverlay(instanceapi()?.getOverlayById(popupOverlay()!.id)?? popupOverlay())
}

const lockUnlock = () => {
	instanceapi()?.overrideOverlay({id: popupOverlay()?.id, lock: !popupOverlay()?.lock})
	setPopupOverlay(instanceapi()?.getOverlayById(popupOverlay()!.id)?? popupOverlay())
}

const hideUnhide = () => {
	instanceapi()?.overrideOverlay({id: popupOverlay()?.id, visible: !popupOverlay()?.visible})
	setPopupOverlay(instanceapi()?.getOverlayById(popupOverlay()!.id)?? popupOverlay())
}

 
const OverlayOptionsPopup = () => {
  return (
    <div class="klinecharts-pro-popup_background" onclick={() => useOverlaySettings().closePopup()}>
      <div class="popup"  style={{  top: `${popupTop()}px`, left: `${popupLeft()}px` }}>
				<button onclick={triggerAction}>{ifBuyOrSell() ? 'Close order' : `Remove ${getOverlayType()}`}</button>
				<button onClick={ () => setStyle(ifBuyOrSell() || ifTpOrSl() ? 'position' : 'overlay')}>Settings</button>
				<Show when={!ifBuyOrSell() && !ifTpOrSl()}>
					<button onclick={sendBack}>Send Back</button>
					<button onclick={sendFront}>Send Front</button>
					<button onclick={lockUnlock}>{popupOverlay()?.lock ? 'Unlock' : 'Lock'}</button>
					<button onclick={hideUnhide}>{popupOverlay()?.visible ? 'Hide' : 'Unhide'}</button>
				</Show>
			</div>
    </div>
  )
}

export default OverlayOptionsPopup
