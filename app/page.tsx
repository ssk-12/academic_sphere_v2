'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, BookOpen, BarChart, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ElevateLandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center gap-3" href="#">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold h-6">Elevate</span>
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Elevate
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your one-stop platform for student management, LMS, and streamlined educational processes.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button>Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
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
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Streamline Your Educational Processes
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Elevate provides a unified platform to manage all aspects of your educational institution. From
                    student enrollment to grade management, we've got you covered.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <svg
                      className="text-green-500 h-5 w-5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-medium">Centralized Data Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="text-green-500 h-5 w-5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-medium">Automated Workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="text-green-500 h-5 w-5"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="font-medium">Real-time Collaboration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to transform your educational institution?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Contact us today to learn more about how Elevate can help your organization grow and succeed.
                </p>
              </div>
              <form className="w-full max-w-[600px] space-y-4">
                <Input
                  className="w-full"
                  type="text"
                  placeholder="Your Name"
                />
                <Input
                  className="w-full"
                  type="email"
                  placeholder="Your Email"
                />
                <Input
                  className="w-full"
                  type="text"
                  placeholder="Your Message"
                />
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="px-4 lg:px-6 py-4 bg-gray-200 dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Elevate. All rights reserved.</p>
      </footer>
    </div>
  )
}

