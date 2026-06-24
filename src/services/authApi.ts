import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type UserLoginRequest = {
    email: string;
    password: string;
};

type RegisterUserRequest = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    address?: AddressRequest;
};

type AddressRequest = {
    addressLine1: string;
    addressLine2: string;
    road: string;
    linkAddress: string;
};

type BasedMessage = {
    message?: string;
};

type AuthResponse = {
    type?: string;
    accessToken?: string;
    refreshToken?: string;
};

const defaultRegisterAddress: AddressRequest = {
    addressLine1: "Default address",
    addressLine2: "",
    road: "",
    linkAddress: "",
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_ISHOP_BASE_URL}`,
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<AuthResponse, UserLoginRequest>({
            query: ({ email, password }) => ({
                url: `/auth/login`,
                method: "POST",
                body: {
                    email,
                    password,
                },
            }),
        }),
        registerUser: builder.mutation<BasedMessage, RegisterUserRequest>({
            query: (body) => ({
                url: `/users/user-signup`,
                method: "POST",
                body: {
                    ...body,
                    address: body.address ?? defaultRegisterAddress,
                },
            }),
        }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
