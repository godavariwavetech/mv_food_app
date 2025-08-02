import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

function Groceries(props) {
  return (
    <Svg
      width={49}
      height={48}
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path fill="url(#pattern0_97_105)" d="M0.75 0H48.75V48H0.75z" />
      <Defs>
        <Pattern
          id="pattern0_97_105"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_97_105" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_97_105"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  )
}

export default Groceries
