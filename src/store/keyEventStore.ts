import { createSignal, startTransition } from "solid-js";
import { instanceapi, orderPanelVisible, pausedStatus, periodModalVisible, rootlelID, setIndicatorModalVisible, setOrderPanelVisible, setPausedStatus, setPeriodModalVisible, setScreenshotUrl, setSettingModalVisible, settingModalVisible } from "../ChartProComponent";
import { cleanup, datafeed, documentResize, fullScreen, range, setRange, theme } from "./chartStateStore";
import { ordercontr, useOrder } from "./positionStore";
import { Chart } from "@basttyy/klinecharts";
import { periodInputValue, setPeriodInputValue } from "../widget/timeframe-modal";
import { setInputClass } from "../component/input";

export const [ctrlKeyedDown, setCtrlKeyedDown] = createSignal(false)
export const [widgetref, setWidgetref] = createSignal<string | Chart | HTMLElement>('')
export const [timerid, setTimerid] = createSignal<NodeJS.Timeout>()

export const useKeyEvents = () => {
  const handleKeyDown = (event:KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault()
      setCtrlKeyedDown(true)
    }
    if (ctrlKeyedDown()) {
      switch (event.key) {
        case 'o':
          showOrderPopup()
          break;
        case 'l':
          showOrderlist()
          break;
        case 'i':
          setIndicatorModalVisible(visible => !visible)
          break;
        case 's':
          setSettingModalVisible(visible => !visible)
          break;
        case 'z':
          //TODO: we should undo one step
          break;
        case 'y':
          //TODO: we should redo one step
          break;
        case 'c':
          //TODO: we should copy any selected overlay to clipboard
          break;
        case 'v':
          //TODO: we should paste the copied overlay from clipboard
          break;
        case 'p':
          takeScreenshot()
          break;
        case 'f':
          toggleFullscreen()
          break;
        case 'Backspace':
          cleanup()
          break;
      }

      return
    }
    if (['1','2','3','4','5','6','7','8','9'].includes(event.key)) {
      if (periodInputValue().length < 1)
        setPeriodInputValue(event.key)
      if (!periodModalVisible()) {
        setPeriodModalVisible(true)
        setInputClass('klinecharts-pro-input klinecharts-pro-timeframe-modal-input input-error')
      }
    } else if (event.key === ' ') {
      pausePlay()
    } else if (event.key === 'ArrowDown') {
      handleRangeChange(-1)
    } else if (event.key === 'ArrowUp') {
      handleRangeChange(1)
    } else if (event.key === 'Escape') {
      //TODO: this should hide all modals
      setPeriodModalVisible(false)
      setPeriodInputValue('')

      setSettingModalVisible(false)
      setOrderPanelVisible(false)
      setIndicatorModalVisible(false)
    }
  }

  const handleKeyUp = (event:KeyboardEvent) => {
    if (!event.ctrlKey || !event.metaKey) {
      setCtrlKeyedDown(false)
      event.preventDefault() 
    }
  }

  return { handleKeyDown, handleKeyUp }
}

const showOrderPopup = () => {
  ordercontr()!.launchOrderModal('placeorder', useOrder().onOrderPlaced)
}

const showOrderlist = async () => {
  try {
    await startTransition(() => setOrderPanelVisible(!orderPanelVisible()))
    documentResize()
  } catch (e) {}
}

const takeScreenshot = () => {
  const url = instanceapi()!.getConvertPictureUrl(true, 'jpeg', theme() === 'dark' ? '#151517' : '#ffffff')
  setScreenshotUrl(url)
}

const toggleFullscreen = () => {
  if (!fullScreen()) {
    // const el = ref?.parentElement
    const el = document.querySelector(`#${rootlelID()}`)
    if (el) {
      // @ts-expect-error
      const enterFullScreen = el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.mozRequestFullScreen ?? el.msRequestFullscreen
      enterFullScreen.call(el)
      // setFullScreen(true)
    } else {
      console.log('Unable to get the app root element')
    }
  } else {
    // @ts-expect-error
    const exitFullscreen = document.exitFullscreen ?? document.msExitFullscreen ?? document.mozCancelFullScreen ?? document.webkitExitFullscreen
    exitFullscreen.call(document)
    // setFullScreen(false)
  }
}

const pausePlay = () => {
  setPausedStatus(!pausedStatus());
  (datafeed() as any).setIsPaused = pausedStatus()
}

const handleRangeChange = (value: number) => {
  if (value > 0 && range() < 10) {
    setRange(+range() + +value);
    (datafeed() as any).setInterval = range() * 100
  }
  else if (value < 0 && range() > 1) {
    setRange(+range() + value);
    (datafeed() as any).setInterval = range() * 100
  }
}