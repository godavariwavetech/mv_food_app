import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function DotsVertical(props) {
  return (
    <Svg
      width={20}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={0.227273}
        y={1.11192}
        width={19.5455}
        height={19.5455}
        rx={9.77273}
        fill="#fff"
      />
      <Rect
        x={0.227273}
        y={1.11192}
        width={19.5455}
        height={19.5455}
        rx={9.77273}
        stroke="#A3A3A3"
        strokeWidth={0.454545}
      />
      <Path
        d="M9.546 14.066a.455.455 0 10.909 0 .455.455 0 00-.91 0zM9.546 10.885a.455.455 0 10.909 0 .455.455 0 00-.91 0zM9.546 7.703a.455.455 0 10.909 0 .455.455 0 00-.91 0z"
        stroke="#313131"
        strokeWidth={0.681818}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default DotsVertical
