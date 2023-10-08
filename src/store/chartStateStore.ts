import { Chart, Indicator, IndicatorCreate, Nullable, Overlay, OverlayCreate, OverlayEvent, PaneOptions, dispose } from "@basttyy/klinecharts"
import { chartsession, chartsessionCtr, instanceapi, setInstanceapi, symbol } from "../ChartProComponent"
import { ChartObjType, ChartSessionResource, OrderInfo, OrderResource, SymbolInfo, sessionType } from "../types"
import { createSignal } from "solid-js"
import { drawOrder, orderList, ordercontr, setOrderList } from "./positionStore"
import _ from "lodash"
import { Datafeed } from "../types"
import { tickTimestamp } from "./tickStore"
import { timerid, widgetref } from "./keyEventStore"
import { userOrderSettings } from "./overlaySettingStore"

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
    window.location.href = '/dashboard'
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

const syncIndiObject = (indicator: Indicator, isStack?: boolean, paneOptions?: PaneOptions): boolean => {
  const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
  let chartObj: ChartObjType
  
  const indi = refineIndiObj(_.cloneDeep(indicator))
  if (chartStateObj) {
    chartObj = JSON.parse(chartStateObj!)
    if (!chartObj.indicators) {
      chartObj = {
        styleObj: chartObj.styleObj,
        overlays: chartObj.overlays,
        figures: chartObj.figures,
        indicators: [{
          value: indi,
          isStack: isStack,
          paneOptions
        }]
      }
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

const syncObject = (event: OverlayEvent): boolean => {
  const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
  let chartObj: ChartObjType
  
  const overly = refineOverlayObj(_.cloneDeep(event.overlay))
  if (chartStateObj) {
    chartObj = JSON.parse(chartStateObj!)
    if (!chartObj.overlays) {
      chartObj = {
        styleObj: chartObj.styleObj,
        overlays: [{
          value: overly,
          paneId: event.overlay.paneId
        }],
        figures: chartObj.figures,
        indicators: chartObj.indicators
      }
    } else {
      if (chartObj.overlays.find(ovaly => ovaly.value?.id === overly.id)) {
        chartObj.overlays = chartObj.overlays.map(ovaly => (ovaly.value?.id !== overly.id ? ovaly : {
          value: overly,
          paneId: event.overlay.paneId
        }))
      } else {
        chartObj.overlays!.push({
          value: overly,
          paneId: event.overlay.paneId
        })
      }
    }
  }
  else {
    chartObj = {
      overlays: [{
        value: overly,
        paneId: event.overlay.paneId
      }]
    }
  }
  localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
  setChartModified(true)
  return false
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
      console.log(indi)
      if (indi)
        syncIndiObject(indi as Indicator, isStack, { id: paneId })
    }
    return paneId
  }

  const pushOverlay = (overlay: OverlayCreate, paneId?: string) => {
    const id = instanceapi()?.createOverlay(overlay, paneId)

    const ovrly = instanceapi()?.getOverlayById((id as string))
    if (ovrly) {
      instanceapi()?.overrideOverlay({
        onDrawEnd: (event) => {
          return syncObject(event)
        },
        onPressedMoveEnd: (event) => {
          return syncObject(event)
        },
        onRightClick: (event) => {
          console.log('on rightclick handled')
          userOrderSettings().openPopup(event)
          // popOverlay(event.overlay.id)
          return true
        }
      })
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
      });
    }
  }

  const redraOverlaysIndiAndFigs = async () => {

    const redraw = (chartStateObj: string) => {
      const chartObj = (JSON.parse(chartStateObj) as ChartObjType)

      if (chartObj.figures) {
      }
      if (chartObj.overlays) {
        chartObj.overlays.forEach(overlay => {
          pushOverlay(overlay.value!, overlay.paneId)
          // if (overlay.value) {
          //   const id = instanceapi()?.createOverlay(overlay.value, overlay.paneId)
          //   const ovrly = instanceapi()?.getOverlayById((id as string))
          //   if (ovrly) {
          //     instanceapi()?.overrideOverlay({
          //       onDrawEnd: (event) => {
          //         return syncObject(event)
          //       },
          //       onPressedMoveEnd: (event) => {
          //         return syncObject(event)
          //       },
          //       onRightClick: (event) => {
          //         console.log('on rightclick handled')
          //         userOrderSettings().openPopup(event)
          //         // popOverlay(event.overlay.id)
          //         return true
          //       }
          //     })
          //   }
          // }
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
        }, 500);
      }
      if (chartObj.styleObj) {
        instanceapi()?.setStyles(chartObj.styleObj)
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

  return { createIndicator, modifyIndicator, popIndicator, pushOverlay, popOverlay, pushMainIndicator, pushSubIndicator, redrawOrders, redraOverlaysIndiAndFigs }
}