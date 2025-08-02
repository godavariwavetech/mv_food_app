import * as React from "react"
import Svg, { Path } from "react-native-svg"

function CartInactive({ color = "#525252", ...props }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.34 6.86l1.26 8.34c.51 3.65-2 6.97-5.4 7H7.94c-3.34 0-5.88-3.35-5.34-7l1.26-8.34a5.61 5.61 0 015.34-5H16a5.61 5.61 0 015.34 5zM8.7 7.81a3.91 3.91 0 003.9 3.9 3.91 3.91 0 003.9-3.9.75.75 0 00-1.5 0 2.4 2.4 0 01-4.8 0 .75.75 0 00-1.5 0z"
        fill={color}
      />
    </Svg>
  )
}

export default CartInactive
