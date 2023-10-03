import { createSignal } from "solid-js";
import { instanceapi, pausedStatus, rootlelID, setPausedStatus, setScreenshotUrl } from "../ChartProComponent";
import { datafeed, fullScreen, range, setRange, theme } from "./chartStateStore";

export const [ctrlKeyedDown, setCtrlKeyedDown] = createSignal(false)

export const useKeyEvents = () => {
  const handleKeyDown = (event:KeyboardEvent) => {
    if (event.ctrlKey) {
      setCtrlKeyedDown(true)
    }
  }

  const handleKeyUp = (event:KeyboardEvent) => {
    if (!event.ctrlKey) {
      setCtrlKeyedDown(false)
    }
  }

  const handleKeyPress = (event:KeyboardEvent) => {
    if (ctrlKeyedDown()) {
      switch (event.key) {
        case 'o':
          //TODO: we should show order opening popup
          break;
        case 'l':
          //TODO: we should show or hide the list of running orders
          break;
        case 'i':
          //TODO: we should show the indicators pane
          break;
        case 's':
          //TODO: we should show the settings pane
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
      }

      return
    }
    if (['1','2','3','4','5','6','7','8','9'].includes(event.key)) {
      //TODO: we should show a popup for timeframe changing
    } else if (event.key === ' ') {
      pausePlay()
    } else if (event.key === 'ArrowDown') {
      handleRangeChange(-1)
    } else if (event.key === 'ArrowUp') {
      handleRangeChange(1)
    }
  }

  return { handleKeyDown, handleKeyUp, handleKeyPress }
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