import Svg, { Circle, Path, Polyline } from "react-native-svg";
import { View } from "react-native";

export default function StaticLineChart({ color = "#3B82F6", points = [20, 55, 40, 70, 50, 78, 65] }) {
  const width = 300; const height = 130; const pad = 10;
  const max = Math.max(...points); const min = Math.min(...points); const spread = Math.max(max - min, 1);
  const plotted = points.map((point, index) => ({ x: pad + (index * (width - pad * 2)) / (points.length - 1), y: height - pad - ((point - min) / spread) * (height - pad * 2) }));
  const line = plotted.map(({ x, y }) => `${x},${y}`).join(" ");
  const area = `M ${plotted[0].x} ${height} L ${plotted.map(({ x, y }) => `${x} ${y}`).join(" L ")} L ${plotted.at(-1).x} ${height} Z`;
  return <View style={{ width: "100%", height: 140 }}><Svg width="100%" height="140" viewBox={`0 0 ${width} ${height}`}>
    <Path d={area} fill={`${color}20`} />
    <Polyline points={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {plotted.map(({ x, y }, index) => <Circle key={index} cx={x} cy={y} r="3.5" fill={color} />)}
  </Svg></View>;
}
