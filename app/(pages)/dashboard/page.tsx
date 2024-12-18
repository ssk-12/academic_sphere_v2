'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, BookOpen, BarChart, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ElevateLandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center gap-3" href="#">
          <GraduationCap className="h-6 w-6" />
          <span className=" font-bold h-6 ">Elevate</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BookOpen className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Comprehensive LMS</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Manage courses, assignments, and learning materials with ease.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Student Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Track student progress, attendance, and performance effortlessly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BarChart className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Analytics & Reporting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Gain insights with powerful analytics and customizable reports.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Affordable Pricing
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Choose a plan that fits your institution's needs.
            </p>
            {/* Add pricing details here */}
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <Image
                alt="Elevate Dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About Elevate
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Elevate provides a unified platform to manage all aspects of your educational institution.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Contact Us
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                We'd love to hear from you! Reach out to us for more details.
              </p>
              <form className="w-full max-w-sm space-y-2">
                <Input className="max-w-lg flex-1" placeholder="Your Email" type="email" />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Elevate Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
