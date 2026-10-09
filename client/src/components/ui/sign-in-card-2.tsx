'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Castle, Sparkles, User, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export function Component() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, token } = useAuthStore();
  
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(isSignUp ? "" : "admin@hallbooking.com");
  const [password, setPassword] = useState(isSignUp ? "" : "admin123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const destination = (location.state as any)?.from?.pathname || '/';

  // If user is already logged in, automatically proceed to website
  useEffect(() => {
    if (token) {
      navigate(destination, { replace: true });
    }
  }, [token, navigate, destination]);

  // Sync with route changes
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsSignUp(true);
    } else if (location.pathname === '/login') {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleToggleMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setShowPassword(false);
    if (signUpMode) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setEmail("admin@hallbooking.com");
      setPassword("admin123");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast.error('Please enter your full name');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        await signup(name, email, password);
        toast.success(`Welcome to GrandVenues, ${name}!`);
        navigate(destination, { replace: true });
      } else {
        await login(email, password);
        toast.success('Welcome back to GrandVenues!');
        navigate(destination, { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || (isSignUp ? 'Registration failed.' : 'Login failed. Please verify credentials.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0B09] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient effect - matched to GrandVenues golden royal theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#835D12]/30 via-[#3A2707]/50 to-[#0A0806]" />
      
      {/* Verified Unsplash Luxury Ballroom Stock Background */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-luminosity bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80")`,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial gold glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#E7CA70]/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#C39626]/20 blur-[60px]"
        animate={{ 
          opacity: [0.15, 0.35, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#A17619]/20 blur-[60px]"
        animate={{ 
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1
        }}
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[#FAF7F2]/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#C39626]/10 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div 
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 15px 2px rgba(195,150,38,0.15)",
                  "0 0 25px 6px rgba(231,202,112,0.25)",
                  "0 0 15px 2px rgba(195,150,38,0.15)"
                ],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut", 
                repeatType: "mirror" 
              }}
            />

            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              {/* Top light beam */}
              <motion.div 
                className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#E7CA70] to-transparent opacity-80"
                animate={{ 
                  left: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  left: { duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 },
                  opacity: { duration: 1.4, repeat: Infinity, repeatType: "mirror" },
                }}
              />
              
              {/* Right light beam */}
              <motion.div 
                className="absolute top-0 right-0 h-[50%] w-[2px] bg-gradient-to-b from-transparent via-[#C39626] to-transparent opacity-80"
                animate={{ 
                  top: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  top: { duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, delay: 0.7 },
                  opacity: { duration: 1.4, repeat: Infinity, repeatType: "mirror", delay: 0.7 },
                }}
              />
              
              {/* Bottom light beam */}
              <motion.div 
                className="absolute bottom-0 right-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#E7CA70] to-transparent opacity-80"
                animate={{ 
                  right: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  right: { duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, delay: 1.4 },
                  opacity: { duration: 1.4, repeat: Infinity, repeatType: "mirror", delay: 1.4 },
                }}
              />
              
              {/* Left light beam */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[50%] w-[2px] bg-gradient-to-b from-transparent via-[#C39626] to-transparent opacity-80"
                animate={{ 
                  bottom: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ 
                  bottom: { duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8, delay: 2.1 },
                  opacity: { duration: 1.4, repeat: Infinity, repeatType: "mirror", delay: 2.1 },
                }}
              />

              {/* Corner accent sparkles */}
              <motion.div 
                className="absolute top-0 left-0 h-[6px] w-[6px] rounded-full bg-[#E7CA70]/60 blur-[1px]"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
              />
              <motion.div 
                className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-[#E7CA70]/70 blur-[2px]"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-[#E7CA70]/70 blur-[2px]"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1 }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-[6px] w-[6px] rounded-full bg-[#E7CA70]/60 blur-[1px]"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
              />
            </div>

            {/* Card border glow */}
            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-200/20 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Glass card background */}
            <div className="relative bg-[#16120D]/90 backdrop-blur-2xl rounded-2xl p-6 border border-[#E7CA70]/20 shadow-2xl overflow-hidden">
              {/* Subtle card inner grid */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{
                  backgroundImage: `linear-gradient(135deg, #E7CA70 0.5px, transparent 0.5px), linear-gradient(45deg, #E7CA70 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Mode Switch Tabs */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-4">
                <button
                  type="button"
                  onClick={() => handleToggleMode(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    !isSignUp
                      ? 'bg-gradient-to-r from-[#A17619] to-[#C39626] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleMode(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isSignUp
                      ? 'bg-gradient-to-r from-[#A17619] to-[#C39626] text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#835D12] via-[#A17619] to-[#C39626] border border-[#E7CA70]/40 flex items-center justify-center relative overflow-hidden shadow-lg shadow-amber-950/40"
                >
                  <Castle className="w-6 h-6 text-white drop-shadow" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-60 pointer-events-none" />
                </motion.div>

                <motion.h1
                  key={isSignUp ? 'signup-title' : 'login-title'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-serif font-bold text-white tracking-tight"
                >
                  {isSignUp ? 'Create Guest Account' : 'GrandVenues Login'}
                </motion.h1>
                
                <motion.p
                  key={isSignUp ? 'signup-subtitle' : 'login-subtitle'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#E7CA70]/70 text-xs font-medium"
                >
                  {isSignUp
                    ? 'Register to book luxury banquet halls with instant confirmation'
                    : 'Sign in to access your booking dashboard & reserve venues'}
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <motion.div className="space-y-2.5">
                  {/* Full Name input (Only for Sign Up) */}
                  {isSignUp && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`relative ${focusedInput === "name" ? 'z-10' : ''}`}
                    >
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "name" ? 'text-[#E7CA70]' : 'text-white/40'
                        }`} />
                        
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedInput("name")}
                          onBlur={() => setFocusedInput(null)}
                          required={isSignUp}
                          className="w-full bg-white/5 border-white/10 focus:border-[#E7CA70]/60 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email input */}
                  <motion.div 
                    className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-[#E7CA70]' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-white/10 focus:border-[#E7CA70]/60 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div 
                    className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "password" ? 'text-[#E7CA70]' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={isSignUp ? "Password (min 6 characters)" : "Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-white/10 focus:border-[#E7CA70]/60 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      
                      {/* Toggle password visibility */}
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 cursor-pointer text-white/40 hover:text-white transition-colors duration-300 focus:outline-none"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Confirm Password input (Only for Sign Up) */}
                  {isSignUp && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`relative ${focusedInput === "confirmPassword" ? 'z-10' : ''}`}
                    >
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "confirmPassword" ? 'text-[#E7CA70]' : 'text-white/40'
                        }`} />
                        
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedInput("confirmPassword")}
                          onBlur={() => setFocusedInput(null)}
                          required={isSignUp}
                          className="w-full bg-white/5 border-white/10 focus:border-[#E7CA70]/60 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Default Credentials Quick Fill Hint (Only in Sign In mode) */}
                {!isSignUp && (
                  <div className="bg-amber-950/40 border border-[#E7CA70]/20 rounded-xl p-2.5 text-[11px] text-[#E7CA70]/90 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Default Admin:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@hallbooking.com');
                          setPassword('admin123');
                          toast.success('Default credentials filled');
                        }}
                        className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer"
                      >
                        Fill Admin
                      </button>
                    </div>
                    <p className="text-white/70">admin@hallbooking.com • admin123</p>
                  </div>
                )}

                {/* Remember me & Forgot password (Only in Sign In mode) */}
                {!isSignUp && (
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-[#C39626] checked:border-[#C39626] focus:outline-none focus:ring-1 focus:ring-[#E7CA70]/40 transition-all duration-200 cursor-pointer"
                        />
                        {rememberMe && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <label htmlFor="remember-me" className="text-xs text-white/60 hover:text-white/80 transition-colors duration-200 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-xs relative group/link">
                      <Link href="/check-booking" className="text-[#E7CA70]/80 hover:text-white transition-colors duration-200">
                        Track Booking?
                      </Link>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button mt-2 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-lg opacity-0 group-hover/button:opacity-80 transition-opacity duration-300" />
                  
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] text-white font-bold h-11 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg shadow-amber-950/40">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -z-10"
                      animate={{ 
                        x: ['-100%', '100%'],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        ease: "easeInOut", 
                        repeat: Infinity, 
                        repeatDelay: 1 
                      }}
                      style={{ 
                        opacity: isLoading ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key={isSignUp ? 'signup-btn' : 'signin-btn'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1.5 text-sm font-semibold tracking-wide"
                        >
                          {isSignUp ? (
                            <>
                              <span>Create Account & Enter</span>
                              <UserPlus className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                            </>
                          ) : (
                            <>
                              <span>Sign In to GrandVenues</span>
                              <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                            </>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Mode toggle message */}
                <div className="text-center pt-2">
                  {isSignUp ? (
                    <p className="text-xs text-white/60">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => handleToggleMode(false)}
                        className="text-[#E7CA70] hover:text-white font-semibold underline cursor-pointer transition-colors"
                      >
                        Sign in here
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-white/60">
                      New to GrandVenues?{' '}
                      <button
                        type="button"
                        onClick={() => handleToggleMode(true)}
                        className="text-[#E7CA70] hover:text-white font-semibold underline cursor-pointer transition-colors"
                      >
                        Create an account
                      </button>
                    </p>
                  )}
                </div>

                {/* Minimal Divider */}
                <div className="relative mt-2 mb-2 flex items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-3 text-[11px] uppercase tracking-wider text-white/40">
                    GrandVenues Experience
                  </span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* FAQs link */}
                <p className="text-center text-xs text-white/50">
                  Questions regarding slot bookings?{' '}
                  <Link 
                    href="/#faq" 
                    className="relative inline-block text-[#E7CA70] hover:text-white transition-colors duration-300 font-semibold"
                  >
                    View FAQs
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { Component as SignInCard2 };
export default Component;
