import * as React from "react"
import Svg, { Path } from "react-native-svg"

function StarIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}
    >
      <Path
        d="M15.7 8.723l-2.335 2.244.552 3.166a1.367 1.367 0 01-.545 1.344 1.404 1.404 0 01-1.48.114L9 14.093 6.108 15.59a1.405 1.405 0 01-1.48-.114 1.368 1.368 0 01-.544-1.344l.551-3.166L2.3 8.723a1.364 1.364 0 01-.358-1.41c.164-.51.597-.872 1.131-.948l3.232-.463 1.444-2.884A1.389 1.389 0 019 2.25a1.39 1.39 0 011.251.768l1.445 2.884 3.232.463c.533.076.966.439 1.13.947a1.363 1.363 0 01-.357 1.41z"
        fill="#FFBC3F"
      />
    </Svg>
  )
}

export default StarIcon
