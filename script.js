/* ==========================================================
   SHORTLET MAGNIFICENT — DATA
   NOTE: Nightly rates below are placeholder figures — swap in
   your real per-night prices in PROPERTIES before going live.
   Cover photos are cropped from the brand's real Instagram
   posts (images/cover_*.jpg); add more of your own photos into
   the images[] array of each listing for a fuller gallery.
========================================================== */
const PROPERTIES = [
  {
    id: "shortlet-001",
    title: "Minimalist 2-Bedroom Condo",
    status: "Available",
    type: "2-Bedroom",
    location: "Ikate, Lekki",
    price: "₦120,000",
    priceValue: 120000,
    period: "/night",
    bedrooms: 2, bathrooms: 2, guests: 4,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Swimming Pool & Gym","24/7 Power & Fast WiFi","Fully Furnished, Secured Environment","Smart Access with Elevator","Fully Equipped Open-Plan Kitchen","Spacious Balconies & Bathtub"],
    images: [
      "images/cover_294262.jpg",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Minimalist living, elevated comfort. A stylish 2-bedroom condo in Ikate, Lekki — perfect for staycations, baecations, weekend escapes and business trips, with a swimming pool, gym and smart elevator access.",
    coords: "6.4432,3.5142",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-002",
    title: "Stylish 1-Bedroom Apartment",
    status: "Available",
    type: "1-Bedroom",
    location: "Lekki Phase 1",
    price: "₦75,000",
    priceValue: 75000,
    period: "/night",
    bedrooms: 1, bathrooms: 1, guests: 2,
    furnishing: "Fully Furnished",
    minStay: "1 night",
    amenities: ["Spacious Living Room with Sofa & Smart TV","Fully Equipped Kitchen","Comfortable Ensuite Bedroom","Fully Air-Conditioned","Fast WiFi + Smart TV","24/7 Electricity & Steady Water","Access to Building Gym","Secure Estate, Coded Entry & Reception"],
    images: [
      "images/cover_294261.jpg",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "POV: you booked a 1-bedroom and never wanted to leave. A cosy retreat perfect for a birthday getaway, baecation, workcation or solo recharge — thoughtfully designed for a relaxing stay in Lekki Phase 1.",
    coords: "6.4415,3.4707",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-003",
    title: "Open-Plan Studio Apartment",
    status: "Available",
    type: "Studio",
    location: "Lekki Phase 1",
    price: "₦60,000",
    priceValue: 60000,
    period: "/night",
    bedrooms: 1, bathrooms: 1, guests: 2,
    furnishing: "Fully Furnished",
    minStay: "1 night",
    amenities: ["Bright Open-Plan Lounge (Sofa + Smart TV)","Fully Fitted Kitchenette","Modern Bathroom","Fully Air-Conditioned","Fast WiFi + Smart TV","24/7 Electricity & Steady Water","Access to Building Gym","Secure Estate with Coded Entry"],
    images: [
      "images/cover_294260.jpg",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "POV: you realized a studio is actually enough. A stylish open-plan studio in Lekki Phase 1 — thoughtfully designed with everything you need for a relaxing birthday getaway, baecation or solo recharge.",
    coords: "6.4415,3.4707",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-004",
    title: "2-Bedroom Maisonette Apartment",
    status: "Available",
    type: "2-Bedroom",
    location: "Lekki Phase 1",
    price: "₦140,000",
    priceValue: 140000,
    period: "/night",
    bedrooms: 2, bathrooms: 2, guests: 4,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Sleeps up to 4 Guests","24/7 Power & Fast WiFi","Fully Furnished, Secure Environment","Prime Location, Great Access Roads","Swimming Pool & Gym","Spacious Balcony"],
    images: [
      "images/cover_294256.jpg",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "A 2-bedroom maisonette apartment in Lekki Phase 1, perfect for birthdays, baecations, group stays or a quiet reset — with a pool, gym and spacious balcony.",
    coords: "6.4415,3.4707",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-005",
    title: "Luxury 2-Bedroom Maisonette (Cinematic Bedroom)",
    status: "Available",
    type: "2-Bedroom",
    location: "Lekki Phase 1",
    price: "₦150,000",
    priceValue: 150000,
    period: "/night",
    bedrooms: 2, bathrooms: 2, guests: 4,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Sleeps up to 4 Guests","24/7 Power & Fast WiFi","Fully Furnished, Secure Environment","Prime Location, Great Access Roads","Snooker / Table Tennis + Pool + Gym","Spacious Balcony & Cinematic Bedroom"],
    images: [
      "images/cover_294243.jpg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Loft with a cinematic bedroom — book immediately. A luxury 2-bedroom maisonette in Lekki Phase 1, perfect for birthday stays, baecations, family stays or a quiet reset.",
    coords: "6.4415,3.4707",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-006",
    title: "Brand New 3-Bedroom Apartment",
    status: "Available",
    type: "3-Bedroom",
    location: "Lekki Phase 1",
    price: "₦200,000",
    priceValue: 200000,
    period: "/night",
    bedrooms: 3, bathrooms: 3, guests: 6,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Swimming Pool + Snooker / Tennis + PS5","Spacious Fully Equipped Kitchen","2 Private Balconies","24/7 Electricity + Security + Parking","Sleeps up to 6 Guests"],
    images: [
      "images/cover_294245.jpg",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Clean, perfect for your family staycation. A brand-new 3-bedroom apartment in Lekki Phase 1 designed for comfort, space and beautiful memories — great for group stays, family getaways or premium city retreats.",
    coords: "6.4415,3.4707",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-007",
    title: "3-Bedroom City-View Residence",
    status: "Available",
    type: "3-Bedroom",
    location: "Victoria Island",
    price: "₦220,000",
    priceValue: 220000,
    period: "/night",
    bedrooms: 3, bathrooms: 3, guests: 6,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["3 En-Suite Bedrooms","Fully Fitted Kitchen","High-Speed WiFi, Netflix & Cable TV","Stunning City Views","24/7 Power & Security","Dedicated Parking Space","Easy Access to Happening Places"],
    images: [
      "images/cover_294249.jpg",
      "images/cover_294253.jpg",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Staycation right in the heart of the city. Wake up to amazing city views in this beautifully designed, brand-new 3-bedroom shortlet residence in the heart of Victoria Island — perfect for staycations, business trips and extended stays.",
    coords: "6.4281,3.4219",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-008",
    title: "4-Bedroom Private Compound",
    status: "Available",
    type: "4-Bedroom",
    location: "Oniru, Victoria Island",
    price: "₦280,000",
    priceValue: 280000,
    period: "/night",
    bedrooms: 4, bathrooms: 4, guests: 8,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Outdoor Lounge + Table Tennis + PS5","Bathtub + Stylish Ensuite Rooms","Fully Equipped Kitchen + Dishwasher","Balconies + Spacious Outdoor Area","24/7 Power + WiFi + CCTV","Secure Compound + Dedicated Parking","3-Minute Walk to Ebeano"],
    images: [
      "images/cover_294244.jpg",
      "images/cover_294242.jpg",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Your next group getaway, sorted. A beautiful 4-bedroom private compound in Oniru, perfect for family stays, group trips and luxury escapes — sleeps up to 8 guests, 3 minutes' walk to Ebeano.",
    coords: "6.4331,3.4436",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-009",
    title: "2-Bedroom Apartment",
    status: "Available",
    type: "2-Bedroom",
    location: "Oniru, Victoria Island",
    price: "₦130,000",
    priceValue: 130000,
    period: "/night",
    bedrooms: 2, bathrooms: 2, guests: 4,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Swimming Pool + Gym + PS5","Fully Equipped Kitchen + Washing Machine","2 Balconies + Elevator","24/7 Power + WiFi + Secure Parking","Sleeps up to 4 Guests"],
    images: [
      "images/cover_294241.jpg",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Luxury, comfort and everything you need for a perfect Lagos stay. A brand-new 2-bedroom apartment in Oniru, VI with premium amenities — perfect for family stays, intimate getaways or a Lagos weekend escape.",
    coords: "6.4331,3.4436",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  },
  {
    id: "shortlet-010",
    title: "Modern Luxury 4-Bedroom",
    status: "Available",
    type: "4-Bedroom",
    location: "Banana Island Road, Ikoyi",
    price: "₦320,000",
    priceValue: 320000,
    period: "/night",
    bedrooms: 4, bathrooms: 4, guests: 8,
    furnishing: "Fully Furnished",
    minStay: "2 nights",
    amenities: ["Modern Luxury Interiors","Fully Fitted Kitchen","Smart TV & Fast WiFi","24/7 Power & Security","Secure Parking","Prime Banana Island Road Location"],
    images: [
      "images/cover_294263.jpg",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Modern luxury on Banana Island Road, Ikoyi — a striking 4-bedroom residence for guests who want the very best of Lagos, moments from the city's most exclusive address.",
    coords: "6.4396,3.4409",
    host: { name:"Shortlet Magnificent", company:"Shortlet Magnificent", phone:"+2348142230897", whatsapp:"2348142230897", email:"Magnificenthomes4u@gmail.com", photo:"images/cover_294249.jpg" }
  }
];

/* ==========================================================
   REVIEWS — text testimonials. Edit name, location, rating (1-5)
   and text here — this is the array the admin panel writes to.
========================================================== */
const REVIEWS = [
  { name:"Chioma Eze", location:"Lekki Phase 1", rating:5, text:"Spotless apartment, exactly like the photos, and check-in on WhatsApp was seamless from start to finish." },
  { name:"Tunde Bakare", location:"Ikoyi", rating:5, text:"Booked for a work trip and the location, security and fast WiFi made it easy to stay productive." },
  { name:"Amara Chukwu", location:"Victoria Island", rating:5, text:"Beautifully furnished, quiet building, and the host responded within minutes whenever I needed anything." }
];

const LOCATIONS = [
  { name:"Lekki Phase 1", img:"images/cover_294261.jpg" },
  { name:"Ikate, Lekki", img:"images/cover_294262.jpg" },
  { name:"Victoria Island", img:"images/cover_294249.jpg" },
  { name:"Oniru, VI", img:"images/cover_294244.jpg" },
  { name:"Ikoyi", img:"images/cover_294263.jpg" }
];

const CATEGORIES = [
  { name:"Studios", type:"Studio", icon:"studio" },
  { name:"1-Bedroom", type:"1-Bedroom", icon:"home" },
  { name:"2-Bedroom", type:"2-Bedroom", icon:"apartment" },
  { name:"3-Bedroom", type:"3-Bedroom", icon:"house" },
  { name:"4-Bedroom", type:"4-Bedroom", icon:"mountain" }
];

// The "Why Choose Us" wording the site starts with (the admin can change all of it).
const WHY_DEFAULTS = {
  title: "Why Choose Us",
  items: [
    { icon:"verified", title:"Verified Listings", text:"All properties are carefully verified for your peace of mind." },
    { icon:"guard", title:"Best Price Guidance", text:"We help you get the best value for your investment." },
    { icon:"support", title:"Friendly Support", text:"Our team is always ready to guide you every step of the way." }
  ]
};

// Amenities strip and trust/stats bar on the home page (all editable by the admin).
const AMENITIES_DEFAULTS = {
  title: "Amenities You'll Enjoy",
  subtitle: "Standard across our verified apartments.",
  items: [
    { icon:"pool", label:"Swimming Pool" },
    { icon:"gym", label:"Gym Access" },
    { icon:"wifi", label:"Fast WiFi" },
    { icon:"car", label:"Secure Parking" },
    { icon:"bolt", label:"24/7 Power" },
    { icon:"guard", label:"24/7 Security" }
  ]
};
const TRUST_DEFAULTS = {
  items: [
    { icon:"home", title:"Trusted By Guests", text:"3,000+ happy stays" },
    { icon:"verified", title:"Verified & Secure", text:"Every listing personally inspected" },
    { icon:"trend", title:"24/7 Support", text:"On WhatsApp, check-in to check-out" }
  ],
  stats: [
    { num:"500+", label:"Luxury Stays" },
    { num:"3,000+", label:"Happy Guests" },
    { num:"4.9", label:"Average Rating" },
    { num:"No", label:"Hidden Fees" }
  ]
};

/* ==========================================================
   ICON LIBRARY — used by "Browse by Type" and "Why Choose Us".
   The admin picks an icon by its key.
========================================================== */
const _IC = 'stroke="#f0c48d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const ICON_LIBRARY = {
  studio:    { label:"Studio",            svg:`<rect x="5" y="3" width="14" height="18" rx="1.4" ${_IC}/><path d="M9 8H9.01M15 8H15.01" ${_IC} stroke-width="2"/>` },
  home:      { label:"Home",              svg:`<path d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z" ${_IC}/>` },
  apartment: { label:"Apartment block",   svg:`<rect x="5" y="3" width="14" height="18" rx="1.4" ${_IC}/><path d="M9 8H9.01M15 8H15.01M9 12H9.01M15 12H15.01" ${_IC} stroke-width="2"/>` },
  house:     { label:"House",             svg:`<path d="M3 12L12 5L21 12" ${_IC}/><path d="M5 11V19H19V11" ${_IC}/>` },
  mountain:  { label:"Large home / villa", svg:`<path d="M3 18L8 9L12 14L16 7L21 18" ${_IC}/><path d="M3 18H21" ${_IC}/>` },
  building:  { label:"Tower / penthouse", svg:`<rect x="6" y="3" width="12" height="18" rx="1" ${_IC}/><path d="M9.5 7H9.6M14.5 7H14.6M9.5 11H9.6M14.5 11H14.6M9.5 15H9.6M14.5 15H14.6" ${_IC} stroke-width="2"/><path d="M10.5 21V18H13.5V21" ${_IC}/>` },
  bed:       { label:"Bed",               svg:`<path d="M3 18V7" ${_IC}/><path d="M3 14H21V18" ${_IC}/><path d="M21 14V11C21 9.9 20.1 9 19 9H11V14" ${_IC}/><circle cx="7" cy="11" r="1.6" ${_IC}/>` },
  key:       { label:"Key",               svg:`<circle cx="8" cy="15" r="3.2" ${_IC}/><path d="M10.3 12.7L19 4M16 7L18.5 9.5M13.5 9.5L15.5 11.5" ${_IC}/>` },
  pool:      { label:"Pool",              svg:`<path d="M3 18C4.5 18 4.5 16.5 6 16.5C7.5 16.5 7.5 18 9 18C10.5 18 10.5 16.5 12 16.5C13.5 16.5 13.5 18 15 18C16.5 18 16.5 16.5 18 16.5C19.5 16.5 19.5 18 21 18" ${_IC}/><path d="M8 13V6C8 4.9 8.9 4 10 4M15 13V6C15 4.9 15.9 4 17 4M8 8H15M8 11H15" ${_IC}/>` },
  star:      { label:"Star",              svg:`<path d="M12 4L14.5 9.3L20.3 10.1L16.1 14.1L17.2 20L12 17.1L6.8 20L7.9 14.1L3.7 10.1L9.5 9.3L12 4Z" ${_IC}/>` },
  sparkle:   { label:"Sparkle",           svg:`<path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z" ${_IC}/>` },
  heart:     { label:"Heart",             svg:`<path d="M12 19.5C12 19.5 4.5 15.2 4.5 9.8C4.5 7.2 6.5 5.5 8.7 5.5C10.2 5.5 11.3 6.3 12 7.4C12.7 6.3 13.8 5.5 15.3 5.5C17.5 5.5 19.5 7.2 19.5 9.8C19.5 15.2 12 19.5 12 19.5Z" ${_IC}/>` },
  verified:  { label:"Shield with tick",  svg:`<path d="M12 3L19 6V11C19 15.4 16 19.3 12 21C8 19.3 5 15.4 5 11V6L12 3Z" ${_IC}/><path d="M9.5 12L11.3 13.8L15 10" ${_IC}/>` },
  guard:     { label:"Shield",            svg:`<path d="M12 21C16 18.5 19 14.5 19 10V5L12 3L5 5V10C5 14.5 8 18.5 12 21Z" ${_IC}/><path d="M9 11.5L11 13.5L15 9" ${_IC}/>` },
  support:   { label:"Person / support",  svg:`<circle cx="12" cy="8" r="3.2" ${_IC}/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" ${_IC}/>` },
  phone:     { label:"Phone",             svg:`<path d="M4 5C4 4 5 3.5 6 3.5H8.5L10 8L8 9.5C8.8 11.5 10.5 13.2 12.5 14L14 12L18.5 13.5V16C18.5 17 18 18 17 18C10 18.5 4 12.5 4 5Z" ${_IC}/>` },
  wifi:      { label:"WiFi",              svg:`<path d="M3 9.5C7.5 5.5 16.5 5.5 21 9.5M6 13C9.2 10.3 14.8 10.3 18 13M9 16.5C10.8 15.2 13.2 15.2 15 16.5" ${_IC}/><path d="M12 19.5H12.01" ${_IC} stroke-width="2.4"/>` },
  bolt:      { label:"24/7 power",        svg:`<path d="M13 3L5 13.5H11L10 21L19 10H13L13 3Z" ${_IC}/>` },
  car:       { label:"Parking",           svg:`<path d="M5 17H4C3.4 17 3 16.6 3 16V12L5.2 7.2C5.5 6.5 6.2 6 7 6H17C17.8 6 18.5 6.5 18.8 7.2L21 12V16C21 16.6 20.6 17 20 17H19M5 12H19" ${_IC}/><circle cx="7.5" cy="17" r="1.8" ${_IC}/><circle cx="16.5" cy="17" r="1.8" ${_IC}/>` },
  pin:       { label:"Location pin",      svg:`<path d="M12 21C12 21 5 14.6 5 9.5C5 5.9 8.1 3 12 3C15.9 3 19 5.9 19 9.5C19 14.6 12 21 12 21Z" ${_IC}/><circle cx="12" cy="9.5" r="2.4" ${_IC}/>` },
  tag:       { label:"Price tag",         svg:`<path d="M3.5 11.8V4.5H10.8L20.5 14.2L13.2 21.5L3.5 11.8Z" ${_IC}/><circle cx="8" cy="9" r="1.2" ${_IC}/>` },
  gym:       { label:"Gym / dumbbell",    svg:`<path d="M6 7V17M18 7V17M3 12H6M18 12H21" ${_IC}/><path d="M6 9H18V15H6V9Z" ${_IC}/>` },
  trend:     { label:"Growth arrow",      svg:`<path d="M3 15L7 11L10.5 14L15 9L21 15" ${_IC}/><path d="M16 9H21V14" ${_IC}/>` },
  clock:     { label:"Clock",             svg:`<circle cx="12" cy="12" r="8.5" ${_IC}/><path d="M12 7.5V12L15 14" ${_IC}/>` }
};
function iconSVG(key, size){
  const it = ICON_LIBRARY[key] || ICON_LIBRARY.star;
  const n = size || 22;
  return `<svg viewBox="0 0 24 24" width="${n}" height="${n}" fill="none">${it.svg}</svg>`;
}

// Text that came from the admin panel is escaped before it goes into the page,
// and image links must be http(s) or one of the site's own images.
function escHTML(x){
  return String(x == null ? "" : x).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function safeImgUrl(u){
  u = String(u || "").trim();
  return /^(https:\/\/|http:\/\/|images\/|\/images\/)/i.test(u) ? u : "";
}


const money = (n) => "₦" + n.toLocaleString("en-NG");

/* ==========================================================
   STATE
========================================================== */
const state = {
  favorites: new Set(JSON.parse(sessionStorage.getItem("dh_favorites") || "[]")),
  filters: { location: "", type: "", priceMax: null },
  testimonialIndex: 0
};

function saveFavorites(){
  sessionStorage.setItem("dh_favorites", JSON.stringify([...state.favorites]));
}

/* ==========================================================
   RENDER: PROPERTY CARDS
========================================================== */
function propertyCardHTML(p){
  const badgeClass = p.status === "For Rent" ? "rent" : "";
  const isFav = state.favorites.has(p.id);
  return `
  <article class="property-card" data-id="${p.id}">
    <div class="property-media">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      <span class="property-badge ${badgeClass}">${p.status}</span>
      <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${p.id}" aria-label="Save to favourites">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none"><path d="M12 21C12 21 4 15.6 4 9.8C4 6.6 6.5 4.2 9.4 4.2C11 4.2 12 5 12 5C12 5 13 4.2 14.6 4.2C17.5 4.2 20 6.6 20 9.8C20 15.6 12 21 12 21Z" stroke="#172033" stroke-width="1.7" stroke-linejoin="round"/></svg>
      </button>
    </div>
    <div class="property-info">
      <h3>${p.title}</h3>
      <p class="property-loc">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 19 15.1 19 10.2C19 6.2 15.9 3 12 3C8.1 3 5 6.2 5 10.2C5 15.1 12 21 12 21Z" stroke="#9AA3B2" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" stroke="#9AA3B2" stroke-width="1.8"/></svg>
        ${p.location}
      </p>
      <p class="property-price">${p.price}${p.period ? `<span class="per"> ${p.period}</span>` : ""}</p>
      <div class="property-meta">
        ${p.bedrooms ? `<span>🛏 ${p.bedrooms} Beds</span>` : ""}
        ${p.bathrooms ? `<span>🛁 ${p.bathrooms} Baths</span>` : ""}
        ${p.guests ? `<span>👥 ${p.guests} Guests</span>` : ""}
      </div>
    </div>
  </article>`;
}

function renderProperties(list){
  const wrap = document.getElementById("propertyScroll");
  const dotsWrap = document.getElementById("propertyDots");
  if(!wrap) return;
  if(list.length === 0){
    wrap.innerHTML = `<p style="padding:24px 4px;color:#6B7383;font-size:14px;">No properties match your search. Try adjusting your filters.</p>`;
    dotsWrap.innerHTML = "";
    return;
  }
  wrap.innerHTML = list.map(propertyCardHTML).join("");
  dotsWrap.innerHTML = list.map((_, i) => `<span class="dot ${i===0 ? "active":""}"></span>`).join("");

  wrap.querySelectorAll(".property-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if(e.target.closest(".fav-btn")) return;
      window.location.href = `property.html?id=${card.dataset.id}`;
    });
  });
  wrap.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav;
      if(state.favorites.has(id)){ state.favorites.delete(id); btn.classList.remove("active"); showToast("Removed from favourites"); }
      else { state.favorites.add(id); btn.classList.add("active"); showToast("Saved to favourites"); }
      saveFavorites();
    });
  });

  // sync dots on scroll
  let ticking = false;
  wrap.addEventListener("scroll", () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cardWidth = wrap.firstElementChild ? wrap.firstElementChild.getBoundingClientRect().width + 14 : 1;
      const idx = Math.round(wrap.scrollLeft / cardWidth);
      dotsWrap.querySelectorAll(".dot").forEach((d,i) => d.classList.toggle("active", i===idx));
      ticking = false;
    });
  });
}

