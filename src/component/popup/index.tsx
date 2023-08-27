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


import { useOverlaySetting, popupLeft, popupTop, popup_overlay_exit_type, popupOverlay } from '../../store/overlaySettingStore'
import { useOrder } from '../../store/positionStore'
import { ExitType } from '../../types'


const { closePopup } = useOverlaySetting()

const closeOrder = () => {
	useOrder().closeOrder(popupOverlay()!, popup_overlay_exit_type()!)
}

 
const Action_popup = () => {
  return (
    <div class="klinecharts-pro-popup_background" onclick={() => closePopup()}>
      <div class="popup"  style={{  top: `${popupTop()}px`, left: `${popupLeft()}px` }}>
				<button onclick={closeOrder}>Close order</button>
				{/* <button onclick={removeOverlay}>Remove overlay</button> */}
				<button>Others</button>
			</div>
    </div>
  )
}

export default Action_popup
