// Chart context and hooks

// Re-export visx gradient and pattern components for bar fill styling
export {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
  LinearGradient,
  RadialGradient,
} from "@visx/gradient";
export {
  PatternCircles,
  PatternHexagons,
  PatternLines,
  PatternWaves,
} from "@visx/pattern";
// Area chart components
export { Area, type AreaProps } from "./area";
export { AreaChart, type AreaChartProps } from "./area-chart";
export {
  type ChartContextValue,
  ChartProvider,
  chartCssVars,
  type LineConfig,
  type Margin,
  type TooltipData,
  useChart,
} from "./chart-context";
// Shared chart elements
export { Grid, type GridProps } from "./grid";
// Tooltip components
export {
  ChartTooltip,
  type ChartTooltipProps,
  DateTicker,
  type DateTickerProps,
  type IndicatorWidth,
  TooltipBox,
  type TooltipBoxProps,
  TooltipContent,
  type TooltipContentProps,
  TooltipDot,
  type TooltipDotProps,
  TooltipIndicator,
  type TooltipIndicatorProps,
  type TooltipRow,
} from "./tooltip";
export { XAxis, type XAxisProps } from "./x-axis";