/* ==========================================================
   RENDER: REVIEWS (text testimonials)
========================================================== */
function starRow(rating){
  return Array.from({length:5}, (_, i) => `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="${i < rating ? "#f0c48d" : "none"}"><path d="M12 2.5L15 9.1L22 9.9L16.8 14.6L18.2 21.5L12 18L5.8 21.5L7.2 14.6L2 9.9L9 9.1L12 2.5Z" stroke="#f0c48d" stroke-width="1.3" stroke-linejoin="round"/></svg>`).join("");
}

function renderReviews(reviews){
  const wrap = document.getElementById("reviewScroll");
  const dotsWrap = document.getElementById("reviewDots");
  const prevBtn = document.getElementById("reviewPrev");
  const nextBtn = document.getElementById("reviewNext");
  if(!wrap) return;

  wrap.innerHTML = reviews.map((r, i) => `
    <div class="review-slide ${i===0 ? "active":""}" data-index="${i}">
      <div class="review-slide-body">
        <div class="review-stars">${starRow(r.rating)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-author">
          <span class="review-author-name">${r.name}</span>
          <span class="review-author-loc">${r.location}</span>
        </div>
      </div>
    </div>`).join("");

  if(dotsWrap){
    dotsWrap.innerHTML = reviews.map((_, i) => `<span class="dot ${i===0 ? "active":""}"></span>`).join("");
  }

  let idx = 0;
  const total = reviews.length;

  function goTo(newIdx){
    idx = (newIdx + total) % total;
    wrap.querySelectorAll(".review-slide").forEach((s, i) => s.classList.toggle("active", i === idx));
    if(dotsWrap) dotsWrap.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  if(total <= 1){
    if(prevBtn) prevBtn.setAttribute("disabled", "true");
    if(nextBtn) nextBtn.setAttribute("disabled", "true");
    if(dotsWrap) dotsWrap.style.display = "none";
  } else {
    if(prevBtn) prevBtn.addEventListener("click", () => goTo(idx - 1));
    if(nextBtn) nextBtn.addEventListener("click", () => goTo(idx + 1));
  }
}

/* ==========================================================
   GLOBAL: MEDIA LIGHTBOX (images + video) — used by Reviews,
   Gallery, and anywhere else that needs a full-view popup.
========================================================== */
function injectMediaLightbox(){
  if(document.getElementById("mediaLightbox")) return;
  const overlay = document.createElement("div");
  overlay.id = "mediaLightbox";
  overlay.className = "media-lightbox";
  overlay.innerHTML = `
    <button class="media-lightbox-close" id="mediaLightboxClose" aria-label="Close">&times;</button>
    <img id="mediaLightboxImg" src="" alt="" style="display:none;">
    <video id="mediaLightboxVideo" controls playsinline style="display:none;"></video>`;
  document.body.appendChild(overlay);

  function close(){
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
    const video = document.getElementById("mediaLightboxVideo");
    video.pause();
    video.src = "";
  }
  overlay.addEventListener("click", (e) => { if(e.target === overlay) close(); });
  document.getElementById("mediaLightboxClose").addEventListener("click", close);

  window.openMediaLightbox = function(src, alt){
    const img = document.getElementById("mediaLightboxImg");
    const video = document.getElementById("mediaLightboxVideo");
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
    if(isVideo){
      img.style.display = "none";
      video.style.display = "block";
      video.src = src;
      video.play().catch(() => {});
    } else {
      video.style.display = "none";
      video.pause();
      img.style.display = "block";
      img.src = src;
      img.alt = alt || "";
    }
    overlay.classList.add("open");
    document.body.classList.add("no-scroll");
  };
}


/* ==========================================================
   RENDER: LOCATIONS + CATEGORIES
========================================================== */
function renderLocations(list){
  const wrap = document.getElementById("locationChips");
  if(!wrap) return;
  const items = (list && list.length) ? list : LOCATIONS;
  wrap.innerHTML = items.map(l => `
    <div class="location-chip" data-loc="${escHTML(l.name)}">
      <div class="location-chip-img"><img src="${escHTML(safeImgUrl(l.img) || "images/bg-1.jpg")}" alt="${escHTML(l.name)}" loading="lazy"></div>
      <span>${escHTML(l.name)}</span>
    </div>`).join("");
  wrap.querySelectorAll(".location-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      window.location.href = `properties.html?location=${encodeURIComponent(chip.dataset.loc)}`;
    });
  });
}

