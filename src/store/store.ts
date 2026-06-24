import { countSlice } from "@/features/countSlice/countSlice";
import { authApi } from "@/services/authApi";
import { ecommerceApi } from "@/services/ecommerce";
import { configureStore } from "@reduxjs/toolkit";

// set up the store
export const makeStore = () => {
    return configureStore({
        reducer: {
            count: countSlice.reducer,
            [ecommerceApi.reducerPath]: ecommerceApi.reducer,
            [authApi.reducerPath]: authApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                ecommerceApi.middleware,
                authApi.middleware,
            ),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
