"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image 
            src="/Logo_image.png" 
            alt="Replin Logo" 
            width={80} 
            height={80} 
            priority
          />
        </motion.div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-white mt-4 rounded-full"
        />
      </div>
    </div>
  );
} 