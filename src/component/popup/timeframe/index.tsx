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

import { createSignal } from 'solid-js'
import { datafeed, range, setRange, useChartState } from '../../../store/chartStateStore'
import { setShowSpeed, showSpeed } from '../../../ChartProComponent'

export const [speedPopupTop, setSpeedPopupTop] = createSignal(0)
export const [speedPopupLeft, setSpeedPopupLeft] = createSignal(0)

const maxRange = 10

const handleRangeChange = (event:any) => {
	setRange(event.target.value);
	(datafeed() as any).setInterval = (maxRange + 1 - range()) * 100
}

const handleClose = (event: MouseEvent) => {
	// @ts-expect-error
	if (event.target && (event.target.classList as DOMTokenList).contains('klinecharts-pro-popup_background')) {
		setShowSpeed(false)
	}
}
 
const SpeedPopup = () => {
  return (
    <div id='background' class="klinecharts-pro-popup_background" onclick={handleClose}>
			{/* <div class="popup"  style={{  top: `${speedPopupTop()}px`, left: `${speedPopupLeft()}px` }}> */}
				<input id='input' class="period_range" style={{ left: `${speedPopupLeft()-45}px` }} type="range" min="1" max={maxRange} value={range()} onInput={handleRangeChange} />
			{/* </div> */}
    </div>
  )
}

export default SpeedPopup
