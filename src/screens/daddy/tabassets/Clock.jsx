// import * as React from "react"
// import Svg, { Path } from "react-native-svg"

// function Clock(props) {
//   return (
//     <Svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={20}
//       height={20}
//       viewBox="0 0 24 24"
//       fill="none"
//       {...props}
//     >
//       <Path
//         d="M8.65 7.59a.75.75 0 00-1.06 1.06l3.78 3.78v4.69a.75.75 0 001.5 0v-5a.75.75 0 00-.22-.53l-4-4z"
//         fill="#065E2C"
//       />
//       <Path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M10 2h4.24a8 8 0 018 8v4.24a8 8 0 01-8 8H10a8 8 0 01-8-8V10a8 8 0 018-8zm4.24 18.74a6.51 6.51 0 006.5-6.5V10a6.51 6.51 0 00-6.5-6.5H10A6.51 6.51 0 003.5 10v4.24a6.51 6.51 0 006.5 6.5h4.24z"
//         fill="#065E2C"
//       />
//     </Svg>
//   )
// }

// export default Clock





import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function Clock(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <G clipPath="url(#clip0_158_10041)">
        <Path
          d="M12.272 2.597l.514.513.824-.825-1.859-1.86-.825.826.52.52-.611.679a6.372 6.372 0 00-3.252-1.254V0H6.417v1.196A6.372 6.372 0 003.165 2.45l-.611-.679.556-.556L2.285.39.39 2.285l.824.825.514-.513.57.634a6.417 6.417 0 109.404 0l.57-.634zM7 8.75a1.163 1.163 0 01-.583-2.172V3.5h1.166v3.078A1.163 1.163 0 017 8.75z"
          fill="#ED165C"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_158_10041">
          <Path fill="#fff" d="M0 0H14V14H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default Clock
