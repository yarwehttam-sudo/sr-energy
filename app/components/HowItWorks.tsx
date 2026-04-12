const steps = [
  {
    number: "1",
    title: "Get a Free Quote",
    description:
      "Call us or fill out our form. No credit check, no obligation. We will ask about your home and energy usage to prepare your custom quote.",
  },
  {
    number: "2",
    title: "Site Assessment",
    description:
      "One of our certified technicians visits your home to assess your roof, electrical panel, and energy needs. Usually takes about an hour.",
  },
  {
    number: "3",
    title: "Professional Installation",
    description:
      "Our licensed team installs your system in as little as one day. Solar panels, battery, and EV charger all installed and tested before we leave.",
  },
  {
    number: "4",
    title: "Start Saving",
    description:
      "Your system goes live and you start saving immediately. Monitor your production and savings anytime through our customer app.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#1e2333] py-16 px-4">
      <h2 className="text-white text-3xl font-bold text-center mb-2">
        How It Works
      </h2>
      <p className="text-gray-400 text-center mb-12">
        Going solar with SR Energy is simple — no credit check, no pressure, no surprises
      </p>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-center gap-6 md:gap-0">
        {steps.map((step, index) => (
          <div key={step.number} className="flex md:flex-row items-start w-full md:w-auto">
            {/* Step card */}
            <div className="flex flex-col items-center text-center md:w-48 px-2">
              <div className="w-12 h-12 rounded-full bg-[#F0A500] text-[#1e2333] flex items-center justify-center text-xl font-bold mb-4 shrink-0">
                {step.number}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>

            {/* Connecting arrow — desktop only, not after last step */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-start pt-5 px-1 text-[#F0A500] text-2xl select-none">
                ›
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
