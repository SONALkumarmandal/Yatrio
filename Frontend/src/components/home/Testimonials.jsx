import { Quote } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";

const testimonials = [
  {
    name: "Ananya",
    city: "Bengaluru",
    trip: "Slow Mornings: Kerala",
    quote: "The whole trip felt like it was made just for us. We could actually slow down and enjoy being together on the backwaters.",
  },
  {
    name: "Rohan",
    city: "Mumbai",
    trip: "Big Adventures: Ladakh",
    quote: "Every detail was thought through. Having a real person to text on WhatsApp made the mountain passes feel completely stress-free.",
  },
  {
    name: "Meera",
    city: "Pune",
    trip: "Heritage Trails: Rajasthan",
    quote: "We found the little quiet havelis we would have missed on our own. Planning with Yatrio felt as delightful as the holiday itself.",
  },
];

export function Testimonials() {
  return (
    <section className="section-shell testimonials-section" id="our-stories">
      <SectionHeading
        description="A few kind words from the road. Real travellers, real human planners, zero hassles."
        eyebrow="Postcards from the road"
        title="The best part is the feeling you bring home."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <Quote aria-hidden="true" className="testimonial-quote" size={32} />
            <p className="testimonial-copy">{testimonial.quote}</p>
            <div className="testimonial-footer">
              <span className="testimonial-person">
                {testimonial.name} <span>· {testimonial.city}</span>
              </span>
              <span className="testimonial-trip">{testimonial.trip}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
