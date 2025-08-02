import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Cart({ color = "#525252", ...props }) {
  return (
    <Svg
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.34 6.86l1.26 8.34c.51 3.65-2 6.97-5.4 7H7.94c-3.34 0-5.88-3.35-5.34-7l1.26-8.34a5.61 5.61 0 015.34-5H16a5.61 5.61 0 015.34 5zm-4.11 13.81A3.66 3.66 0 0020 19.34a4.88 4.88 0 001.09-3.92l-1.23-8.34A4.11 4.11 0 0016 3.33H9.2a4.11 4.11 0 00-3.86 3.75l-1.23 8.34a4.88 4.88 0 001.09 3.92 3.66 3.66 0 002.77 1.33h9.26z"
        fill={color}
      />
      <Path
        d="M15.75 7.06a.75.75 0 00-.75.75 2.4 2.4 0 11-4.8 0 .75.75 0 10-1.5 0 3.9 3.9 0 007.8 0 .76.76 0 00-.75-.75z"
        fill={color}
      />
    </Svg>
  )
}

export default Cart
