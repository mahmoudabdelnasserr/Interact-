"use client"
import { Email } from '@mui/icons-material'
import { Box, Button, CircularProgress, Paper, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../_redux/store'
import { setError, setLoading, setToken } from '../_redux/authSlice'
import { useRouter } from 'next/navigation'

export default function Login() {
    let dispatch = useDispatch();
    let router = useRouter();

    let isLoading = useSelector((store:State) => store.authReducer.isLoading)

    async function login(values: {email: string, password: string}) {
        dispatch(setLoading());
        let response = await fetch(`https://linked-posts.routemisr.com/users/signin`,{
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await response.json()
        if (response.ok){
            router.push('/');
            dispatch(setToken(data));


        } else{
            dispatch(setError(data.error))
        }
        
        
    }

    let {handleSubmit, handleChange, values} = useFormik({
        initialValues:{
            email: '',
            password: '',
        },
        onSubmit: login
    });
  return <>
    
    <Box sx={{textAlign: 'center'}}>
    <h2 >Login</h2>
    </Box>
    <Paper elevation={3} sx={{p:2, m:3}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '.5rem'}}>
        <TextField onChange= {handleChange} value={values.email} id="email" label="Email" type='email' variant="outlined" />
        <TextField onChange= {handleChange} value={values.password}  id="password" label="Password" type= 'password' variant="outlined" />
        <Button disabled={isLoading == true} type='submit' variant='contained'>{isLoading ? <CircularProgress color="secondary" /> : "Login"}</Button>
    </form>
    </Paper>
    
  
  </>

  
}
