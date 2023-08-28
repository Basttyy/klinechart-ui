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

const syncIndiObject = (indicator: Indicator): boolean => {
  const chartStateObj = localStorage.getItem('chartstatedata')
  let chartObj: ChartObjType
  
  const overly = refineOverlayObj(_.cloneDeep(event.overlay))
  if (chartStateObj) {
    chartObj = JSON.parse(chartStateObj!)
    if (!chartObj.overlays) {
      chartObj = {
        overlays: [{
          value: overly,
          paneId: event.overlay.paneId
        }]
      }
    } else {
      if (chartObj.overlays.find(ovaly => ovaly.value?.id === overly.id)) {
        // @ts-expect-error
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
  setChartModified(true)
  localStorage.setItem('chartstatedata', JSON.stringify(chartObj))
  return false
}

const syncObject = (event: OverlayEvent): boolean => {
  const chartStateObj = localStorage.getItem('chartstatedata')
  let chartObj: ChartObjType
  
  const overly = refineOverlayObj(_.cloneDeep(event.overlay))
  if (chartStateObj) {
    chartObj = JSON.parse(chartStateObj!)
    if (!chartObj.overlays) {
      chartObj = {
        overlays: [{
          value: overly,
          paneId: event.overlay.paneId
        }]
      }
    } else {
      if (chartObj.overlays.find(ovaly => ovaly.value?.id === overly.id)) {
        // @ts-expect-error
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
  setChartModified(true)
  localStorage.setItem('chartstatedata', JSON.stringify(chartObj))
  return false
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
    const name = widget?.createIndicator({
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

    if (name && docallback) {
      const indi = widget?.getIndicatorByPaneId(paneOptions?.id, name)
      syncIndiObject(indi)
    }
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
        }
      })
    }
  }

  const pushMainIndicator = (data: IndicatorChageType) => {
    const newMainIndicators = [...mainIndicators()]
    if (data.added) {
      createIndicator(instanceapi(), data.name, true, { id: 'candle_pane' })
      newMainIndicators.push(data.name)
    } else {
      instanceapi()?.removeIndicator('candle_pane', data.name)
      newMainIndicators.splice(newMainIndicators.indexOf(data.name), 1)
    }
    setMainIndicators(newMainIndicators)
  }

  const pushSubIndicator = (data: IndicatorChageType) => {
    const newSubIndicators = { ...subIndicators() }
    if (data.added) {
      const paneId = createIndicator(instanceapi(), data.name)
      if (paneId) {
        // @ts-expect-error
        newSubIndicators[data.name] = paneId
      }
    } else {
      if (data.paneId) {
        instanceapi()?.removeIndicator(data.paneId, data.name)
        // @ts-expect-error
        delete newSubIndicators[data.name]
      }
    }
    setSubIndicators(newSubIndicators)
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
    if (chartsession()?.chart) {
      const chartStateObj = atob(chartsession()?.chart!)

      if (chartStateObj) {
        if (chartStateObj !== localStorage.getItem('chartstatedata'))
          localStorage.setItem('chartstatedata', chartStateObj)

        const chartObj = (JSON.parse(chartStateObj) as ChartObjType)
        console.log('Stored object:', chartObj)

        if (chartObj.figures) {
          // chartObj.figures.forEach(figure => {
          //   figure.value
          // })
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
                  }
                })
              }
            }
          })
        }
        if (chartObj.indicators) {
          chartObj.indicators.forEach(indicator => {
            if (indicator.value)
              instanceapi()?.createIndicator(indicator.value, indicator.isStack, indicator.paneOptions, indicator.callback)
          })
        }
        if (chartObj.styleObj) {
          instanceapi()?.setStyles(chartObj.styleObj)
        }
      }
    }
  }

  return { createIndicator, pushOverlay, pushMainIndicator, pushSubIndicator, redrawOrders, redraOverlaysIndiAndFigs }
}