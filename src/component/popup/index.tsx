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
import { useOverlaySetting, popupLeft, popupTop, popupOtherInfo, popupOverlay, 
	setShowBuySetting,
	getOverlayType
} from '../../store/overlaySettingStore'
import { useOrder } from '../../store/positionStore'
import { ExitType } from '../../types'



const triggerAction = () => {
	if(popupOtherInfo()?.overlayType == 'buy' || popupOtherInfo()?.overlayType == 'sell') {
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

const setStyle = () => {
	
	setShowBuySetting(true)
}

 
const Action_popup = () => {
  return (
    <div class="klinecharts-pro-popup_background" onclick={() => useOverlaySetting().closePopup()}>
      <div class="popup"  style={{  top: `${popupTop()}px`, left: `${popupLeft()}px` }}>
				<button onclick={triggerAction}>{ifBuyOrSell() ? 'Close order' : `Remove ${getOverlayType()}`}</button>
				<button onClick={setStyle}>Settings</button>
				{/* <button>Others</button> */}
			</div>
    </div>
  )
}

export default Action_popup
