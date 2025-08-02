import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

function Food(props) {
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
      <Path fill="url(#pattern0_97_99)" d="M0.75 0H48.75V48H0.75z" />
      <Defs>
        <Pattern
          id="pattern0_97_99"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_97_99" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_97_99"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  )
}

export default Food
