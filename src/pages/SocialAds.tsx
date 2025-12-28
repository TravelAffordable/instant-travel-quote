import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Calendar, MapPin, Check, Star, Clock } from "lucide-react";
import sundownRanch1 from "@/assets/sundown-ranch-1.jpeg";
import sundownRanch2 from "@/assets/sundown-ranch-2.jpeg";
import sundownRanch3 from "@/assets/sundown-ranch-3.jpeg";
import sundownRanch4 from "@/assets/sundown-ranch-4.jpeg";
import sundownRanch5 from "@/assets/sundown-ranch-5.jpeg";
import guesthouseA1 from "@/assets/guesthouse-a-1.png";
import guesthouseA2 from "@/assets/guesthouse-a-2.jpeg";
import guesthouseA3 from "@/assets/guesthouse-a-3.jpg";
import guesthouseA4 from "@/assets/guesthouse-a-4.jpeg";
import guesthouseA5 from "@/assets/guesthouse-a-5.jpg";
import guesthouseA6 from "@/assets/guesthouse-a-6.jpg";

const SocialAds = () => {
  const [activeAd, setActiveAd] = useState<'sundown' | 'guesthouse'>('sundown');

  const sundownPackages = [
    {
      name: "SUN3 - Valley Getaway",
      pricePerPerson: 2830,
      totalFor2: 5660,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Lunch in Sun City",
        "Shuttle to/from Sun City"
      ],
      highlight: "BEST VALUE"
    },
    {
      name: "SUN1 - Cruise Combo",
      pricePerPerson: 3530,
      totalFor2: 7060,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Sun City Maze",
        "2hr Sunday Buffet Cruise",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "MOST POPULAR"
    },
    {
      name: "SUN4 - Safari Weekender",
      pricePerPerson: 3530,
      totalFor2: 7060,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Pilanesberg Game Drive",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "ADVENTURE PICK"
    }
  ];

  const guesthousePackages = [
    {
      name: "SUN3 - Valley Getaway",
      pricePerPerson: 2150,
      totalFor2: 4300,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Lunch in Sun City",
        "Shuttle to/from Sun City"
      ],
      highlight: "BUDGET FRIENDLY"
    },
    {
      name: "SUN1 - Cruise Combo",
      pricePerPerson: 2850,
      totalFor2: 5700,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Sun City Maze",
        "2hr Sunday Buffet Cruise",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "GREAT VALUE"
    },
    {
      name: "SUN4 - Safari Weekender",
      pricePerPerson: 2850,
      totalFor2: 5700,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Pilanesberg Game Drive",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "SAFARI SPECIAL"
    }
  ];

  const packages = activeAd === 'sundown' ? sundownPackages : guesthousePackages;
  const hotelName = activeAd === 'sundown' ? 'Sundown Ranch Hotel' : 'Sun City Area Guesthouse A';
  const sundownImages = [sundownRanch1, sundownRanch2, sundownRanch3, sundownRanch4, sundownRanch5];
  const guesthouseImages = [guesthouseA1, guesthouseA2, guesthouseA3, guesthouseA4, guesthouseA5, guesthouseA6];
  const hotelImages = activeAd === 'sundown' ? sundownImages : guesthouseImages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-700 p-4">
      {/* Toggle between hotels */}
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          onClick={() => setActiveAd('sundown')}
          className={`${activeAd === 'sundown' ? 'bg-amber-500 text-black' : 'bg-black/30 text-white'}`}
        >
          Sundown Ranch Ads
        </Button>
        <Button 
          onClick={() => setActiveAd('guesthouse')}
          className={`${activeAd === 'guesthouse' ? 'bg-amber-500 text-black' : 'bg-black/30 text-white'}`}
        >
          Guesthouse A Ads
        </Button>
      </div>

      {/* Individual Ads - Square format for Instagram */}
      <div className="grid gap-8 max-w-6xl mx-auto">
        
        {/* AD 1: Hero Ad - Square Format */}
        <div className="bg-gradient-to-br from-black via-amber-950 to-black rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1/1', maxWidth: '600px', margin: '0 auto' }}>
          <div className="relative h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={hotelImages[0]} 
                alt={hotelName}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
              {/* Top Badge */}
              <div className="flex justify-between items-start">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm animate-pulse">
                  🔥 NEW YEAR SPECIAL
                </div>
                <div className="text-right">
                  <div className="text-amber-400 font-bold text-xs">7 MIN FROM</div>
                  <div className="text-white font-black text-lg">SUN CITY</div>
                </div>
              </div>

              {/* Middle - Main Message */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-amber-400 drop-shadow-lg leading-tight">
                  SUN CITY<br/>GETAWAY
                </h1>
                <p className="text-xl font-bold text-white/90">{hotelName}</p>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span className="text-lg font-semibold">31 Dec - 02 Jan 2026</span>
                </div>
              </div>

              {/* Bottom - Price & CTA */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-amber-400 text-sm font-bold">FROM ONLY</div>
                  <div className="text-5xl font-black text-white">
                    R{packages[0].pricePerPerson.toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">per person sharing • All-inclusive</div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Now
                  </div>
                </div>
                
                <div className="text-center text-amber-300 text-sm font-semibold">
                  📞 Book Now: 066 157 6757
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AD 2: Package Carousel Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.name}
              className="bg-gradient-to-br from-black to-amber-950 rounded-2xl overflow-hidden shadow-xl"
              style={{ aspectRatio: '4/5' }}
            >
              {/* Image Header */}
              <div className="h-1/3 relative">
                <img 
                  src={hotelImages[index % hotelImages.length]} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black">
                  {pkg.highlight}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 text-white space-y-3 h-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-400 leading-tight">{pkg.name}</h3>
                  <p className="text-xs text-white/70 mt-1">{hotelName} • 2 Nights B&B</p>
                  
                  <div className="mt-3 space-y-1">
                    {pkg.includes.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-amber-400 text-xs font-bold">PER PERSON</div>
                      <div className="text-3xl font-black text-white">R{pkg.pricePerPerson.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-xs">Total for 2</div>
                      <div className="text-lg font-bold text-amber-300">R{pkg.totalFor2.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-500 text-white text-center py-2 rounded-full text-sm font-bold">
                    📲 WhatsApp: 066 157 6757
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AD 3: Story Format - Vertical */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div 
            className="bg-gradient-to-b from-amber-600 via-orange-700 to-black rounded-3xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '9/16', width: '320px' }}
          >
            <div className="relative h-full">
              <div className="absolute inset-0">
                <img 
                  src={hotelImages[2]} 
                  alt="Valley of the Waves"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-5 text-white">
                {/* Top */}
                <div className="text-center space-y-2">
                  <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black inline-block animate-pulse">
                    ⏰ LIMITED SPOTS
                  </div>
                  <h2 className="text-2xl font-black text-amber-300">NEW YEAR</h2>
                  <h1 className="text-4xl font-black leading-none">SUN CITY<br/>ESCAPE</h1>
                </div>

                {/* Middle */}
                <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Calendar className="w-4 h-4" />
                      31 Dec - 02 Jan 2026
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {hotelName}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Clock className="w-4 h-4 text-amber-400" />
                      7 min from Sun City
                    </div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Valley of the Waves</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Sun City Entrance</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Lunch Included</div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Shuttle Transport</div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-amber-400 text-sm font-bold">FROM ONLY</div>
                    <div className="text-5xl font-black">R{packages[0].pricePerPerson.toLocaleString()}</div>
                    <div className="text-white/70 text-xs">per person • 2 Nights B&B</div>
                  </div>
                  
                  <div className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg">
                    BOOK NOW →
                  </div>
                  <div className="text-center text-amber-300 text-sm">
                    WhatsApp: 066 157 6757
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Story 2 - Safari Focus */}
          <div 
            className="bg-gradient-to-b from-green-800 via-emerald-900 to-black rounded-3xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '9/16', width: '320px' }}
          >
            <div className="relative h-full">
              <div className="absolute inset-0">
                <img 
                  src={hotelImages[1]} 
                  alt="Safari View"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/60 to-black" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-5 text-white">
                {/* Top */}
                <div className="text-center space-y-2">
                  <div className="bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-black inline-block">
                    🦁 SAFARI SPECIAL
                  </div>
                  <h2 className="text-xl font-black text-green-300">PILANESBERG</h2>
                  <h1 className="text-3xl font-black leading-none">GAME DRIVE<br/>+ SUN CITY</h1>
                </div>

                {/* Middle */}
                <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <h3 className="text-amber-400 font-bold text-center">SUN4 PACKAGE</h3>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> 2 Nights B&B</div>
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Pilanesberg Game Drive</div>
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Valley of the Waves</div>
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Sun City Entrance</div>
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> Lunch in Sun City</div>
                      <div className="flex items-center gap-2"><Star className="w-3 h-3 text-amber-400" /> All Shuttles</div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-green-300 text-sm font-bold">ONLY</div>
                    <div className="text-5xl font-black">R{packages[2].pricePerPerson.toLocaleString()}</div>
                    <div className="text-white/70 text-xs">per person sharing</div>
                    <div className="text-amber-300 text-sm mt-1">Total for 2: R{packages[2].totalFor2.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg">
                    WhatsApp Now →
                  </div>
                  <div className="text-center text-green-300 text-sm">
                    📞 066 157 6757
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AD 4: Facebook Wide Format */}
        <div 
          className="bg-gradient-to-r from-black via-amber-950 to-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '16/9', maxWidth: '800px', margin: '0 auto' }}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 grid grid-cols-3 gap-1">
              <img src={hotelImages[0]} alt="" className="w-full h-full object-cover opacity-60" />
              <img src={hotelImages[3]} alt="" className="w-full h-full object-cover opacity-60" />
              <img src={hotelImages[4]} alt="" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative h-full flex items-center justify-between p-8 text-white">
              {/* Left */}
              <div className="space-y-3 max-w-md">
                <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-black inline-block">
                  🎉 NEW YEAR 2026
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-amber-400 leading-tight">
                  SUN CITY ESCAPE
                </h1>
                <p className="text-lg text-white/90">{hotelName} • 7 min from Sun City</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    31 Dec - 02 Jan
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    2 Nights B&B
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="text-center space-y-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-amber-400 text-sm font-bold">PACKAGES FROM</div>
                  <div className="text-5xl font-black text-white">R{packages[0].pricePerPerson.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">per person sharing</div>
                </div>
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  066 157 6757
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AD 5: Comparison Card */}
        <div className="bg-gradient-to-br from-black to-amber-950 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-black inline-block mb-3">
              🎯 COMPARE PACKAGES
            </div>
            <h2 className="text-2xl font-black text-white">{hotelName}</h2>
            <p className="text-amber-400">31 Dec - 02 Jan 2026 • 2 Nights B&B</p>
          </div>

          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className="bg-black/40 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-amber-400 font-bold">{pkg.name}</h3>
                  <p className="text-white/70 text-sm">{pkg.includes.slice(2, 5).join(' • ')}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">R{pkg.pricePerPerson.toLocaleString()}</div>
                  <div className="text-amber-400 text-xs">per person</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="bg-green-500 text-white py-3 rounded-full font-bold text-lg">
              📲 WhatsApp: 066 157 6757
            </div>
            <p className="text-white/60 text-sm mt-2">Weekends available too!</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur rounded-xl text-white">
        <h3 className="text-xl font-bold text-amber-400 mb-4">📱 How to Use These Ads:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. <strong>Screenshot</strong> the ad you want to use</li>
          <li>2. <strong>Square ads (1:1)</strong> - Perfect for Instagram Feed & Facebook Posts</li>
          <li>3. <strong>Story ads (9:16)</strong> - Perfect for Instagram & Facebook Stories</li>
          <li>4. <strong>Wide ads (16:9)</strong> - Perfect for Facebook Cover & Carousel</li>
          <li>5. Post with captions like: "🎉 Ring in 2026 at Sun City! Limited spots - DM or WhatsApp now! 📲"</li>
        </ol>
      </div>
    </div>
  );
};

export default SocialAds;
