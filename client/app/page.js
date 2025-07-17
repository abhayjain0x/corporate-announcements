"use client";

import Entries from "@/components/entries";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 bg-off-white shadow-sm">
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="hidden sm:block text-xl font-semibold text-black font-inter">
                announcements watch
              </h1>
            </div>
            <div className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
              <img 
                src="/favicon.ico" 
                alt="Logo" 
                className="h-8 w-8"
              />
            </div>
            <div className="flex items-center">
              <Link 
                href="https://x.com/abhayjainp" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600 font-inter text-sm"
              >
                x
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto px-4 py-8">
        <Entries />
      </main>
    </div>
  );
}
