import { getAssetUrl } from '../utils/assetUrl';

export function HeroSection() {
  return <section className="relative w-full">
      <div className="w-full">
        <picture>
          <source media="(min-width: 768px)" srcSet={getAssetUrl('web-background.png')} />
          <img src={getAssetUrl('mobilebg.png')} alt="" className="w-full h-auto object-contain" />
        </picture>
      </div>
      <div className="absolute inset-0 w-full h-full md:bg-transparent" />
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full flex md:items-center">
          <div className="relative z-10 w-full md:w-1/2 p-6 md:p-12 pt-24 md:pt-12">
            <div className="max-w-4xl md:max-w-none">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-[var(--text)] leading-tight">
                Perfect Your Photos with{' '}
                <span className="text-[var(--secondary)] font-italize">
                  AR Guidance
                </span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-[#374151] mb-6 md:mb-8 max-w-2xl">
                CaspirCam uses AR technology to help you nail the perfect pose
                every time. Select a template, follow the guide, and capture
                stunning photos.
              </p>
              <a href="#download" className="px-6 md:px-8 py-3 md:py-4 bg-[var(--primary)] text-white text-base md:text-lg font-medium rounded-full hover:bg-[var(--primary-dark)] transition-colors inline-block">
                Get Early Access
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
}