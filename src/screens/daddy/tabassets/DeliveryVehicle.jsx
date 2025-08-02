import * as React from "react"
import Svg, { Path } from "react-native-svg"

function DeliveryVehicle(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.94 8.55L20.89 7.5A2.73 2.73 0 0019 6.69h-4v-.58a2.75 2.75 0 00-2.75-2.75H4a.75.75 0 100 1.5h8.22c.69 0 1.25.56 1.25 1.25v6.33a.75.75 0 001.5 0V8.19h4c.331-.001.65.132.88.37l1.05 1c.143.148.246.33.3.53H17a.75.75 0 000 1.5h4.25v4.25a1.25 1.25 0 01-1.25 1.3h-1.11a2.5 2.5 0 00-4.89 0H8.66a2.48 2.48 0 10-.13 1.5h5.61a2.5 2.5 0 004.61 0H20a2.75 2.75 0 002.75-2.75V10.5a2.74 2.74 0 00-.81-1.95zM6.22 18.48a.82.82 0 11.78-.81.81.81 0 01-.78.81zm9.462-.509a.82.82 0 101.516-.622.82.82 0 00-1.517.622z"
        fill="#065E2C"
      />
      <Path
        d="M10.75 9a.76.76 0 00-.75-.75H2a.75.75 0 100 1.5h8a.76.76 0 00.75-.75zM10 11.25H5a.75.75 0 000 1.5h5a.75.75 0 000-1.5z"
        fill="#065E2C"
      />
    </Svg>
  )
}

export default DeliveryVehicle
