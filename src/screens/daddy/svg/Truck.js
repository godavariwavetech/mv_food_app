import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function Truck(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <G clipPath="url(#clip0_13_2480)">
        <Path
          d="M10 12H0V2.666a2 2 0 012-2h6a2 2 0 012 2V12zm1.333 0H16V8.666h-4.667V12zm1.334-8.667h-1.334v4H16v-.667a3.337 3.337 0 00-3.333-3.333zm-10.628 10c-.025.11-.038.221-.039.333a1.667 1.667 0 003.333 0 1.616 1.616 0 00-.038-.333H2.039zm9.333 0c-.024.11-.037.221-.039.333a1.667 1.667 0 003.334 0 1.619 1.619 0 00-.039-.333h-3.256z"
          fill="#75B042"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_13_2480">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default Truck
