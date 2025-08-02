import * as React from "react"
import Svg, { Path, Defs, Pattern, Use, Image } from "react-native-svg"

function Meat(props) {
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
      <Path fill="url(#pattern0_97_102)" d="M0.25 0H48.25V48H0.25z" />
      <Defs>
        <Pattern
          id="pattern0_97_102"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#image0_97_102" transform="scale(.01042)" />
        </Pattern>
        <Image
          id="image0_97_102"
          width={96}
          height={96}
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ8UlEQVR4nO1ca1AU2RXubKLJlqi1Wsx0o+KqGCNRlMcAgoC8pxsUX7jGFyOgLG/z2Nr8SVm1sTabrJXKryQ/UrvxR2pTW5XarWTzKM0C2US7ZdqYRJ0GBBShe1RYRJhhgBk4qdvMKCqPmWZ67jD2V/VVUUDBOd9377n3nG4gCA0aNGjQoEGDBg0aNGjQoEGDBg0aXhJY+Kv7BJ5rEnjWLpi5IQvPNlj4q4W443opYOG58wLPwXS08NyPcccX0rjFc3tnEt/DlmaWxh1nyMLCsw1zGSDw3EXccYYsBDM3NJcBFp5zCTx36ZaZZXDHG3Kw8JzDix0wle/gjjmkIJhZm48GoB1RgDvukADP84sEMzvqqwGCmf077thDAi3NzQafxZd3APsYd+whAYFnf64ZgAk3mpvXKKn/7jOgEVfcIQHhp28ttfDcVSXiy2xm9+DOYcGiaf/6jV/s2TxgPluhTHwz+y7uHBYkLqa8GvGPlOXvNaWscDUmhgHibCbI/YGZ65fLFBrOmdnPteGcDwCC+Epj8rKohqSw042GJZ81GMKcHuGn8hkT5Ckod164xsU3NjZ+zZff12LmitDZ4J6kDgg892cLzyUToQw+nliEVnZTwquGz5OW7mlICKtqNIT9ojFxSVNj4pKB6QSfyQR0JrRev7JKSRwCz/1khp3kFJq5UiIYMVIe8027Ke6cvcxweeR08r2xylSbqybd5arLnID6LIAz2TBeu2tivHYXjFamjtvLE539pjjH3YObbTeZSBubvnLCW4HnYtMuaoQ7W7tMSR5o5c9xbjjRjiKCAYOmrWn2soS/jVXttCOB50tnTTr0nogFofB1uJz6mnIDUpYrPljlsjN34/YpgRN2U2zNyOlkK5yZXNmqsD4LHpclQce+jXBl5wrfTEheFqU0NwvPDXphwACBA7aSGONIRbKkmuhnZjaj35QAQsE6+CJ5+aziNxiWdCrNr43jlnnZuA0SgQQURy+2lyZcnHDXcpwcq06HruJoYNNWTm+CIeyC0jwt/JU4L/sHJ3qeEJAna0NHtm4dfTP1MW7hYZpd0VcSDzeMa6ApaenTHZAYVqE0V4Hn3lPQzKn3PMFuitnvqk53+iKMqyIZ7AfXy3RV7AiIGaPV6XDvUDTwmXpoSAjLUJJrC3/5W948TZuOqjxZGzq+/YirdteEr2Ig4W37ImXaizcEfGeM12f2QX3W76A+uxTqsg1QawyHs8WLZxW/udlg4dkOxbMknrvkX/FPbDsk398VCIDbAFBA8eNfuuYhvn9vRbbjCbHOmjSX0mRQ2bGjElS8QS5HuMX1hqNnD6OhHH4D+o4mLkMdbLDVeAgAuz/9cB4G+Ol5gqPc8J9QLDHgBYfPmeZhwNV98xZ/qCTm+94EGqoGwJls6PrL70Hg2TGBZz+x8Fz1rWbuuIXnzglm9taM4pvZ9+cv/rEYnbM6zRmqNR68pO1nFS3Cdfb15/UBgFfQKp98hsAOuB99NqHXIAl/wF5qaPJXEgv4jBiF2qxoItAYKd26abzO9/t+6JWozB8QOOAoS7zuz0QWpAH1WSwUF3814OIPlmxL9feAbcGdEfVZA/DdDMXj63nBUWa4hl2AM5hZl30Ai/gDZdErlMx6Qon9x2KgPUf3GywG2E1xH+AWADBy+FQytObooCU7HO7khpsCbsBcI4dQ5lhVGtzOp2TxEVuzw50dhVRkwMS3H4vZPVeQ4zUZMHRiG/TuXw/3C1eBtXAVPNy7FvoORsFQyXZwVqVhFxIU0FWbAZ3Mqifie9ieq2sJmAHDZfGXZg4yC2ymWFlwiaFmZf8bm8BVvXCMGK/PhLu7I18Q38OOfN33AmLAWOXO4ekCRFfS/kOb5hR+KpFRjvJE7OLCHES59ezbMKP4iG054cNQTKjbDwyeiE2fKcAvD0b5JP5TRoCj3BDU4ov7N84qvoedueHnVTXAdjL+4+mCfHR4s0Lx3TuhIAKcVTuDVPwor8SXb0R5+g5VDRg5taPn+SBtprh5ie8hOqBxCw5TOF6bCd1F670XP1/vXkz6LaqIDwTxiqsmY3xqkGjVotXrDwMQHx3bhl14Oa/qDLhbOPOB+0LpyZsUH1FkqB+qYsBgyZa9zwfad2CD38RH7KFJeHRiO/Ymq90Y4bX4Hbm6Z3IQaeqvqhhgL427MDVQR5nBr+J7eCdfB72Ht8hXWhzjBU+H6w3bc/VoxT9vgOLXG2eF41TizamH08O9kaoYIDEUtOXo4F7ROvmN50AIP1adBvf2rPNaeHnlTyk7z5Am7aoYMPpmypAnYNTNqiW+JK8iUjbhdh4Fj45vlw1XQ/iJuiz48mgMtOXofRJ/as1/MXbK/y/fwun4RRN1me6gM+H+7tWqGiC5z4NWzw2jYA0Mnoz3mxET9ZnyWdOe732t9/Cu+7YzM8lWVf6YwhM8GjWoLb7kZjc9WY6e1Nz8COj9zhYYrVQ2whitTIWHh6OfGaZ5y7accOimSS92L/UHvxtgM8W+PZlEFjwoWhswAyR3Obqd++LB2MmsBuvBTfJKtpcnyXXcVbtLjhHNbcaq0sFxegc8LokHa/Em6GTW+Cw6ItqFnXm6Fw7bWQwo97sB9pPxH8k3n3J1bj5zJsVQ8tb3lKRAsT1XJ+9C72MlHdZcvc7vBjjKDRwyoO+A0nmP/86Fjjz1jejI00G3ce5yM83q/zWhBkZOJd12VafLgzOcBkhTyhJq/aeeD/Nhq7uhumsk5Z+tKC6aHLbu1q9TxYDRih0PB4/FYBdemnZXUNCVr4fOXJ1cMpApk83UpDno49Zs9Hl0kE5+D9pFd/L00GUkfSwxsyyKAuptQs1HkA+K1Gu8FjpFmroK8cQi1QxwlBuGcScpBSlFmrJ2G1etJtTEwNEtI7gTlYKQqOu1FugTCbXxoCjShTtZKcgoMpRNMpKK/qjPZ1gZvQkNmXAnLQULabK3pzBiR0DEf2JCvv7bIkPdwp48g3nl09SN+wW69QQO3MlY+w2Rod6RaHL0JV35H/XuWbmUwA20GySG/OdLJPwjkaaOEMEGkab2hnJZEhlqAq161a+Z8wF6GamHjjgp0WRXiK36a2IBlUYsFNwsjl5sLSCLJZq8hF08Zj4k/4vyQP9njliokGgyQWSoCxJDLogGTqQpl0hTn0kMaSRCCZKRDBcZqlZiyH/J9TT4hO9AtzoxkK+X4wJKUjKSlRJD/lHuInGJzqBLA/muWEjFES8r2oxRXxeN1E4ro39LYshPJJoUVRGcRv0K+W+RoX7VQ0e88YAJJ3HnHrToKoh8rYeJSEHPVOUVSlO/RW+ZiQz1P1QqJJrsl/n0etgvMtRD99euiwz1JyS0RJM/6imIOIx6FcggfPqHqxo0aNCgQYMGDRo0aNCgQYMGDRo0EAHG/wFTsqZq94bWtgAAAABJRU5ErkJggg=="
        />
      </Defs>
    </Svg>
  )
}

export default Meat
