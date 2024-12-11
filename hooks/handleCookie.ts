'use server'

import { cookies } from 'next/headers';

export  async function handleCookie({ name, value, options = {} }) {
  const cookieStore = await cookies();


    // Create the cookie if it doesn't exist
    cookieStore.set(name, value, options);
    console.log(cookieStore.get(name).value);
}


export  async function getCookie({ name }) {
  const cookieStore = await cookies();
  if(cookieStore.has(name)) {
  return cookieStore.get(name);}
  else {
    return null;
  }
}