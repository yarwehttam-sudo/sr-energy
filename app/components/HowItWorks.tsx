'use client';

const steps = [
  {
    number: '1',
    title: 'Get a Free Quote',
    description:
      'Call us or fill out our form. No credit check, no obligation. We will ask about your home and energy usage to prepare your custom quote.',
    icon: (
      // Phone / form icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Site Assessment',
    description:
      'One of our certified technicians visits your home to assess your roof, electrical panel, and energy needs. Usually takes about an hour.',
    icon: (
      // Clipboard / home icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Professional Installation',
    description:
      'Our licensed crew installs your solar system in one day — clean, code-compliant, and built to last. We handle all permits and utility paperwork.',
    icon: (
      // Wrench / tools icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Start Saving',
    description:
      'Flip the switch and watch your meter spin backward. Track real-time production through our app and enjoy lower — or eliminated — electricity bills from day one.',
    icon: (
      // Trending-up / savings icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#1e2333] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-white text-3xl font-bold text-center mb-2">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Going solar with SR Energy is simple — no credit check, no pressure,
          no surprises
        </p>

        {/* Steps row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center md:flex-1">
              {/* Step card */}
              <div className="flex flex-col items-center text-center flex-1 px-4">
                {/* Number badge */}
                <div className="w-12 h-12 rounded-full bg-[#F0A500] text-[#1e2333] font-bold text-2xl flex items-center justify-center mb-4">
                  {step.number}
                </div>

                {/* Pictogram icon */}
                <div className="text-[#F0A500]">{step.icon}</div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg mt-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mt-2 max-w-[200px]">
                  {step.description}
                </p>
              </div>

              {/* Connecting arrow — hidden on mobile, hidden after last step */}
              {index < steps.length - 1 && (
                <div className="hidden md:block text-[#F0A500] text-3xl font-bold select-none flex-shrink-0 px-1">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
