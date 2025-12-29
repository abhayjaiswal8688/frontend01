import React from 'react';
import { Navbar } from "./Navbar";
import logo from "/images/logo.jpg"; 

export function Hero(){
    return(
        // CHANGED: Replaced bg-green-100 with a premium glass effect (white/70 + blur)
        // Added sticky positioning so it stays visible while scrolling
        <div className="sticky top-0 z-50 w-full grid grid-cols-12 px-6 py-4 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm transition-all duration-300">
            
            {/* Logo Section */}
            <div className="col-span-10 md:col-span-3 flex items-center">
                <a href="/" className="flex items-center gap-2 group">
                    {/* Optional: Uncomment if you want to show the image logo
                    <img src={logo} alt="Logo" className="h-10 w-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" /> 
                    */}
                    
                    {/* Gradient Text Logo to match Homepage */}
                    <span className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-600 group-hover:opacity-80 transition-opacity">
                        Brain Help
                    </span>
                </a>
            </div>

            {/* Navbar Section */}
            <div className="pt-[76px] md:pt-0 col-span-2 md:col-span-9 flex items-center justify-end">
                <Navbar/>
            </div>
        </div>
    );
};
