import * as React from "react"
import Svg, { Path } from "react-native-svg"

function HomeSvg({ color = "#525252", ...props }) {
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
        d="M15.254 3.803l5.002 3.695A3.733 3.733 0 0121.8 10.5v6.688a3.903 3.903 0 01-3.988 3.79H7.798a3.903 3.903 0 01-3.998-3.79v-6.688a3.733 3.733 0 011.544-3.003l5.002-3.695a4.15 4.15 0 014.908 0zM8.537 16.972h8.526a.71.71 0 100-1.421H8.537a.71.71 0 100 1.42z"
        fill={color}
      />
    </Svg>
  )
}

export default HomeSvg