import * as React from "react"
import Svg, { Rect, Circle } from "react-native-svg"

function HeaderPick2({ color = "#0EAF50", ...props }) {
  return (
    <Svg
      width={12}
      height={13}
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.48}
        y={0.98}
        width={11.04}
        height={11.04}
        rx={1.92}
        stroke={color||"#0EAF50"}
        strokeWidth={0.96}
      />
      <Circle cx={6} cy={6.5} r={3} fill={color||"#0EAF50"} />
    </Svg>
  )
}

export default HeaderPick2
