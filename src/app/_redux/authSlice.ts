import { init } from "next/dist/compiled/webpack/webpack";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

let initialState = {isLoading: false as Boolean , token: localStorage.getItem('token') as null | string, error: null as null | string}

let authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.isLoading = true
        },
        setToken: (state, action) => {
            state.isLoading = false,
            state.token = action.payload,
            localStorage.setItem('token', action.payload.token),
            toast.success(action.payload.message)
        },

        setError: (state, action) => {
            state.isLoading = false,
            state.error = action.payload,
            toast.error(action.payload);
        },
        removeToken: (state) => {
            state.token = null,
            localStorage.removeItem('token')
        }

    }

});

export let authReducer = authSlice.reducer;

export let {setLoading, setToken, setError, removeToken} = authSlice.actions;