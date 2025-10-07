'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Layout components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Section components
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import SampleTracker from '@/components/sections/SampleTracker';
import SampleSubmission from '@/components/sections/SampleSubmission';
import Reports from '@/components/sections/Reports';

// Modal component for login (placeholder)
import LoginModal from '@/components/modals/LoginModal';

export default function HomePage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white">
      {/* Header */}
      <Header onLoginClick={() => setLoginModalOpen(true)} />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <Hero />

        {/* Services Section */}
        <Services />

        {/* Sample Tracker Section */}
        <SampleTracker />

        {/* Sample Submission Section */}
        <SampleSubmission />

        {/* Reports Section */}
        <Reports />

        {/* Floating Action Button for Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-strong flex items-center justify-center transition-colors"
              title="Soumettre un échantillon"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-success-100 rounded-full opacity-20 blur-3xl" />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
