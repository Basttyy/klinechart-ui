import { Chart, DeepPartial, Indicator, IndicatorCreate, Nullable, Overlay, OverlayCreate, OverlayEvent, OverlayStyle, PaneOptions, SmoothLineStyle, dispose } from "@basttyy/klinecharts"
import { chartsession, chartsessionCtr, instanceapi, setInstanceapi, symbol } from "../ChartProComponent"
import { ChartObjType, ChartSessionResource, OrderInfo, OrderResource, OrderStylesType, SymbolInfo, sessionType } from "../types"
import { createSignal } from "solid-js"
import { drawOrder, orderList, ordercontr, setOrderList } from "./positionStore"
import _, { cloneDeep, keys, set } from "lodash"
import { Datafeed } from "../types"
import { tickTimestamp } from "./tickStore"
import { ctrlKeyedDown, timerid, widgetref } from "./keyEventStore"
import { OtherTypes, overlayType, useOverlaySettings } from "./overlaySettingStore"
import { buyLimitStyle, buyStopStyle, buyStyle, sellLimitStyle, sellStopStyle, sellStyle, setBuyLimitStyle, setBuyStopStyle, setBuyStyle, setSellLimitStyle, setSellStopStyle, setSellStyle, setStopLossStyle, setTakeProfitStyle, stopLossStyle, takeProfitStyle } from "./overlaystyle/positionStyleStore"
import { straightLineStyle } from "./overlaystyle/inbuiltOverlayStyleStore"
import { useGetOverlayStyle } from "./overlaystyle/useOverlayStyles"

export const [mainIndicators, setMainIndicators] = createSignal([''])
export const [subIndicators, setSubIndicators] = createSignal({})
export const [chartModified, setChartModified] = createSignal(false)
export const [theme, setTheme] = createSignal('')
export const [fullScreen, setFullScreen] = createSignal(false)
export const [orderModalVisible, setOrderModalVisible] = createSignal(false)
export const [range, setRange] = createSignal(1)
export const [datafeed, setDatafeed] = createSignal<Datafeed>()

export const documentResize = () => {
  instanceapi()?.resize()
}

