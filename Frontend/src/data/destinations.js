export const destinations = [
  {
    slug: "kerala",
    name: "Kerala",
    state: "God's Own Country",
    region: "South",
    label: "Slow mornings",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    price: "₹18,500",
    duration: "5 nights / 6 days",
    season: "October – March",
    description:
      "Drift through quiet backwaters, wake to the scent of cardamom, and let the green of the Western Ghats slow everything down.",
    highlights: ["Alleppey houseboat", "Munnar tea gardens", "Fort Kochi cafés"],
    bestFor: "A little bit of everything",
    rating: "4.9",
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    state: "Land of high passes",
    region: "North",
    label: "Big adventures",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
    price: "₹32,000",
    duration: "6 nights / 7 days",
    season: "June – September",
    description:
      "Follow the long road over high mountain passes, between blue lakes and quiet monasteries, at a pace that lets the landscape sink in.",
    highlights: ["Pangong Tso", "Nubra Valley", "Thiksey Monastery"],
    bestFor: "Mountain lovers",
    rating: "4.9",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    state: "A land of stories",
    region: "West",
    label: "Heritage trails",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1400&q=85",
    price: "₹24,500",
    duration: "5 nights / 6 days",
    season: "October – March",
    description:
      "Wander through pink city streets, centuries-old havelis, and desert sunsets that stay with you long after the journey home.",
    highlights: ["Jaipur old city", "Udaipur lakes", "Jodhpur blue lanes"],
    bestFor: "Culture & history",
    rating: "4.8",
  },
  {
    slug: "goa",
    name: "Goa",
    state: "Find your own shore",
    region: "West",
    label: "Coastal escapes",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
    price: "₹16,000",
    duration: "4 nights / 5 days",
    season: "November – February",
    description:
      "Take the winding road to a quieter beach, linger over a long lunch, and discover the easy rhythm of the coast.",
    highlights: ["Fontainhas quarter", "South Goa beaches", "Spice farm lunch"],
    bestFor: "Beach & slow travel",
    rating: "4.8",
  },
  {
    slug: "himachal",
    name: "Himachal",
    state: "Into the mountains",
    region: "North",
    label: "Mountain hideaways",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
    price: "₹21,000",
    duration: "5 nights / 6 days",
    season: "March – June",
    description:
      "A quiet mountain homestay, cedar-scented trails, and nowhere you need to be except right here.",
    highlights: ["Old Manali lanes", "Solang Valley", "Naggar Castle"],
    bestFor: "Mountain hideaways",
    rating: "4.8",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    state: "A valley like no other",
    region: "North",
    label: "Lakes & gardens",
    image:
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1400&q=85",
    price: "₹27,500",
    duration: "5 nights / 6 days",
    season: "March – October",
    description:
      "Glide across Dal Lake at first light and follow a local's lead through gardens, orchards, and mountain valleys.",
    highlights: ["Dal Lake shikara", "Gulmarg meadows", "Old Srinagar"],
    bestFor: "A scenic escape",
    rating: "4.9",
  },
  {
    slug: "andaman",
    name: "Andaman",
    state: "Islands, at your pace",
    region: "Islands",
    label: "Island time",
    image:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1400&q=85",
    price: "₹34,000",
    duration: "5 nights / 6 days",
    season: "November – April",
    description:
      "Settle into island time with quiet stretches of sand, warm water, and boat rides to places that feel a world away.",
    highlights: ["Havelock Island", "Radhanagar Beach", "Neil Island"],
    bestFor: "A tropical escape",
    rating: "4.9",
  },
  {
    slug: "meghalaya",
    name: "Meghalaya",
    state: "The abode of clouds",
    region: "East",
    label: "Misty trails",
    image:
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1400&q=85",
    price: "₹26,000",
    duration: "5 nights / 6 days",
    season: "October – April",
    description:
      "Walk among living root bridges, wake to the rain-washed hills, and take the scenic road to India's sweetest little corners.",
    highlights: ["Living root bridges", "Dawki river", "Cherrapunji falls"],
    bestFor: "Offbeat exploration",
    rating: "4.8",
  },
  {
    slug: "bali",
    name: "Bali",
    state: "A little further away",
    region: "Beyond",
    label: "Beyond India",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85",
    price: "₹48,000",
    duration: "6 nights / 7 days",
    season: "April – October",
    description:
      "Find your way from green Ubud mornings to the soft glow of the coast, with time left over to do absolutely nothing.",
    highlights: ["Ubud rice terraces", "Temple at sunset", "Island day trip"],
    bestFor: "A change of scenery",
    rating: "4.9",
  },
];

export const regions = ["All regions", "North", "South", "West", "East", "Islands", "Beyond"];

export const whatsappUrl = (message) =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;