// Amenities strip. Nothing saved = the page keeps its original cards.
function renderAmenities(cfg){
  const section = document.getElementById("amenities");
  if(!section || !cfg) return;
  const items = Array.isArray(cfg.items) ? cfg.items.filter(i => i && i.label) : [];
  if(!items.length) return;
  const grid = section.querySelector(".amenities-grid");
  if(grid){
    grid.innerHTML = items.map(i => `
      <div class="amenity-card">
        <span class="amenity-icon">${iconSVG(i.icon, 20)}</span>
        <span class="amenity-label">${escHTML(i.label)}</span>
      </div>`).join("");
  }
  const h2 = section.querySelector("h2");
  if(h2 && cfg.title){
    const node = Array.prototype.find.call(h2.childNodes, n => n.nodeType === 3 && n.nodeValue.trim());
    if(node) node.nodeValue = cfg.title;
  }
  const sub = section.querySelector(".demo-label");
  if(sub && typeof cfg.subtitle === "string") sub.textContent = cfg.subtitle;
}

// Trust badges + numbers bar at the top of the home page.
function renderTrust(cfg){
  const section = document.querySelector(".trust-section");
  if(!section || !cfg) return;
  const items = Array.isArray(cfg.items) ? cfg.items.filter(i => i && i.title) : [];
  if(items.length){
    const divider = section.querySelector(".trust-divider");
    section.querySelectorAll(".trust-item").forEach(el => el.remove());
    const html = items.map(i => `
      <div class="trust-item">
        <span class="trust-icon">${iconSVG(i.icon, 26)}</span>
        <h3>${escHTML(i.title)}</h3>
        <p>${escHTML(i.text)}</p>
      </div>`).join("");
    if(divider) divider.insertAdjacentHTML("beforebegin", html);
    else section.insertAdjacentHTML("afterbegin", html);
  }
  const stats = Array.isArray(cfg.stats) ? cfg.stats.filter(i => i && i.num) : [];
  const bar = section.querySelector(".stats-bar");
  if(bar && stats.length){
    bar.innerHTML = stats.map(i => `<div class="stat-item"><span class="stat-num">${escHTML(i.num)}</span><span class="stat-lbl">${escHTML(i.label)}</span></div>`).join("");
  }
}

