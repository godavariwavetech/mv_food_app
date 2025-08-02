import * as React from "react"
import Svg, { Path } from "react-native-svg"

function HomeInactive(props) {
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
        d="M21.09 7l-5.56-4.11a4.63 4.63 0 00-5.46 0L4.52 7a4.14 4.14 0 00-1.72 3.34v7.43A4.34 4.34 0 007.24 22h11.12a4.34 4.34 0 004.44-4.23v-7.44A4.15 4.15 0 0021.09 7zm.21 10.77a2.84 2.84 0 01-2.94 2.73H7.24a2.85 2.85 0 01-2.94-2.73v-7.43A2.65 2.65 0 015.41 8.2l5.55-4.1a3.12 3.12 0 013.68 0l5.55 4.11a2.61 2.61 0 011.11 2.12v7.44zm-13-2.02h9a.75.75 0 010 1.5h-9a.75.75 0 010-1.5z"
        fill="#525252"
      />
    </Svg>
  )
}

export default HomeInactive
