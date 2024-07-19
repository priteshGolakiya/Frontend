import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    setCartData: (state, action) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.items.length;
    },
    // addItem: (state, action) => {
    //   const newItem = action.payload;
    //   if (newItem && newItem.product && newItem.product._id) {
    //     const existingItem = state.items.find(
    //       (item) => item.product._id === newItem.product._id
    //     );
    //     if (existingItem) {
    //       existingItem.quantity += newItem.quantity;
    //       existingItem.totalPrice += newItem.totalPrice;
    //       existingItem.totalPrice = existingItem.totalPrice.toFixed(2);
    //       existingItem.totalPrice = Number(existingItem.totalPrice);
    //     } else {
    //       state.items.push(newItem);
    //     }
    //   } else {
    //     console.log("error");
    //   }
    //   // state.items.push(action.payload);
    //   // state.totalQuantity += 1;
    // },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      state.totalQuantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const { setCartData, addItem, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