function renderCategories(properties, list){
  const wrap = document.getElementById("categoryGrid");
  if(!wrap) return;
  const items = (list && list.length) ? list : CATEGORIES;
  const counts = {};
  properties.forEach(p => counts[p.type] = (counts[p.type]||0) + 1);
  wrap.innerHTML = items.map(c => `
    <div class="category-card" data-type="${escHTML(c.type)}">
      <span class="category-icon">${iconSVG(c.icon)}</span>
      <span class="label">${escHTML(c.name)}</span>
      <span class="count">${counts[c.type]||0} listings</span>
    </div>`).join("");
  wrap.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = `properties.html?type=${encodeURIComponent(card.dataset.type)}`;
    });
  });
}

// "Why Choose Us": if the admin has saved their own version, it replaces the
// starting cards. Nothing saved = the page keeps its original cards.
function renderWhy(cfg){
  const section = document.getElementById("why");
  if(!section || !cfg) return;
  const items = Array.isArray(cfg.items) ? cfg.items.filter(i => i && (i.title || i.text)) : [];
  if(!items.length) return;
  const list = section.querySelector(".why-list");
  if(list){
    list.innerHTML = items.map(i => `
      <div class="why-card">
        <span class="why-icon">${iconSVG(i.icon)}</span>
        <div>
          <h4>${escHTML(i.title)}</h4>
          <p>${escHTML(i.text)}</p>
        </div>
      </div>`).join("");
  }
  const heading = section.querySelector("h2");
  if(heading && cfg.title){
    heading.removeAttribute("data-cms");        // this heading is now managed here
    heading.removeAttribute("data-cms-orig");
    const node = Array.prototype.find.call(heading.childNodes, n => n.nodeType === 3 && n.nodeValue.trim());
    if(node) node.nodeValue = cfg.title;
    else heading.insertBefore(document.createTextNode(cfg.title), heading.firstChild);
  }
}

