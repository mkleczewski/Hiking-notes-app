import { Params } from "next/dist/shared/lib/router/utils/route-matcher"

const Region = ({params}: Params) => {

  return (
    <div>{params.code} </div>
  )
}

export default Region