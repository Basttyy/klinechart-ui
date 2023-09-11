import { Chart, Indicator, IndicatorCreate, Nullable, Overlay, OverlayCreate, OverlayEvent, PaneOptions } from "klinecharts"
import { chartsession, instanceapi } from "../ChartProComponent"
import { ChartObjType } from "../types"
import { createSignal } from "solid-js"
import { drawOrder, ordercontr, setOrderList } from "./positionStore"
import _ from "lodash"

export const [mainIndicators, setMainIndicators] = createSignal([''])
export const [subIndicators, setSubIndicators] = createSignal({})
export const [chartModified, setChartModified] = createSignal(false)

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

  const pushOverlay = (overlay: OverlayCreate) => {
    const id = instanceapi()?.createOverlay(overlay)

    const ovrly = instanceapi()?.getOverlayById((id as string))
    if (ovrly) {
      instanceapi()?.overrideOverlay({
        onDrawEnd: (event): boolean => {
          return syncObject(event)
        },
        onPressedMoveEnd: (event): boolean => {
          return syncObject(event)
        },
        onRightClick: (event): boolean => {
          popOverlay(event.overlay.id)
          return false
        }
      })
    }
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
          if (overlay.value) {
            const id = instanceapi()?.createOverlay(overlay.value, overlay.paneId)
            const ovrly = instanceapi()?.getOverlayById((id as string))
            if (ovrly) {
              instanceapi()?.overrideOverlay({
                onDrawEnd: (event): boolean => {
                  return syncObject(event)
                },
                onPressedMoveEnd: (event): boolean => {
                  return syncObject(event)
                },
                onRightClick: (event): boolean => {
                  popOverlay(event.overlay.id)
                  return false
                }
              })
            }
          }
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

  return { createIndicator, modifyIndicator, popIndicator, pushOverlay, pushMainIndicator, pushSubIndicator, redrawOrders, redraOverlaysIndiAndFigs }
}