/* ==========================================================
   SEARCH / FILTER
========================================================== */
function applyFilter(partial){
  Object.assign(state.filters, partial);
  const { location, type, priceMax } = state.filters;
  const filtered = PROPERTIES.filter(p => {
    if(location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;
    if(type && p.type !== type) return false;
    if(priceMax && p.priceValue > priceMax) return false;
    return true;
  });
  renderProperties(filtered);

  if(document.getElementById("fieldLocation")){
    document.querySelector("#fieldLocation .search-value").textContent = location || "Select Location";
    document.querySelector("#fieldType .search-value").textContent = type || "All Types";
    document.querySelector("#fieldPrice .search-value").textContent = priceMax ? `Under ${money(priceMax)}/night` : "Any Price";
  }
}

function setupSearchFields(){
  if(!document.getElementById("fieldLocation")) return;
  const locations = ["", ...new Set(PROPERTIES.map(p => p.location))];
  const types = ["", ...new Set(PROPERTIES.map(p => p.type))];
  const priceOptions = [
    { label:"Any Price", value:null },
    { label:"Under ₦80,000/night", value:80000 },
    { label:"Under ₦150,000/night", value:150000 },
    { label:"Under ₦250,000/night", value:250000 },
    { label:"Under ₦350,000/night", value:350000 }
  ];

  document.getElementById("fieldLocation").addEventListener("click", async () => {
    const choice = await cyclePrompt("Select Location", locations.map(l => l || "Any Location"));
    if(choice !== null) applyFilter({ location: choice === "Any Location" ? "" : choice });
  });
  document.getElementById("fieldType").addEventListener("click", async () => {
    const choice = await cyclePrompt("Select Apartment Type", types.map(t => t || "All Types"));
    if(choice !== null) applyFilter({ type: choice === "All Types" ? "" : choice });
  });
  document.getElementById("fieldPrice").addEventListener("click", async () => {
    const labels = priceOptions.map(o => o.label);
    const choice = await cyclePrompt("Select Price Range", labels);
    if(choice !== null){
      const opt = priceOptions.find(o => o.label === choice);
      applyFilter({ priceMax: opt.value });
    }
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    const { location, type, priceMax } = state.filters;
    const params = new URLSearchParams();
    if(location) params.set("location", location);
    if(type) params.set("type", type);
    if(priceMax) params.set("priceMax", priceMax);
    window.location.href = "properties.html" + (params.toString() ? `?${params.toString()}` : "");
  });
}

// Lightweight in-page selector (no native alert/select — keeps it premium & on-brand)
function cyclePrompt(title, options){
  const existing = document.getElementById("dhPicker");
  if(existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay open";
  overlay.style.zIndex = "95";
  overlay.id = "dhPicker";

  const sheet = document.createElement("div");
  sheet.style.cssText = "position:fixed;left:0;right:0;bottom:0;background:#fff;border-radius:20px 20px 0 0;z-index:96;padding:20px 20px calc(24px + env(safe-area-inset-bottom));max-height:70vh;overflow-y:auto;";
  sheet.innerHTML = `<h3 style="font-family:'Plus Jakarta Sans';font-size:17px;font-weight:800;margin-bottom:14px;">${title}</h3>` +
    options.map(o => `<button type="button" class="dh-picker-opt" style="display:block;width:100%;text-align:left;padding:14px 4px;border:none;background:none;border-bottom:1px solid #E7E5DE;font-size:15px;font-weight:600;color:#172033;">${o}</button>`).join("");

  document.body.appendChild(overlay);
  document.body.appendChild(sheet);
  document.body.classList.add("no-scroll");

  return new Promise((resolve) => {
    function cleanup(val){
      overlay.remove(); sheet.remove();
      document.body.classList.remove("no-scroll");
      resolve(val);
    }
    overlay.addEventListener("click", () => cleanup(null));
    sheet.querySelectorAll(".dh-picker-opt").forEach(btn => {
      btn.addEventListener("click", () => cleanup(btn.textContent));
    });
  });
}

/* ==========================================================
   HAMBURGER DRAWER
========================================================== */
function setupDrawer(){
  const btn = document.getElementById("hamburgerBtn");
  const drawer = document.getElementById("navDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const closeBtn = document.getElementById("drawerClose");
  if(!btn) return;

  function open(){
    drawer.classList.add("open");
    overlay.classList.add("open");
    btn.setAttribute("aria-expanded","true");
    drawer.setAttribute("aria-hidden","false");
    document.body.classList.add("no-scroll");
  }
  function close(){
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
    drawer.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll");
  }
  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);
  drawer.querySelectorAll(".drawer-link").forEach(link => link.addEventListener("click", close));
}

/* ==========================================================
   TOAST
========================================================== */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById("toast");
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ==========================================================
   BOOKING REQUEST MODAL + BOTTOM NAV STUBS
========================================================== */
function setupModal(){
  const overlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("inspectionModal");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("inspectionForm");
  if(!modal) return;

  const guestCountEl = document.getElementById("guestCount");
  const guestMinus = document.getElementById("guestMinus");
  const guestPlus = document.getElementById("guestPlus");
  const checkinEl = form.querySelector('[name="checkin"]');
  const checkoutEl = form.querySelector('[name="checkout"]');
  const summaryEl = document.getElementById("priceSummary");
  const paymentBtns = modal.querySelectorAll(".payment-btn");
  const paymentHint = document.getElementById("paymentHint");
  const submitBtn = document.getElementById("modalSubmitBtn");
  let currentPrice = 0;
  let currentTitle = "";
  let currentProperty = null;
  let guests = 1;
  let paymentMethod = "Paystack";
  let appliedPromo = null;      // { code, discount } once a valid code is entered
  let promoCheckId = 0;

  // Small message lines under the promo box and the date pickers.
  const promoInput = form.querySelector('[name="promo"]');
  function statusLine(afterEl, id){
    let el = document.getElementById(id);
    if(!el && afterEl){
      el = document.createElement("p");
      el.id = id;
      el.style.cssText = "font-size:12.5px;line-height:1.4;margin:6px 2px 0;";
      afterEl.insertAdjacentElement("afterend", el);
    }
    return el;
  }
  function setStatus(el, msg, good){
    if(!el) return;
    el.textContent = msg || "";
    el.style.color = good ? "#2E9E5B" : "#801424";
  }
  const promoStatusEl = () => statusLine(promoInput, "promoStatus");
  const dateStatusEl = () => statusLine(checkoutEl && checkoutEl.closest(".form-row, .field, div") || checkoutEl, "dateStatus");

  function nightsBetween(){
    if(!checkinEl.value || !checkoutEl.value) return 0;
    const inD = new Date(checkinEl.value);
    const outD = new Date(checkoutEl.value);
    const diff = Math.round((outD - inD) / 86400000);
    return diff > 0 ? diff : 0;
  }

  function discountNow(){ return appliedPromo ? appliedPromo.discount : 0; }

  function currentTotal(){
    const nights = nightsBetween();
    if(!currentPrice || nights === 0) return 0;
    const discounted = Math.max(0, currentPrice * nights - discountNow());
    return discounted + Math.round(discounted * 0.05);
  }

  // Are the chosen dates free? Returns a message, or "" if they're fine.
  function dateProblem(){
    if(!checkinEl.value || !checkoutEl.value) return "";
    if(nightsBetween() === 0) return "Check-out must be after check-in.";
    if(typeof DataService === "undefined") return "";
    return DataService.availabilityProblem(currentProperty && currentProperty.blockedRanges, checkinEl.value, checkoutEl.value);
  }
  function checkDates(){
    const msg = dateProblem();
    setStatus(dateStatusEl(), msg, false);
    return msg;
  }

  // Re-check the promo code against the current dates and price.
  let promoTimer;
  function revalidatePromo(){
    clearTimeout(promoTimer);
    promoTimer = setTimeout(() => {
      const code = promoInput ? promoInput.value.trim() : "";
      const id = ++promoCheckId;
      const nights = nightsBetween();
      if(!code){ appliedPromo = null; setStatus(promoStatusEl(), ""); updateSummary(); return; }
      if(!nights){ appliedPromo = null; setStatus(promoStatusEl(), "Pick your dates first, then the code is applied."); updateSummary(); return; }
      if(typeof DataService === "undefined"){ return; }
      DataService.checkPromo(code, nights, currentPrice * nights).then((res) => {
        if(id !== promoCheckId) return;      // typed something newer meanwhile
        if(res.ok){
          appliedPromo = { code: res.code, discount: res.discount };
          setStatus(promoStatusEl(), `${res.code} applied — you save ${money(res.discount)}.`, true);
        } else {
          appliedPromo = null;
          setStatus(promoStatusEl(), res.reason, false);
        }
        updateSummary();
      });
    }, 450);
  }

  function updateSummary(){
    const nights = nightsBetween();
    if(!summaryEl) return;
    if(!currentPrice || nights === 0){
      summaryEl.innerHTML = `<p class="summary-hint">Pick your dates to see the total price.</p>`;
    } else {
      const subtotal = currentPrice * nights;
      const discount = discountNow();
      const discounted = Math.max(0, subtotal - discount);
      const serviceFee = Math.round(discounted * 0.05);
      const total = discounted + serviceFee;
      summaryEl.innerHTML = `
        <div class="summary-row"><span>${money(currentPrice)} × ${nights} night${nights > 1 ? "s" : ""}</span><span>${money(subtotal)}</span></div>
        ${discount ? `<div class="summary-row"><span>Promo ${appliedPromo.code}</span><span>−${money(discount)}</span></div>` : ""}
        <div class="summary-row"><span>Service fee</span><span>${money(serviceFee)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>`;
    }
    updateSubmitButton();
  }

  function updateSubmitButton(){
    if(!submitBtn) return;
    const total = currentTotal();
    if(paymentMethod === "Paystack"){
      submitBtn.textContent = total ? `Pay ${money(total)} with Paystack` : "Pay with Paystack";
      if(paymentHint) paymentHint.textContent = "Pay securely by card, transfer or USSD through Paystack.";
    } else {
      submitBtn.textContent = "Continue on WhatsApp";
      if(paymentHint) paymentHint.textContent = "We'll open WhatsApp with your booking details filled in — pay by bank transfer once we confirm availability.";
    }
  }

  guestMinus?.addEventListener("click", () => {
    guests = Math.max(1, guests - 1);
    guestCountEl.textContent = guests;
  });
  guestPlus?.addEventListener("click", () => {
    guests = Math.min(20, guests + 1);
    guestCountEl.textContent = guests;
  });
  const onDatesChanged = () => {
    // check-out can't be on or before check-in
    if(checkinEl.value){
      const next = new Date(checkinEl.value); next.setDate(next.getDate() + 1);
      checkoutEl.min = next.toISOString().slice(0, 10);
    }
    checkDates();
    revalidatePromo();
    updateSummary();
  };
  checkinEl?.addEventListener("change", onDatesChanged);
  checkoutEl?.addEventListener("change", onDatesChanged);
  promoInput?.addEventListener("input", revalidatePromo);
  paymentBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      paymentBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      paymentMethod = btn.dataset.method;
      updateSubmitButton();
    });
  });

  window.openInspectionModal = function(propertyTitle, priceValue, property){
    modal.classList.remove("success");
    form.reset();
    currentProperty = property || null;
    appliedPromo = null;
    setStatus(document.getElementById("promoStatus"), "");
    setStatus(document.getElementById("dateStatus"), "");
    checkinEl.min = new Date().toISOString().slice(0, 10);
    checkoutEl.min = checkinEl.min;
    guests = 1;
    if(guestCountEl) guestCountEl.textContent = "1";
    paymentBtns.forEach(b => b.classList.remove("active"));
    paymentBtns[0]?.classList.add("active");
    paymentMethod = paymentBtns[0]?.dataset.method || "Paystack";
    currentPrice = priceValue || 0;
    currentTitle = propertyTitle || "";
    document.getElementById("modalPropertyName").textContent = propertyTitle ? `For: ${propertyTitle}` : "";
    const priceEl = document.getElementById("modalPrice");
    if(priceEl) priceEl.textContent = currentPrice ? `${money(currentPrice)} / night` : "";
    updateSummary();
    overlay.classList.add("open");
    modal.classList.add("open");
    document.body.classList.add("no-scroll");
  };
  function close(){
    overlay.classList.remove("open");
    modal.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", close);

  function whatsAppCheckoutLink(fd, nights, total){
    const lines = [
      `Hi, I'd like to book: ${currentTitle || "a stay"}`,
      fd.get("checkin") && fd.get("checkout") ? `Dates: ${fd.get("checkin")} to ${fd.get("checkout")} (${nights} night${nights > 1 ? "s" : ""})` : "",
      `Guests: ${guests}`,
      total ? `Estimated total: ${money(total)}` : "",
      appliedPromo ? `Promo code: ${appliedPromo.code} (−${money(appliedPromo.discount)})` : "",
      `Name: ${fd.get("name")}`,
      `Phone: ${fd.get("phone")}`
    ].filter(Boolean).join("\n");
    return `https://wa.me/${((window.SITE_CONTACT || {}).whatsapp || "2348142230897").replace(/\D/g, "")}?text=${encodeURIComponent(lines)}`;
  }

  function payWithPaystack(fd, nights, total){
    const key = window.SITE_CONFIG?.paystackPublicKey;
    if(!key || key.startsWith("__")){
      showToast("Online payment isn't set up yet — please use WhatsApp to book.");
      return;
    }
    if(typeof PaystackPop === "undefined"){
      showToast("Payment couldn't load. Check your connection and try again.");
      return;
    }
    const handler = PaystackPop.setup({
      key,
      email: fd.get("email") || `${(fd.get("phone")||"guest").replace(/\D/g,"")}@guest.shortletmagnificent.com`,
      amount: Math.max(total, 1) * 100, // kobo
      currency: "NGN",
      metadata: {
        property: currentTitle,
        checkin: fd.get("checkin"),
        checkout: fd.get("checkout"),
        guests,
        name: fd.get("name"),
        phone: fd.get("phone")
      },
      callback: function(response){
        saveEnquiry({
          property: currentTitle || "General Enquiry",
          ...(currentProperty && currentProperty.location ? { propertyLocation: currentProperty.location } : {}),
          name: fd.get("name"), phone: fd.get("phone"),
          checkin: fd.get("checkin"), checkout: fd.get("checkout"),
          guests, promo: appliedPromo ? appliedPromo.code : "", discount: discountNow(),
          paymentMethod: "Paystack", nights, total,
          reference: response.reference,
          submittedAt: new Date().toISOString()
        });
        modal.classList.add("success");
        document.querySelector("#modalSuccess p").textContent = "Payment received! Your booking is confirmed — check WhatsApp for your receipt.";
        setTimeout(close, 5000);
      },
      onClose: function(){}
    });
    handler.openIframe();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const nights = nightsBetween();
    const total = currentTotal();

    if(!nights){
      showToast("Please choose your check-in and check-out dates.");
      return;
    }
    const problem = checkDates();
    if(problem){ showToast(problem); return; }

    if(paymentMethod === "Paystack"){
      payWithPaystack(fd, nights, total);
      return;
    }

    // Transfer / WhatsApp path
    saveEnquiry({
      property: currentTitle || "General Enquiry",
      ...(currentProperty && currentProperty.location ? { propertyLocation: currentProperty.location } : {}),
      name: fd.get("name"), phone: fd.get("phone"),
      checkin: fd.get("checkin"), checkout: fd.get("checkout"),
      guests, promo: appliedPromo ? appliedPromo.code : "", discount: discountNow(),
      paymentMethod: "Transfer", nights, total,
      submittedAt: new Date().toISOString()
    });
    window.open(whatsAppCheckoutLink(fd, nights, total), "_blank", "noopener");
    modal.classList.add("success");
    document.querySelector("#modalSuccess p").textContent = "Booking request sent! Continue the conversation on WhatsApp to confirm your dates and pay.";
    setTimeout(close, 5000);
  });
}

