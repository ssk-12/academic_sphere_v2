'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, XCircle, AlertTriangle } from 'lucide-react'

export default function Unauthorized() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const messages = [
    "Oops! You've wandered into restricted territory.",
    "This page is playing hide and seek, and you're not 'it'!",
    "Error 403: Your digital passport has been denied.",
    "The resource you're looking for might be on vacation.",
    "This content is for VIPs only (Very Important Pixels).",
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
              <p className="mt-4 text-lg font-semibold text-gray-700">Checking access...</p>
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
              <p className="text-lg text-gray-600 mb-6">{randomMessage}</p>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                  <p className="text-sm text-yellow-700">
                    The page or resource you're looking for might not be available.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1"
                onClick={() => window.history.back()}
              >
                Go Back
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

