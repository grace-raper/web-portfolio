import React from 'react';
export function Header() {
  return <header className="w-full py-6 px-6 md:px-12 absolute top-0 left-0 z-20">
      <div className="w-full md:w-1/2">
        <div className="max-w-4xl md:max-w-none">
          <h1 className="text-2xl font-bold text-[#374151] text-left">
            CaspirCam
          </h1>
        </div>
      </div>
    </header>;
}