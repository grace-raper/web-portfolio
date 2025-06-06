import React from 'react';
export function DownloadSection() {
  return <section id="download" className="w-full py-16 px-6 md:px-12 bg-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Photos?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          CaspirCam is currently available for iOS via TestFlight. Join our beta
          program to be among the first to experience AR-powered photo posing.
        </p>
        <div className="flex flex-col items-center">
          <a href="#" className="px-8 py-4 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-900 transition-colors mb-4">
            Download on TestFlight
          </a>
          <p className="text-sm opacity-80">
            Available for iOS devices. Requires iPhone with iOS 14.0 or later.
          </p>
        </div>
      </div>
    </section>;
}