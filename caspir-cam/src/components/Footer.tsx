import React from 'react';
import { MailIcon } from 'lucide-react';
export function Footer() {
  return <footer className="w-full py-8 px-6 md:px-12 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">CaspirCam</h3>
        </div>
        <a href="mailto:hello@graceraper.com" className="p-2 hover:bg-gray-800 rounded-full transition-colors" aria-label="Send email">
          <MailIcon size={24} />
        </a>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} CaspirCam. All rights reserved.</p>
      </div>
    </footer>;
}