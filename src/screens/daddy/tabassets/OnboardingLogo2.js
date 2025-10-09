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
function OnboardingLogo2(props) {
  return (
    <Svg
      width={293}
      height={428}
      viewBox="0 0 293 428"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <Path
        fill="url(#pattern0_3_5392)"
        d="M0.564941 0H292.434941V428H0.564941z"
      />
      {/* <G filter="url(#blurCircle)">
        <Circle cx={50} cy={150} r={100} fill="#B2E7C4" opacity={0.6} />
      </G> */}
      <Defs>

        {/* Blur filter */}
        {/* <Filter id="blurCircle" x="0" y="0" width="100%" height="100%">
          <FeGaussianBlur stdDeviation="40" />
        </Filter> */}

        <Pattern
          id="pattern0_3_5392"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#onBoard2" transform="scale(.00097 .00066)" />
        </Pattern>
        <Image
          id="onBoard2"
          width={1027}
          height={1506}
          preserveAspectRatio="none"
          href={require('../tabassets/onBoard2.png')}
        />
      </Defs>
    </Svg >
  )
}
export default OnboardingLogo2