function saveEnquiry(entry){
  const list = JSON.parse(localStorage.getItem("dh_enquiries") || "[]");
  if(!entry.id) entry.id = "enq_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const user = (typeof Auth !== "undefined") ? Auth.currentUser() : null;
  if(user) entry.uid = user.uid;
  list.unshift(entry);
  localStorage.setItem("dh_enquiries", JSON.stringify(list));

  // Best-effort: also write to Firestore so this enquiry is visible in the
  // admin panel and from the guest's other devices. If it fails (offline,
  // Firestore not enabled yet), the local copy above still lets the guest
  // see it on this device, and the WhatsApp handoff still goes through.
  if(typeof DataService !== "undefined"){
    DataService.createEnquiry(entry).then((saved) => {
      if(!saved || !saved.orderNo) return;
      // Keep the order number on this device's copy and tell the guest.
      const copy = JSON.parse(localStorage.getItem("dh_enquiries") || "[]");
      const mine = copy.find((x) => x.id === entry.id);
      if(mine){ mine.orderNo = saved.orderNo; localStorage.setItem("dh_enquiries", JSON.stringify(copy)); }
      const msg = document.querySelector("#modalSuccess p");
      if(msg) msg.textContent += " Order number: " + saved.orderNo + ".";
    }).catch((err) => {
      console.warn("Enquiry saved locally but not to Firestore:", err.message);
    });
  }
}

