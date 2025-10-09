import * as React from "react"
import Svg, {
  G,
  Circle,
  Path,
  Defs,
  Pattern,
  Use,
  Image,
  Filter,
  FeGaussianBlur
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */
function OnboardingLogo1(props) {
  return (
    <Svg
      width={312}
      height={383}
      viewBox="0 0 312 383"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <G filter="url(#blurFilter)">
        <Circle cx={156} cy={159} r={121} fill="#B2E7C4" opacity={0.6} />
      </G>
      <Path fill="url(#pattern0_295_3200)" d="M0 0H311.14V383H0z" />
      <Defs>

        {/* 🔹 Blur filter definition */}
        <Filter id="blurFilter" x="0" y="0" width="312" height="383">
          <FeGaussianBlur stdDeviation="40" />
        </Filter>

        <Pattern
          id="pattern0_295_3200"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#onBoard1" transform="scale(.00123 .001)" />
        </Pattern>
        <Image
          id="onBoard1"
          width={814}
          height={1002}
          preserveAspectRatio="none"
          href={require('../tabassets/onBoard1.png')}
        />
      </Defs>
    </Svg>
  )
}
export default OnboardingLogo1
