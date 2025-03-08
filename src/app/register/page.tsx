"use client";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import classes from './page.module.css';
import React from "react";
import { UserReister } from "../interfaces";
import { useFormik } from "formik";
import { on } from "events";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();

  async function handleRegister(values: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) {
    let response = await fetch(
      `https://linked-posts.routemisr.com/users/signup`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok){

      let data = await response.json();
      console.log(data);
      router.push("/login");
      toast.success("Registered successfully");
    }
  }
  let { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    onSubmit: handleRegister,
  });

  const genders = [
    { label: "male", value: "male" },
    { label: "female", value: "female" },
  ];

  return (
    <>
    
     
      <Paper elevation={3} sx={{ p: 2, m: 3 }}>
      <Typography sx={{margin: '1rem',  fontSize: '32px'}}>Create an account</Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: ".5rem",
          }}
        >
          <TextField
            id="name"
            name="name"
            label="Full name"
            type="text"
            variant="outlined"
            onChange={handleChange}
            value={values.name}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            onChange={handleChange}
            value={values.email}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            onChange={handleChange}
            value={values.password}
          />
          <TextField
            id="rePassword"
            name="rePassword"
            label="Re-enter password"
            type="password"
            variant="outlined"
            onChange={handleChange}
            value={values.rePassword}
          />
          <TextField
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            variant="outlined"
            onChange={handleChange}
            value={values.dateOfBirth}
          />
          <TextField
            name="gender"
            id="outlined-select-currency"
            select
            label="Select"
            value={values.gender}
            helperText="Please select your gender"
            onChange={handleChange}
          >
            {" "}
            {genders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button sx={{paddingY: '16px'}} type="submit" variant="contained">
            Register
          </Button>
        </form>
      </Paper>
      
    </>
  );
}