export const cleanup = () => {   //Cleanup objects when leaving chart page
  const doJob = async () => {
    clearInterval(timerid())
    datafeed()!.unsubscribe()

    const updateRunningOrders = async (orders: OrderInfo[], symbol: SymbolInfo, orderctr: OrderResource) => {
      let i = 0, pL = 0
      if (orders && symbol !== undefined) {
        while(i < orders.length) {
          if (orders[i].pl !== null && orders[i].pips !== null) {
            pL = +pL + +orders[i].pl!
            await orderctr.modifyOrder({
              id: orders[i].orderId, //in a real application this should be calculated on backend
              pips: orders[i].pips, //in a real application this should be calculated on backend
              pl: orders[i].pips! * orders[i].lotSize * symbol!.dollarPerPip!
            })
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          i++
        }
      }
      return pL
    }
    const updateChartSession = async (_session: sessionType, _pl: number, _sessionctr: ChartSessionResource) => {
      const pl = +_session.current_bal + +_pl
      if (_session) {
        await _sessionctr?.updateSession({
          id: _session.id,
          current_bal: _session.current_bal,
          equity: pl,
          chart_timestamp: tickTimestamp(),
          chart: localStorage.getItem(`chartstatedata_${chartsession()?.id}`) != null && chartModified() ? btoa(localStorage.getItem(`chartstatedata_${chartsession()?.id}`)!) : undefined
        })
      }
    }
    const orders = orderList().filter(order => (order.action == 'buy' || order.action == 'sell') && !order.exitType && !order.exitPoint)

    let pl = await updateRunningOrders (orders, symbol()!, ordercontr()!)
    await updateChartSession (chartsession()!, pl, chartsessionCtr()!)
    setInstanceapi(null)
    dispose(widgetref()!)
    await new Promise(resolve => setTimeout(resolve, 500));
    window.location.href = chartsessionCtr()?.isNotGuest() ? '/dashboard' : '/'
  }
  doJob()
}

type IndicatorChageType = {
  name: string
  paneId: string
  added: boolean
}

type IndicatorSettingsType = {
  visible: boolean;
  indicatorName: string;
  paneId: string;
  calcParams: any[];
}

const refineIndiObj = (indicator: Indicator): IndicatorCreate => {
  const keys = [
    'calc', 'figures', 'regenerateFigures', 'draw', 'createTooltipDataSource'
  ]

  let cleanIndicator: IndicatorCreate = indicator

  keys.forEach (key => {
    // @ts-expect-error
    delete cleanIndicator[key]
  })

  return cleanIndicator
}

/**
 * Removes all event listeners from the overlay object
 * 
 * @param overlay
 * @returns 
 */
const refineOverlayObj = (overlay: Overlay): OverlayCreate => {
  const keys = [
    'onDrawStart', 'onDrawing', 'onDrawEnd', 'onClick', 'onDoubleClick', 'onRightClick',
    'onMouseEnter', 'onMouseLeave', 'onPressedMoveStart', 'onPressedMoving', 'onPressedMoveEnd',
    'onRemoved', 'onSelected', 'onDeselected', 'performEventMoveForDrawing', 'performEventPressedMove',
    '_prevPressedPoint', '_prevPressedPoints', 'createPointFigures', 'createXAxisFigures', 'createYAxisFigures'
  ]
  let cleanOverlay: OverlayCreate = overlay

  keys.forEach(key => {
    // @ts-expect-error
    delete cleanOverlay[key]
  })
  return cleanOverlay
}

export const useChartState = () => {
  const syncIndiObject = (indicator: Indicator, isStack?: boolean, paneOptions?: PaneOptions): boolean => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    let chartObj: ChartObjType
    
    const indi = refineIndiObj(_.cloneDeep(indicator))
    if (chartStateObj) {
      chartObj = JSON.parse(chartStateObj!)
      if (!chartObj.indicators) {
        chartObj.indicators = [{
          value: indi,
          isStack: isStack,
          paneOptions
        }]
        // chartObj = {
        //   styleObj: chartObj.styleObj,
        //   overlays: chartObj.overlays,
        //   figures: chartObj.figures,
        //   indicators: [{
        //     value: indi,
        //     isStack: isStack,
        //     paneOptions
        //   }]
        // }
      } else {
        if (chartObj.indicators.find(_indi => _indi.value?.name === indi.name && _indi.paneOptions?.id === paneOptions?.id)) {
          // @ts-expect-error
          chartObj.indicators = chartObj.indicators.map(_indi => (_indi.value?.id !== indi.id ? _indi : {
            value: indi,
            isStack,
            paneOptions
          }))
        } else {
          chartObj.indicators!.push({
            value: indi,
            isStack,
            paneOptions
          })
        }
      }
    }
    else {
      chartObj = {
        indicators: [{
          value: indi,
          isStack,
          paneOptions
        }]
      }
    }
    localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
    setChartModified(true)
    return false
  }
  
  const syncObject = (overlay: Overlay): boolean => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    let chartObj: ChartObjType
    
    const overly = refineOverlayObj(_.cloneDeep(overlay))
    if (chartStateObj) {
      chartObj = JSON.parse(chartStateObj!)
      if (!chartObj.overlays) {
        chartObj.overlays = [{
          value: overlay,
          paneId: overlay.paneId
        }]
        // chartObj = {
        //   styleObj: chartObj.styleObj,
        //   overlays: [{
        //     value: overly,
        //     paneId: overlay.paneId
        //   }],
        //   figures: chartObj.figures,
        //   indicators: chartObj.indicators
        // }
      } else {
        if (chartObj.overlays.find(ovaly => ovaly.value?.id === overly.id)) {
          chartObj.overlays = chartObj.overlays.map(ovaly => (ovaly.value?.id !== overly.id ? ovaly : {
            value: overly,
            paneId: overlay.paneId
          }))
        } else {
          chartObj.overlays!.push({
            value: overly,
            paneId: overlay.paneId
          })
        }
      }
    }
    else {
      chartObj = {
        overlays: [{
          value: overly,
          paneId: overlay.paneId
        }]
      }
    }
    localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
    setChartModified(true)
    return false
  }

  function createIndicator (widget: Nullable<Chart>, indicatorName: string, isStack?: boolean, paneOptions?: PaneOptions, docallback = false): Nullable<string> {
    if (indicatorName === 'VOL') {
      paneOptions = { gap: { bottom: 2 }, ...paneOptions }
    }
    const paneId = widget?.createIndicator({
      name: indicatorName,
      // @ts-expect-error
      createTooltipDataSource: ({ indicator, defaultStyles }) => {
        const icons = []
        if (indicator.visible) {
          icons.push(defaultStyles.tooltip.icons[1])
          icons.push(defaultStyles.tooltip.icons[2])
          icons.push(defaultStyles.tooltip.icons[3])
        } else {
          icons.push(defaultStyles.tooltip.icons[0])
          icons.push(defaultStyles.tooltip.icons[2])
          icons.push(defaultStyles.tooltip.icons[3])
        }
        return { icons }
      }
    }, isStack, paneOptions) ?? null

    if (paneId && docallback) {
      const indi = widget?.getIndicatorByPaneId(paneId, indicatorName)
      if (indi)
        syncIndiObject(indi as Indicator, isStack, { id: paneId })
    }
    return paneId
  }

  const pushOverlay = (overlay: OverlayCreate, paneId?: string, redrawing = false) => {
    const id = instanceapi()?.createOverlay(overlay, paneId)

    const ovrly = instanceapi()?.getOverlayById((id as string))
    if (ovrly) {
      const style = !redrawing && useGetOverlayStyle[`${ovrly.name}Style`] ? useGetOverlayStyle[`${ovrly.name}Style`]() : undefined
      instanceapi()?.overrideOverlay({
        id: ovrly.id,
        styles: overlay.styles ?? style,
        onDrawEnd: (event) => {
          return syncObject(event.overlay)
        },
        onPressedMoveEnd: (event) => {
          return syncObject(event.overlay)
        },
        onRightClick: (event) => {
          if(ctrlKeyedDown()) {
            popOverlay(event.overlay.id)
            return true
          }
          useOverlaySettings().openPopup(event, {overlayType: (event.overlay.name as overlayType)})
          // popOverlay(event.overlay.id)
          return true
        }
      })
      if (!redrawing)
        syncObject(instanceapi()?.getOverlayById((id as string))!)
    }
  }

  const popOverlay = (id: string) => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    if (chartStateObj) {
      let chartObj: ChartObjType = JSON.parse(chartStateObj)
  
      chartObj.overlays = chartObj.overlays?.filter(overlay => overlay.value?.id !== id)
      localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
      setChartModified(true)
    }
    instanceapi()?.removeOverlay(id)
  }

  const pushMainIndicator = (data: IndicatorChageType) => {
    const newMainIndicators = [...mainIndicators()]
    if (data.added) {
      createIndicator(instanceapi(), data.name, true, { id: 'candle_pane' }, true)
      newMainIndicators.push(data.name)
    } else {
      popIndicator(data.name, 'candle_pane')
      newMainIndicators.splice(newMainIndicators.indexOf(data.name), 1)
    }
    setMainIndicators(newMainIndicators)
  }

  const pushSubIndicator = (data: IndicatorChageType) => {
    const newSubIndicators = { ...subIndicators() }
    if (data.added) {
      const paneId = createIndicator(instanceapi(), data.name, false, undefined, true)
      if (paneId) {
        // @ts-expect-error
        newSubIndicators[data.name] = paneId
      }
    } else {
      if (data.paneId) {
        popIndicator(data.name, data.paneId)
        // @ts-expect-error
        delete newSubIndicators[data.name]
      }
    }
    setSubIndicators(newSubIndicators)
  }

  const modifyIndicator = (modalParams: IndicatorSettingsType, params: any) => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    if (chartStateObj) {
      let chartObj: ChartObjType = JSON.parse(chartStateObj)

      chartObj.indicators = chartObj.indicators?.map(indi => {
        if (indi.value?.name === modalParams.indicatorName) {
          indi.value.name = modalParams.indicatorName
          indi.value.calcParams = params
          indi.paneOptions!.id = modalParams.paneId
        }
        return indi
      })
      localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
      setChartModified(true)
      instanceapi()?.overrideIndicator({ name: modalParams.indicatorName, calcParams: params }, modalParams.paneId)
    }
  }
  const popIndicator = (name: string, paneId: string) => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    instanceapi()?.removeIndicator(paneId, name)
  
    if (chartStateObj) {
      let chartObj: ChartObjType = JSON.parse(chartStateObj)
  
      chartObj.indicators = chartObj.indicators?.filter(indi => indi.paneOptions?.id !== paneId && indi.value?.name !== name)
      localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
      setChartModified(true)
    }
    return
  }

  const redrawOrders = async () => {
    let orders = await ordercontr()!.retrieveOrders()

    if (orders) {
      setOrderList(orders)
      orders.forEach(order => {
        if (order.exitType)
          return
        drawOrder(order)
      })
    }
  }

  const redraOverlaysIndiAndFigs = async () => {
    const redraw = (chartStateObj: string) => {
      const chartObj = (JSON.parse(chartStateObj) as ChartObjType)

      if (chartObj.figures) {
      }
      if (chartObj.overlays) {
        chartObj.overlays.forEach(overlay => {
          pushOverlay(overlay.value!, overlay.paneId, true)
        })
      }
      if (chartObj.indicators) {
        setTimeout(() => {
          const newMainIndicators = [...mainIndicators()]
          const newSubIndicators = {...subIndicators}
  
          chartObj.indicators!.forEach(indicator => {
            if (indicator.value) {
              instanceapi()?.createIndicator(indicator.value, indicator.isStack, indicator.paneOptions)
              if (indicator.paneOptions?.id === 'candle_pane') {
                newMainIndicators.push(indicator.value.name)
              } else {
                //@ts-expect-error
                newSubIndicators[indicator.value.name] = indicator.paneOptions?.id
              }
            }
          })
          setMainIndicators(newMainIndicators)
          setSubIndicators(newSubIndicators)
        }, 500)
      }
      if (chartObj.styleObj) {
        instanceapi()?.setStyles(chartObj.styleObj)
      }
      if (chartObj.orderStyles) {
        const styles = chartObj.orderStyles
        syncOrderStyles(styles)
      }
    }

    if (chartsession()?.chart) {
      let chartStateObj = atob(chartsession()?.chart!)

      if (chartStateObj) {
        if (chartStateObj !== localStorage.getItem(`chartstatedata_${chartsession()?.id}`))
          localStorage.setItem(`chartstatedata_${chartsession()?.id}`, chartStateObj)

        return redraw(chartStateObj)
      }
    }

    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)!
    if (chartStateObj)
      redraw(chartStateObj)
  }

  return { createIndicator, modifyIndicator, popIndicator, syncIndiObject, syncObject, pushOverlay, popOverlay, pushMainIndicator, pushSubIndicator, redrawOrders, redraOverlaysIndiAndFigs }
}

