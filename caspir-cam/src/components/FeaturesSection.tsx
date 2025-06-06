import React from 'react';
export function FeaturesSection() {
  const features = [{
    step: '01',
    title: 'Choose a Template',
    description: 'Select from our library of pose templates or upload your own inspiration photo.'
  }, {
    step: '02',
    title: 'Follow the Guide',
    description: 'Position yourself according to the AR overlay that appears on your screen.'
  }, {
    step: '03',
    title: 'Get Feedback',
    description: 'Receive real-time audio and visual cues to help you adjust your pose.'
  }, {
    step: '04',
    title: 'Capture the Perfect Shot',
    description: 'Once aligned, take your photo and share your perfectly posed image.'
  }];
  return <section className="w-full py-24 px-6 md:px-12 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[var(--text)]">
          Make Your Photos Stand Out
        </h2>
        <p className="text-2xl text-center text-[var(--text-secondary)] mb-16 max-w-3xl mx-auto">
          Improving your photos has never been easier with our AR-powered posing
          guidance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <div key={index} className="relative group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-5xl font-bold text-[var(--primary)] opacity-80">
                  {feature.step}
                </div>
                {index < features.length - 1 && <div className="hidden lg:block absolute -right-4 top-12 w-8 h-0.5 bg-[var(--primary)] opacity-20" />}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[var(--text)]">
                {feature.title}
              </h3>
              <p className="text-lg text-[var(--text-secondary)]">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}