/* ==========================================================
   GLOBAL: FLOATING WHATSAPP BUTTON
========================================================== */
function injectWhatsAppFloat(){
  if(document.getElementById("waFloat")) return;
  const a = document.createElement("a");
  a.id = "waFloat";
  a.className = "wa-float";
  a.href = "https://wa.me/" + ((window.SITE_CONTACT || {}).whatsapp || "2348142230897").replace(/\D/g, "") + "?text=" + encodeURIComponent("Hi, I'd like to book a shortlet apartment with Shortlet Magnificent.");
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat on WhatsApp");
  a.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 3C7 3 3 7 3 12C3 13.6 3.4 15.1 4.2 16.4L3 21L7.7 19.8C9 20.6 10.5 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 11.5C9.5 13.8 10.2 14.5 12.5 15.5C12.9 15.65 13.5 15.3 13.8 14.9L14.3 14.2C14.5 13.9 14.9 13.8 15.2 13.95L16.8 14.7C17.1 14.85 17.25 15.2 17.1 15.55C16.7 16.5 15.6 17.1 14.6 16.9C11.9 16.4 9.6 14.1 9.1 11.4C8.9 10.4 9.5 9.3 10.45 8.9C10.8 8.75 11.15 8.9 11.3 9.2L12.05 10.8C12.2 11.1 12.1 11.5 11.8 11.7L11.1 12.2C10.7 12.5 10.35 12.9 10.5 13.3" stroke="#fff" stroke-width="0.9"/></svg>`;
  document.body.appendChild(a);
}

/* ==========================================================
   GLOBAL: BACK TO TOP
========================================================== */
function injectBackToTop(){
  if(document.getElementById("backToTop")) return;
  const btn = document.createElement("button");
  btn.id = "backToTop";
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M12 19V6M12 6L6 12M12 6L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 520);
  }, { passive:true });
}

/* ==========================================================
   GLOBAL: "JUST BOOKED" SOCIAL-PROOF TOAST
========================================================== */
// Shows real bookings only. It listens live to the public "bookingFeed"
// (first name + area + time, written when a booking is saved). No bookings
// yet = no pop-up. The admin can switch it off in Settings.
function timeAgo(iso){
  const t = new Date(iso).getTime();
  if(isNaN(t)) return "";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if(mins < 1) return "just now";
  if(mins < 60) return mins + (mins === 1 ? " min ago" : " mins ago");
  const hrs = Math.round(mins / 60);
  if(hrs < 24) return hrs + (hrs === 1 ? " hour ago" : " hours ago");
  const days = Math.round(hrs / 24);
  return days + (days === 1 ? " day ago" : " days ago");
}

function injectBookingToast(){
  if(document.getElementById("bookedToast")) return;
  if(document.body.classList.contains("admin-body")) return;
  if(typeof DataService === "undefined" || !window.db) return;

  DataService.getSettings().then((settings) => {
    if(settings.bookingPopup === false) return;
    startBookingToast();
  });
}

