import { Figure, FigureCreate, Indicator, IndicatorCreate, KLineData, Nullable, Overlay, OverlayCreate } from "klinecharts";

/**
 * line type
 */
declare enum LineType {
	Dashed = "dashed",
	Solid = "solid"
}
interface LineStyle {
	style?: LineType;
	size?: number;
	color?: string;
	dashedValue?: number[];
}
interface SmoothLineStyle extends LineStyle {
	smooth?: boolean;
}
interface StateLineStyle extends LineStyle {
	show?: boolean;
}
declare enum PolygonType {
	Stroke = "stroke",
	Fill = "fill",
	StrokeFill = "stroke_fill"
}
interface PolygonStyle {
	style?: PolygonType;
	color?: string | CanvasGradient;
	borderColor?: string;
	borderSize?: number;
	borderStyle?: LineType;
	borderDashedValue?: number[];
}
interface RectStyle extends PolygonStyle {
	borderRadius?: number;
}
interface TextStyle {
	color?: string;
	size?: number;
	family?: string;
	weight?: number | string;
}
interface StateTextStyle extends TextStyle {
	show?: boolean;
}
interface RectTextStyle extends TextStyle {
	style?: PolygonType;
	paddingLeft?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	borderStyle?: LineType;
	borderDashedValue?: number[];
	borderSize?: number;
	borderColor?: string;
	borderRadius?: number;
	backgroundColor?: string;
}
interface StateRectTextStyle extends RectTextStyle {
	show?: boolean;
}
interface MarginTextStyle extends StateTextStyle {
	marginLeft?: number;
	marginTop?: number;
	marginRight?: number;
	marginBottom?: number;
}
type LastValueMarkTextStyle = Omit<StateRectTextStyle, "backgroundColor" | "borderColor">;
declare enum TooltipShowRule {
	Always = "always",
	FollowCross = "follow_cross",
	None = "none"
}
declare enum TooltipShowType {
	Standard = "standard",
	Rect = "rect"
}
interface ChangeColor {
	upColor?: string;
	downColor?: string;
	noChangeColor?: string;
}
interface GradientColor {
	offset?: number;
	color?: string;
}
interface GridStyle {
	show?: boolean;
	horizontal?: StateLineStyle;
	vertical?: StateLineStyle;
}
type TooltipTextStyle = Omit<MarginTextStyle, "show">;
interface TooltipDataChild {
	text?: string;
	color?: string;
}
interface TooltipData {
	title?: string | TooltipDataChild;
	value?: string | TooltipDataChild;
}
declare enum TooltipIconPosition {
	Left = "left",
	Middle = "middle",
	Right = "right"
}
interface TooltipIconStyle {
	id?: string;
	position?: TooltipIconPosition;
	marginLeft?: number;
	marginTop?: number;
	marginRight?: number;
	marginBottom?: number;
	paddingLeft?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	color?: string;
	activeColor?: string;
	size?: number;
	fontFamily?: string;
	icon?: string;
	backgroundColor?: string;
	activeBackgroundColor?: string;
}
interface TooltipStyle {
	showRule?: TooltipShowRule;
	showType?: TooltipShowType;
	defaultValue?: string;
	text?: TooltipTextStyle;
	icons?: TooltipIconStyle[];
}
interface CandleAreaStyle {
	lineSize?: number;
	lineColor?: string;
	value?: string;
	backgroundColor?: string | GradientColor[];
}
interface CandleHighLowPriceMarkStyle {
	show?: boolean;
	color?: string;
	textOffset?: number;
	textSize?: number;
	textFamily?: string;
	textWeight?: string;
}
type CandleLastPriceMarkLineStyle = Omit<StateLineStyle, "color">;
interface CandleLastPriceMarkStyle extends ChangeColor {
	show?: boolean;
	line?: CandleLastPriceMarkLineStyle;
	text?: LastValueMarkTextStyle;
}
interface CandlePriceMarkStyle {
	show?: boolean;
	high?: CandleHighLowPriceMarkStyle;
	low?: CandleHighLowPriceMarkStyle;
	last?: CandleLastPriceMarkStyle;
}
declare enum CandleTooltipRectPosition {
	Fixed = "fixed",
	Pointer = "pointer"
}
interface CandleTooltipRectStyle extends Omit<RectStyle, "style" | "borderDashedValue" | "borderStyle"> {
	position?: CandleTooltipRectPosition;
	paddingLeft?: number;
	paddingRight?: number;
	paddingTop?: number;
	paddingBottom?: number;
	offsetLeft?: number;
	offsetTop?: number;
	offsetRight?: number;
	offsetBottom?: number;
}
interface CandleTooltipCustomCallbackData {
	prev?: Nullable<KLineData>;
	current?: KLineData;
	next?: Nullable<KLineData>;
}
type CandleTooltipCustomCallback = (data?: CandleTooltipCustomCallbackData, styles?: CandleStyle) => TooltipData[];
interface CandleTooltipStyle extends TooltipStyle {
	custom?: Nullable<CandleTooltipCustomCallback> | Nullable<TooltipData[]>;
	rect?: CandleTooltipRectStyle;
}
declare enum CandleType {
	CandleSolid = "candle_solid",
	CandleStroke = "candle_stroke",
	CandleUpStroke = "candle_up_stroke",
	CandleDownStroke = "candle_down_stroke",
	Ohlc = "ohlc",
	Area = "area"
}
interface CandleBarColor extends ChangeColor {
	upBorderColor?: string;
	downBorderColor?: string;
	noChangeBorderColor?: string;
	upWickColor?: string;
	downWickColor?: string;
	noChangeWickColor?: string;
}
interface CandleStyle {
	type?: CandleType;
	bar?: CandleBarColor;
	area?: CandleAreaStyle;
	priceMark?: CandlePriceMarkStyle;
	tooltip?: CandleTooltipStyle;
}
type IndicatorPolygonStyle = Omit<PolygonStyle, "color" | "borderColor"> & ChangeColor;
interface IndicatorLastValueMarkStyle {
	show?: boolean;
	text?: LastValueMarkTextStyle;
}
interface IndicatorTooltipStyle extends TooltipStyle {
	showName?: boolean;
	showParams?: boolean;
}
interface IndicatorStyle {
	ohlc?: ChangeColor;
	bars?: IndicatorPolygonStyle[];
	lines?: SmoothLineStyle[];
	circles?: IndicatorPolygonStyle[];
	lastValueMark?: IndicatorLastValueMarkStyle;
	tooltip?: IndicatorTooltipStyle;
	[key: string]: any;
}
type AxisLineStyle = Omit<StateLineStyle, "style" | "dashedValue">;
interface AxisTickLineStyle extends AxisLineStyle {
	length?: number;
}
interface AxisTickTextStyle extends StateTextStyle {
	marginStart?: number;
	marginEnd?: number;
}
interface AxisStyle {
	show?: boolean;
	size?: number | "auto";
	axisLine?: AxisLineStyle;
	tickLine?: AxisTickLineStyle;
	tickText?: AxisTickTextStyle;
}
type XAxisStyle = AxisStyle;
declare enum YAxisPosition {
	Left = "left",
	Right = "right"
}
declare enum YAxisType {
	Normal = "normal",
	Percentage = "percentage",
	Log = "log"
}
interface YAxisStyle extends AxisStyle {
	type?: YAxisType;
	position?: YAxisPosition;
	inside?: boolean;
	reverse?: boolean;
}
interface CrosshairDirectionStyle {
	show?: boolean;
	line?: StateLineStyle;
	text?: StateRectTextStyle;
}
interface CrosshairStyle {
	show?: boolean;
	horizontal?: CrosshairDirectionStyle;
	vertical?: CrosshairDirectionStyle;
}
interface OverlayPointStyle {
	color?: string;
	borderColor?: string;
	borderSize?: number;
	radius?: number;
	activeColor?: string;
	activeBorderColor?: string;
	activeBorderSize?: number;
	activeRadius?: number;
}
interface OverlayStyle {
	point?: OverlayPointStyle;
	line?: SmoothLineStyle;
	rect?: RectStyle;
	polygon?: PolygonStyle;
	circle?: PolygonStyle;
	arc?: LineStyle;
	text?: TextStyle;
	rectText?: RectTextStyle;
	[key: string]: any;
}
interface SeparatorStyle {
	size?: number;
	color?: string;
	fill?: boolean;
	activeBackgroundColor?: string;
}
interface ChartStyleObj {
	grid?: GridStyle;
	candle?: CandleStyle;
	indicator?: IndicatorStyle;
	xAxis?: XAxisStyle;
	yAxis?: YAxisStyle;
	separator?: SeparatorStyle;
	crosshair?: CrosshairStyle;
	overlay?: OverlayStyle;
}

export interface ChartObj {
  styleObj?: ChartStyleObj,
  overlays?: [{ value?: OverlayCreate, paneId?: string}]
  figures?: [{FigureCreate[],
  indicators?: IndicatorCreate[],
}