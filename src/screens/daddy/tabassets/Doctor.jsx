import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

function Doctor(props) {
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
      <Path fill="url(#pattern0_97_108)" d="M0.25 0H48.25V48H0.25z" />
      <Defs>
        <Pattern
          id="pattern0_97_108"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_97_108" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_97_108"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEhElEQVR4nO2cS28URxDHV0TkUyRnJK4wnQUkDvOwo0B4GIzxcgG8J5J8gMhKIgFBCXAELgjJCGRLPGyw4QgEGYQ55Bwnxk5ugBHB3qmxdmfWU6jGGJmHbXZnZrt7pn5SSSutvTtV/+nu6praLhQYhmEYhmEYhmEYhmEYRgJtXQe/dEo91+zucsUplTFJo8+0u3sG2w8cXsfiLhN8u1R+mXTgPxCiVH759YHyFyzCezilnmtpB3+JXWEB3sNOYdpZYTqaZQE+GAHld4Kk2+drj8MCsAC5xuERwALkGodHAAuQaxweAZ8Odq7/3LU2doFl9IMlxl1TAFgC82Tugs/jFAPXNvZRTAqtoGJ9tcc1xaTsAIB69qRib+xILfDY2fkZWOK0Ao6iyuZaxin8pbAmcQE4+KIREX5PfNqRfWeBZuaZYlciwafFheY32Q6BZuaaxlQiC/NCtiPfIdDQXFN0xhYALGNAtiOgq5nicnwBTOMf6Y5Y2tp4EiPAVcAR1NMMNwEBZDshEJwizv3Qg7UL5zAYvYvz/01hWKkgBkFk9Hr+38noPfqbue8PI9hF+ddtifhP3mRevLf/W/QHLmL4YhobJZx+jv5AH3r7t7MADQe+ox2DW0OIgY+xCXwMhq+j19HGI+BTgl/99ScMK7OYNOHsDFaP9/IUtGzw2zdjcPsGpk0wMhh9F68BS4P/zVasP36IraI+9jD6Tl6ErYU7v5XBfyvCn48R2rdwFhS0YNpZDlqcc52GVk/83HDQVvvMRqke682nAN5uB8OZV9IFoIwrzRRVWQGiPL8JkhaA8G9ezZcAtDttdpMFKQhA1+J178iPAFReaBZIQwAaBQN9ORHALkZ1GtUECF9MR0W/zAtAVc04QEoCEHPfHcq+AFQuVlWA2vmz2RegPnovVoAhpq1EcP9O9gWgByeqCjA/9ST7AqxWagaJAtDGMPMCrJb/g0QB0K+xAMAC8BQEWZ6CeBGWLACnoZIFUHsjdib7izA1TakqwNyRg3kpxj1TToDw+dNUuukULUf3KSeA35+XcrSKD2T8Gnpd2/IjABl1JKgigD90JRUflRbA22Wr8VB+diafD+XJqsd7pQtQPfpjav4pLwDQVDQyiLLwb6TXDaGNAOAUsf7gj5YHvz72AKFtEwsAi825Yy1szn00ys25H21PH24uM2p42mnBna/PFGS9a9Sr2Ux2tBrhzP+pL7iZEADe9I1SuyBtkGLj16I8n9JeGb5oKQAsCtG1LSpbNFM7ov+h8kJaO9xcCACLZhejpinq26HWEepeiB7uUzkj8KPX85MT0XtUUo6qmtn5mSr/UBuaFcA04h+RDKb4W/ZdBLqaKf5KYgT0K+GMpaVdii0AHUingCOoo1VMsTe2ALhhw1qwjAnZzoBmRgcbJnaSIp0GKNsh0Mw8S+wsJAmdBijbKdDEXEv8VkgaOorRNY2Tsp0DDU5MTOXYykXoNEBeE8RHgm9MJD7trLQw04F0dCYa5br53KwZbuS7KS5TtkMxaUnwGYZhGIZhGIZhGIZhmIKuvAYvudJKQmZXywAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default Doctor
