import { useRef } from 'react';

const brands = [
  "City Lights Books",
  "Powell's Books",
  "Strand Book Store",
  "Shakespeare & Co",
  "Elliott Bay Book Co",
  "The Last Bookstore",
  "BookPeople",
  "Tattered Cover",
  "Daunt Books",
  "McNally Jackson"
];

const BrandShowcase = () => {
  return (
    <section className="py-16 md:py-24 border-y bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Trusted by over 1,000 independent bookstores
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* First set of logos */}
            {brands.map((brand, index) => (
              <div 
                key={index} 
                className="mx-12 text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-300 cursor-default select-none"
              >
                {brand}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div 
                key={`dup-${index}`} 
                className="mx-12 text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-300 cursor-default select-none"
              >
                {brand}
              </div>
            ))}
          </div>

          <div className="flex animate-marquee2 whitespace-nowrap absolute top-0">
            {/* Second set for seamless loop */}
            {brands.map((brand, index) => (
              <div 
                key={`set2-${index}`} 
                className="mx-12 text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-300 cursor-default select-none"
              >
                {brand}
              </div>
            ))}
            {/* Duplicate set */}
            {brands.map((brand, index) => (
              <div 
                key={`set2-dup-${index}`} 
                className="mx-12 text-2xl md:text-3xl font-bold text-muted-foreground/40 hover:text-primary transition-colors duration-300 cursor-default select-none"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 40s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:hover .animate-marquee2 {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandShowcase;
