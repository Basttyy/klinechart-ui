import { createSignal } from "solid-js";

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
          //TODO: we should pase the copied overlay from clipboard
          break;
        case 'p':
          //TODO: we should take a screenshot
          break;
        case 'f':
          //TODO: we should activate/deactivate fullscreen
          break;
      }

      return
    }
    if (['1','2','3','4','5','6','7','8','9'].includes(event.key)) {
      //TODO: we should show a popup for timeframe changing
    } else if (event.key === ' ') {
      //TODO: we should pause or play the chart accordingly
    } else if (event.key === 'ArrowDown') {
      //TODO: we should decrease the speed if its not yet slowest
    } else if (event.key === 'ArrowUp') {
      //TODO: we should increase the speed if its not yet fastest
    }
  }

  return { handleKeyDown, handleKeyUp, handleKeyPress }
}