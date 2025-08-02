import * as React from "react"
import Svg, { Path } from "react-native-svg"

function User({ color = "#525252", ...props }) {
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
        d="M19.78 16.71l.24 1.14A3.39 3.39 0 0116.84 22H7.56a3.39 3.39 0 01-3.18-4.15l.24-1.14A3.29 3.29 0 017.79 14h8.82a3.29 3.29 0 013.17 2.71zm-2.94 3.78a1.68 1.68 0 001.3-.64v.01a2.08 2.08 0 00.41-1.72L18.31 17a1.79 1.79 0 00-1.7-1.51H7.79A1.79 1.79 0 006.09 17l-.24 1.14a2.08 2.08 0 00.41 1.71 1.68 1.68 0 001.3.64h9.28zM12.7 12h-1a4 4 0 01-4-4V5.36A3.35 3.35 0 0111.06 2h2.28a3.35 3.35 0 013.36 3.36V8a4 4 0 01-4 4zm-1.64-8.5A1.86 1.86 0 009.2 5.36V8a2.5 2.5 0 002.5 2.5h1A2.5 2.5 0 0015.2 8V5.36a1.86 1.86 0 00-1.86-1.86h-2.28z"
        fill={color}
      />
    </Svg>
  )
}

export default User
