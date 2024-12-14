'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CloudIcon } from 'lucide-react'

export default function Unauthorized() {
  useEffect(() => {
    // This effect will run on the client-side
    document.body.style.backgroundColor = '#1a1a1a'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  }

  const cloudVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: y => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: y * 0.2,
        ease: "easeOut"
      }
    })
  }

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.7,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center mb-8">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cloudVariants}
              initial="hidden"
              animate="visible"
              className="mx-2"
            >
              <CloudIcon className="w-12 h-12 text-blue-300" />
            </motion.div>
          ))}
        </div>
        <motion.h1
          className="text-4xl font-bold mb-4"
          variants={textVariants}
        >
          Oh oh! Unauthorized Access
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          variants={textVariants}
        >
          It seems like you don't have permission to access this page.
        </motion.p>
        <motion.div 
          variants={textVariants}
          className="w-64 h-64 mx-auto"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4soDrffrPhoY84JyV38uJ6drdtmVsFOHfoQ&s?height=256&width=256"
            alt="Cannot access"
            width={256}
            height={256}
            className="rounded-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

