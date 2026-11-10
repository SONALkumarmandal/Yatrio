import { Compass, MessageCircle, Plane } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";

export function HowItWorks() {
  const steps = [
    { number: "01", title: "Pick a trip", text: "Find a place or a feeling that makes you want to pack a bag.", icon: Compass },
    { number: "02", title: "Chat with us on WhatsApp", text: "A real person helps turn your ideas into a thoughtful plan.", icon: MessageCircle },
    { number: "03", title: "Pack and go", text: "The details are handled. All that’s left is the lovely part.", icon: Plane },
  ];

  return (
    <section className="section-shell" id="our-way">
      <div className="mx-auto max-w-[1240px]">
        <SectionHeading
          description="The road to your next trip is a little easier with someone by your side."
          eyebrow="Chalo, let’s plan it"
          title="Three little steps. One big yatra."
        />
        <div className="road-steps">
          {steps.map(({ number, title, text, icon: Icon }) => (
            <article className="step-card" key={number}>
              <span className="road-stop">{number === "01" ? <Plane size={15} /> : <span>{number}</span>}</span>
              <span className="step-icon">
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
