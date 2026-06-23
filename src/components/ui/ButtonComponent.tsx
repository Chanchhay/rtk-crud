'use client'

import { useAppDispatch } from "@/store/hooks"
import { Button } from "./button"
import { decrement, increment, resetValue } from "@/features/countSlice/countSlice";

export default function ButtonComponent() {
  const dispatch = useAppDispatch();
  return (
    <div>

      <Button onClick={() => dispatch(increment())}> Increment </Button>
      <Button onClick={() => dispatch(decrement())}> Decrement </Button>
      <Button onClick={() => dispatch(resetValue())}> Reset </Button>
      {/* <Button onClick={}> Decrement </Button>
      <Button onClick={}> Reset </Button> */}

    </div>
  )
}
