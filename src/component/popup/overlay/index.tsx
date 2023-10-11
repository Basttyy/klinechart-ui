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
import { userOrderSettings, popupLeft, popupTop, popupOtherInfo, popupOverlay, 
	setShowBuySetting,
	getOverlayType,
	setPopupOverlay,
	setShowOverlaySetting
} from '../../../store/overlaySettingStore'
import { useOrder } from '../../../store/positionStore'
import { instanceapi } from '../../../ChartProComponent'
import { useChartState } from '../../../store/chartStateStore'

const triggerAction = () => {
	if (!popupOtherInfo()?.overlayType) {
    useChartState().popOverlay(popupOverlay()!.id)
	} else if(popupOtherInfo()?.overlayType == 'buy' || popupOtherInfo()?.overlayType == 'sell') {
		useOrder().closeOrder(popupOverlay()!, 'manualclose')
	} else {
		useOrder().removeStopOrTP(popupOverlay()!, popupOtherInfo()?.overlayType as 'tp'|'sl')
	}
}

const ifBuyOrSell = () => {
	if(popupOtherInfo()?.overlayType == 'buy' || popupOtherInfo()?.overlayType == 'sell') {
		return true
	} else {
		return false
	}
}

const setStyle = (type: 'position'|'overlay') => {
	if (type === 'position')
		setShowBuySetting(true)
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
    <div class="klinecharts-pro-popup_background" onclick={() => userOrderSettings().closePopup()}>
      <div class="popup"  style={{  top: `${popupTop()}px`, left: `${popupLeft()}px` }}>
				<button onclick={triggerAction}>{ifBuyOrSell() ? 'Close order' : `Remove ${getOverlayType()}`}</button>
				<button onClick={ () => setStyle(ifBuyOrSell() ? 'position' : 'overlay')}>Settings</button>
				<Show when={!ifBuyOrSell()}>
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
