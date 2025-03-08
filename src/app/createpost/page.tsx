"use client"
import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react'
import toast from 'react-hot-toast';


export default function CreatePost() {
  let router = useRouter();
  async function handleAddPost(e: FormEvent){
    let form = e.target as HTMLFormElement
    e.preventDefault();
 
    let formData = new FormData();
    formData.append('body', form.body.value);
    
    if (form.image.files.length > 0) {
      formData.append("image", form.image.files[0]);
    }
    const response = await fetch('https://linked-posts.routemisr.com/posts',{
      method: 'POST',
      body: formData,
      headers:{
        'token': localStorage.getItem('token') || ''
      }
    });

    let data = await response.json();
    toast.success(data.message,{
      position: 'top-right'
    });
    router.push('/profile');

  }


  return <>
  <h2>Add Post</h2>
       <form onSubmit={(e) => handleAddPost(e)}  style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '.5rem'}}>
        <TextField name='body' id="body" label="body" type='text' variant="outlined" />
        <TextField name='image'  id="image" type= 'file' variant="outlined"/>
        <Button type='submit' variant='contained' sx={{height: '50px'}}>Add Post</Button>
    </form>
  
  </>
}
