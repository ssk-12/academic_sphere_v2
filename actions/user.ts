"use server";

import {prisma} from '@/lib/prisma'
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/auth";


export const signout = async () => {
  "use server"
  await signOut()
};

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(email, password)

  await signIn("credentials", {
    redirect: false,
    callbackUrl: "/",
    email,
    password,
  });
  redirect("/");
};

const register = async (formData: FormData) => {
  const fullName = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName  || !email || !password) {
    throw new Error("Please fill all fields");
  }

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hash(password, 12);

  // Create new user
  await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log(`User created successfully 🥂`);
  redirect("/login");
};

const fetchAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export { register, login, fetchAllUsers };
