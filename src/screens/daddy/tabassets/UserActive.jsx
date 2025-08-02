import * as React from "react"
import Svg, { Path } from "react-native-svg"
import commonStyles from "../../../commonstyles/CommonStyles"

function UserActive(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={25}
      height={24}
      viewBox="0 0 25 24"
      fill="none"
      {...props}
      color={commonStyles.btn2Color}
    >
      <Path
        d="M16.84 22H7.56a3.39 3.39 0 01-3.18-4.15l.24-1.14A3.29 3.29 0 017.79 14h8.82a3.29 3.29 0 013.17 2.71l.24 1.14A3.39 3.39 0 0116.84 22zM12.7 12h-1a4 4 0 01-4-4V5.36A3.35 3.35 0 0111.06 2h2.28a3.35 3.35 0 013.36 3.36V8a4 4 0 01-4 4z"
        fill={commonStyles.btn2Color}
      />
    </Svg>
  )
}

export default UserActive
