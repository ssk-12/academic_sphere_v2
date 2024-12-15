"use server";

import {prisma} from '@/lib/prisma'
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";


export const signout = async () => {
  "use server"
  await signOut()
};

const login = async (state: { message: string; success: boolean},formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Attempting login with:", email, password);

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("Login response:", res);

    if (!res) {
      console.error("Login failed:", res?.error || "Unexpected error");
      return { success: false, message: res?.error || "Login failed" };
    }

    console.log("Login successful:", res);
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("An error occurred during login:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
};



const register = async (state: { message: string; success: boolean},formData: FormData) => {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!fullName || !email || !password) {
    return { success: false, message: 'Please fill all fields' };
  }

  try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create new user
    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log('User created successfully 🥂');
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error('An error occurred during registration:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
};

const fetchAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export { register, login, fetchAllUsers };