const syncOrderStyles = (styles: OrderStylesType) => {
  if (styles.buyStyle) {
    setBuyStyle((prevbuystyle) => {
      const buystyle = cloneDeep(prevbuystyle)
      if (styles.buyStyle?.lineStyle) {
        for (const key in styles.buyStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buystyle, `lineStyle.${key}`, styles.buyStyle.lineStyle[key])
            // buystyle.lineStyle[key] = styles.buyStyle.lineStyle[key]
          }
        }
      }
      if (styles.buyStyle?.labelStyle) {
        for (const key in styles.buyStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buystyle, `labelStyle.${key}`, styles.buyStyle.labelStyle[key])
            // buystyle.labelStyle[key] = styles.buyStyle.labelStyle[key]
          }
        }
      }
      return buystyle
    })
  }
  if (styles.buyLimitStyle) {
    setBuyLimitStyle((prevBuyLimitStyle) => {
      const buylimitstyle = cloneDeep(prevBuyLimitStyle)
      if (styles.buyLimitStyle?.lineStyle) {
        for (const key in styles.buyLimitStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buylimitstyle, `lineStyle.${key}`, styles.buyLimitStyle.lineStyle[key])
          }
        }
      }
      if (styles.buyLimitStyle?.labelStyle) {
        for (const key in styles.buyLimitStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buylimitstyle, `labelStyle.${key}`, styles.buyLimitStyle.labelStyle[key])
          }
        }
      }
      return buylimitstyle
    })
  }
  if (styles.buyStopStyle) {
    setBuyStopStyle((prevbuystopstyle) => {
      const buystopstyle = cloneDeep(prevbuystopstyle)
      if (styles.buyStopStyle?.lineStyle) {
        for (const key in styles.buyStopStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buystopstyle, `lineStyle.${key}`, styles.buyStopStyle.lineStyle[key])
          }
        }
      }
      if (styles.buyStopStyle?.labelStyle) {
        for (const key in styles.buyStopStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(buystopstyle, `labelStyle.${key}`, styles.buyStopStyle.labelStyle[key])
          }
        }
      }
      return buystopstyle
    })
  }
  if (styles.sellStyle) {
    setSellStyle((prevsellstyle) => {
      const sellstyle = cloneDeep(prevsellstyle)
      if (styles.sellStyle?.lineStyle) {
        for (const key in styles.sellStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(sellstyle, `lineStyle.${key}`, styles.sellStyle.lineStyle[key])
          }
        }
      }
      if (styles.sellStyle?.labelStyle) {
        for (const key in styles.sellStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(sellstyle, `labelStyle.${key}`, styles.sellStyle.labelStyle[key])
          }
        }
      }
      return sellstyle
    })
  }
  if (styles.sellLimitStyle) {
    setSellLimitStyle((prevselllimitstyle) => {
      const selllimitstyle = cloneDeep(prevselllimitstyle)
      if (styles.sellLimitStyle?.lineStyle) {
        for (const key in styles.sellLimitStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(selllimitstyle, `lineStyle.${key}`, styles.sellLimitStyle.lineStyle[key])
          }
        }
      }
      if (styles.sellLimitStyle?.labelStyle) {
        for (const key in styles.sellLimitStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(selllimitstyle, `labelStyle.${key}`, styles.sellLimitStyle.labelStyle[key])
          }
        }
      }
      return selllimitstyle
    })
  }
  if (styles.sellStopStyle) {
    setSellStopStyle((prevsellstopstyle) => {
      const sellstopstyle = cloneDeep(prevsellstopstyle)
      if (styles.sellStopStyle?.lineStyle) {
        for (const key in styles.sellStopStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(sellstopstyle, `lineStyle.${key}`, styles.sellStopStyle.lineStyle[key])
          }
        }
      }
      if (styles.sellStopStyle?.labelStyle) {
        for (const key in styles.sellStopStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(sellstopstyle, `labelStyle.${key}`, styles.sellStopStyle.labelStyle[key])
          }
        }
      }
      return sellstopstyle
    })
  }
  if (styles.stopLossStyle) {
    setStopLossStyle((prevstoplossstyle) => {
      const stoplossstyle = cloneDeep(prevstoplossstyle)
      if (styles.stopLossStyle?.lineStyle) {
        for (const key in styles.stopLossStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(stoplossstyle, `lineStyle.${key}`, styles.stopLossStyle.lineStyle[key])
          }
        }
      }
      if (styles.stopLossStyle?.labelStyle) {
        for (const key in styles.stopLossStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(stoplossstyle, `labelStyle.${key}`, styles.stopLossStyle.labelStyle[key])
          }
        }
      }
      return stoplossstyle
    })
  }
  if (styles.takeProfitStyle) {
    setTakeProfitStyle((prevtakeprofitstyle) => {    
      const takeprofitstyle = cloneDeep(takeProfitStyle())
      if (styles.takeProfitStyle?.lineStyle) {
        for (const key in styles.takeProfitStyle.lineStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(takeprofitstyle, `lineStyle.${key}`, styles.takeProfitStyle.lineStyle[key])
          }
        }
      }
      if (styles.takeProfitStyle?.labelStyle) {
        for (const key in styles.takeProfitStyle.labelStyle) {
          if (key !== undefined) {
            //@ts-expect-error
            set(takeprofitstyle, `labelStyle.${key}`, styles.takeProfitStyle.labelStyle[key])
          }
        }
      }
      return takeprofitstyle
    })
  }
}