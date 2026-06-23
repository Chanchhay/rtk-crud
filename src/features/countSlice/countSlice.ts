import { createSlice } from "@reduxjs/toolkit";

const initializeValue ={
  value: 0
}
// create countSlice 
export const countSlice = createSlice({
  name:'count',
  initialState:initializeValue,
  reducers:{
      increment: (state) =>{ 
        //  const incrementValue = action?.payload; 
        //  update state when incrementValue has action/get action from payload
        // const value = incrementValue !== undefined? action.payload : 1;
         state.value += 1;
      },
      decrement: (state) => {
        //  const decrementValue = action.payload; 
        //  update state when incrementValue has action/get action from payload
         state.value -= 1;
      },
      resetValue: (state) => {
         state.value = 0;
      }
  }
})
export const {
  increment,
  decrement,
  resetValue
}= countSlice.actions;

export default countSlice.reducer;