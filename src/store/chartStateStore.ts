import { DeepPartial, Styles } from "klinecharts";
import { instanceapi } from "../ChartProComponent";
import { ChartStyleObj } from "../charttypes";
import _ from "lodash";

export const applySettings = (style: ChartStyleObj) => {

  const styles = instanceapi()?.getStyles()
  if (!styles)
    return
  const modifiedChartStyleObj: DeepPartial<Styles> =  _.cloneDeep(styles)

  if (style.candle) {
    const candle = style.candle
    if (candle.area) {
      if (candle.area.backgroundColor) {
        _.set(modifiedChartStyleObj, 'candle?.area?.backgroundColor', candle.area.backgroundColor)
      }
      if (candle.area.lineColor) {
        _.set(modifiedChartStyleObj, 'candle.area.lineColor', candle.area.lineColor)
      }
      if (candle.area.lineSize) {
        _.set(modifiedChartStyleObj, 'candle.area.lineSize', candle.area.lineSize)
      }
      if (candle.area.value) {
        _.set(modifiedChartStyleObj, 'candle.area.value', candle.area.value)
      }
    }
    if (candle.bar) {
      if (candle.bar.downBorderColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.downBorderColor', candle.bar.downBorderColor)
      }
      if (candle.bar.downColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.downColor', candle.bar.downColor)
      }
      if (candle.bar.downWickColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.downWickColor', candle.bar.downWickColor)
      }
      if (candle.bar.noChangeBorderColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.noChangeBorderColor', candle.bar.noChangeBorderColor)
      }
      if (candle.bar.noChangeColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.noChangeColor', candle.bar.noChangeColor)
      }
      if (candle.bar.noChangeWickColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.noChangeWickColor', candle.bar.noChangeWickColor)
      }
      if (candle.bar.upBorderColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.upBorderColor', candle.bar.upBorderColor)
      }
      if (candle.bar.upColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.upColor', candle.bar.upColor)
      }
      if (candle.bar.upWickColor) {
        _.set(modifiedChartStyleObj, 'candle.bar.upWickColor', candle.bar.upWickColor)
      }
    }
    if (candle.priceMark) {
      
    }
  }
  if (style.crosshair) {

  }
}