function startBookingToast(){
  const el = document.createElement("div");
  el.id = "bookedToast";
  el.className = "booked-toast";
  document.body.appendChild(el);

  const MAX_AGE = 30 * 24 * 3600 * 1000;      // don't advertise bookings older than 30 days
  let feed = [];
  let seen = null;                            // ids we already know about (null until the first load)
  let cursor = 0;
  let hideTimer;

  function show(item){
    el.textContent = "";
    const close = document.createElement("button");
    close.className = "booked-toast-close";
    close.setAttribute("aria-label", "Dismiss");
    close.innerHTML = "&times;";
    close.addEventListener("click", () => el.classList.remove("show"));

    const recent = Date.now() - new Date(item.at).getTime() < 24 * 3600 * 1000;
    const title = document.createElement("p");
    title.className = "booked-toast-title";
    title.textContent = recent ? "🔥 Just Booked!" : "✅ Recently Booked";
    const body = document.createElement("p");
    body.className = "booked-toast-body";
    body.textContent = item.location
      ? `${item.name} booked a stay in ${item.location}`
      : `${item.name} booked a stay`;
    const time = document.createElement("p");
    time.className = "booked-toast-time";
    time.textContent = timeAgo(item.at);

    el.append(close, title, body, time);
    el.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => el.classList.remove("show"), 6000);
  }

  function eligible(){
    return feed.filter(i => i.at && Date.now() - new Date(i.at).getTime() < MAX_AGE);
  }
  function showNext(){
    const list = eligible();
    if(!list.length) return;
    show(list[cursor % list.length]);
    cursor++;
  }

  DataService.watchBookingFeed((items) => {
    feed = items;
    if(seen === null){
      seen = new Set(items.map(i => i.id));   // first load: nothing is "new" yet
      return;
    }
    // A booking that arrives while the page is open is shown straight away.
    const fresh = items.filter(i => !seen.has(i.id));
    items.forEach(i => seen.add(i.id));
    if(fresh.length) show(fresh[0]);
  });

  setTimeout(showNext, 4000);
  setInterval(showNext, 22000);
}

/* ==========================================================
   HERO BACKGROUND CROSSFADE (bg-1..bg-4, swap in your own photos)
========================================================== */
let heroIdx = 0;
function setupHeroBgRotation(){
  if(!document.getElementById("heroMedia")) return;
  setInterval(() => {
    const slides = document.querySelectorAll("#heroMedia .hero-bg-slide");
    if(slides.length < 2) return;
    slides[heroIdx % slides.length].classList.remove("active");
    heroIdx = (heroIdx + 1) % slides.length;
    slides[heroIdx].classList.add("active");
  }, 5000);
}

// Photos chosen by the admin (Home page -> Hero photos) replace the built-in ones.
function renderHeroPhotos(c){
  const box = document.getElementById("heroMedia");
  const urls = c && Array.isArray(c.items) ? c.items.map((x) => safeImgUrl(x && x.img)).filter(Boolean) : [];
  if(!box || !urls.length) return;
  const first = new Image();
  first.onload = () => {
    box.innerHTML = urls.map((u, i) =>
      `<img class="hero-bg-slide${i === 0 ? " active" : ""}" src="${escHTML(u)}" alt="Shortlet Magnificent apartment"${i ? ' loading="lazy"' : ""}>`
    ).join("");
    heroIdx = 0;
  };
  first.src = urls[0];
}

/* ==========================================================
   AUTH (Firebase Authentication)
========================================================== */
function goToLogin(){
  const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
  window.location.href = "login.html?next=" + next;
}

function setupAuth(){
  const authBtn = document.getElementById("authBtn");
  if(typeof Auth === "undefined") return;

  function updateAuthUI(user){
    if(authBtn) authBtn.textContent = user ? "Log Out" : "Log In";
    const profileAuthArea = document.getElementById("profileAuthArea");
    if(profileAuthArea){
      profileAuthArea.innerHTML = user
        ? `<p class="auth-status">Signed in as <strong>${escHTML(user.email)}</strong></p><button type="button" class="btn btn-outline btn-full" id="profileLogoutBtn">Log Out</button>`
        : `<p class="auth-status">Sign in to sync your bookings across devices.</p><button type="button" class="btn btn-gold btn-full" id="profileLoginBtn">Log In / Sign Up</button>`;
      document.getElementById("profileLoginBtn")?.addEventListener("click", goToLogin);
      document.getElementById("profileLogoutBtn")?.addEventListener("click", () => Auth.logout());
    }
    // Pre-fill guest profile email if empty and user is logged in
    if(user){
      const profile = JSON.parse(localStorage.getItem("dh_profile") || "null") || {};
      if(!profile.email){
        profile.email = user.email;
        localStorage.setItem("dh_profile", JSON.stringify(profile));
      }
    }
  }

  Auth.onInit(updateAuthUI);
  // The admin panel handles its own sign-in/out (no toast, no page reload).
  const isAdminPage = () => document.body.classList.contains("admin-body");
  Auth.onLogin((user) => { if(isAdminPage()) return; updateAuthUI(user); showToast("Logged in"); setTimeout(() => window.location.reload(), 600); });
  Auth.onLogout(() => { if(isAdminPage()) return; updateAuthUI(null); showToast("Logged out"); });

  authBtn?.addEventListener("click", () => {
    const user = Auth.currentUser();
    if(user) Auth.logout();
    else goToLogin();
  });
}

/* ==========================================================
   INIT
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const FEATURED_IDS = ["shortlet-001","shortlet-002","shortlet-007","shortlet-010"];
  setupSearchFields();
  setupDrawer();
  injectMediaLightbox();
  setupModal();
  injectWhatsAppFloat();
  injectBookingToast();
  setupHeroBgRotation();
  setupAuth();

  if(document.getElementById("propertyScroll") || document.getElementById("reviewScroll") || document.getElementById("categoryGrid")){
    Promise.all([DataService.listProperties(), DataService.listReviews(), DataService.getContent("categories")])
      .then(([properties, reviews, cats]) => {
        let featured = properties.filter(p => FEATURED_IDS.includes(p.id));
        if(featured.length === 0) featured = properties.slice(0, 4);
        renderProperties(featured);
        if(reviews && reviews.length > 0) {
          renderReviews(reviews);
        } else {
          const reviewWrap = document.getElementById("reviewScroll");
          if(reviewWrap) reviewWrap.innerHTML = '<p style="padding:20px;text-align:center;color:#6B6558;">No reviews available yet.</p>';
        }
        renderCategories(properties, cats && cats.items);
      })
      .catch((error) => {
        console.error("Error loading home content:", error);
        ErrorHandler.handleNetworkError(error, 'Loading featured properties');
      });
  }
  if(document.getElementById("heroMedia")){
    DataService.getContent("hero")
      .then(renderHeroPhotos)
      .catch((error) => {
        console.error("Error loading hero images:", error);
      });
  }
  if(document.getElementById("locationChips")){
    DataService.getContent("locations")
      .then((c) => renderLocations(c && c.items))
      .catch((error) => {
        console.error("Error loading locations:", error);
        ErrorHandler.handleNetworkError(error, 'Loading locations');
      });
  }
  if(document.getElementById("why")){
    DataService.getContent("why")
      .then(renderWhy)
      .catch((error) => {
        console.error("Error loading why section:", error);
      });
  }
  if(document.getElementById("amenities")){
    DataService.getContent("amenities")
      .then(renderAmenities)
      .catch((error) => {
        console.error("Error loading amenities:", error);
      });
  }
  if(document.querySelector(".trust-section")){
    DataService.getContent("trust")
      .then(renderTrust)
      .catch((error) => {
        console.error("Error loading trust content:", error);
      });
  }
});
