import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, GraduationCap, MapPin, BookOpen, Calendar, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Province → Areas mapping
const PROVINCES: Record<string, string[]> = {
  'Gauteng': ['Pretoria', 'Johannesburg', 'Vaal'],
  'North West': ['Harties', 'Brits', 'Pilanesberg National Park', 'Sun City Resort'],
  'Mpumalanga': ['Witbank', 'Kruger National Park', 'Panorama Route'],
  'Limpopo': ['Bela Bela', 'Mapungubwe', 'Venda'],
  'Eastern Cape': ['Port Elizabeth', 'East London'],
  'KwaZulu-Natal': ['Durban', 'Umhlanga', 'Lake St Lucia', 'Drakensberg', 'Shakaland', 'Battlefields'],
};

// Subject matters
const SUBJECTS = [
  'History Tour',
  'Geography Tour',
  'Maths Tour',
  'Science Tour',
  'Life Sciences Tour',
];

// Educational tours by subject + area
const EDUCATIONAL_TOURS: Record<string, Record<string, string[]>> = {
  'History Tour': {
    'Pretoria': ['Voortrekker Monument Tour', 'Freedom Park Heritage Walk', 'Union Buildings Historical Tour', 'Marabastad Heritage Walk'],
    'Johannesburg': ['Apartheid Museum Experience', 'Constitution Hill Tour', 'Soweto Historical Tour', 'Liliesleaf Farm Liberation Tour'],
    'Vaal': ['Sharpeville Memorial Tour', 'Vaal Dam War History Walk', 'Anglo-Boer War Battlefields Tour'],
    'Harties': ['Hartbeespoort Dam Heritage Tour', 'Old Crocodile River Trading Post Walk'],
    'Brits': ['Hartbeespoort Heritage Trail', 'Early Settlers Museum Visit'],
    'Pilanesberg National Park': ['Ancient Volcanic History Tour', 'San Rock Art Discovery Walk'],
    'Sun City Resort': ['Lost City Cultural History Tour', 'Sun City Development Story Tour'],
    'Witbank': ['Coal Mining Heritage Tour', 'Witbank Dam Historical Walk'],
    'Kruger National Park': ['Kruger Conservation History Tour', 'Jock of the Bushveld Trail'],
    'Panorama Route': ['Gold Rush History Trail', 'Pilgrim\'s Rest Living Museum Tour'],
    'Bela Bela': ['Waterberg Cultural Heritage Tour', 'Nylstroom Voortrekker History Walk'],
    'Mapungubwe': ['Mapungubwe Kingdom Heritage Tour', 'Iron Age Settlement Discovery Walk', 'UNESCO World Heritage Site Tour'],
    'Venda': ['Venda Cultural Heritage Tour', 'Sacred Forest History Walk', 'Thulamela Archaeological Tour'],
    'Port Elizabeth': ['Route 67 Heritage Trail', 'Donkin Reserve Historical Walk', 'Red Location Museum Tour'],
    'East London': ['East London Museum Tour', 'Anglo-Boer War Fort Walk', 'Coelacanth Discovery Centre'],
    'Durban': ['KwaMuhle Museum Tour', 'Durban Old Fort Heritage Walk', 'Sugar Terminal History Tour'],
    'Umhlanga': ['Umhlanga Heritage Lighthouse Tour', 'North Coast Sugar Cane History Walk'],
    'Lake St Lucia': ['iSimangaliso World Heritage Tour', 'Zulu Kingdom History Walk'],
    'Drakensberg': ['San Rock Art Discovery Tour', 'Battle of Isandlwana Tour', 'Bushman Cave Paintings Walk'],
    'Shakaland': ['Shaka Zulu Kingdom Experience', 'Traditional Zulu Cultural Tour', 'Great Kraal Heritage Walk'],
    'Battlefields': ['Battle of Blood River Tour', 'Isandlwana & Rorke\'s Drift Tour', 'Spioenkop Battlefield Walk', 'Anglo-Zulu War Heritage Trail'],
  },
  'Geography Tour': {
    'Pretoria': ['Pretoria National Botanical Garden Tour', 'Tswaing Meteorite Crater Exploration'],
    'Johannesburg': ['Walter Sisulu Botanical Gardens Tour', 'Cradle of Humankind Geological Walk', 'Jukskei River Catchment Study'],
    'Vaal': ['Vaal River Ecosystem Study Tour', 'Vaal Dam Water Systems Tour', 'Wetland Biodiversity Walk'],
    'Harties': ['Hartbeespoort Dam Geography Tour', 'Magaliesberg Mountain Formation Walk'],
    'Brits': ['Crocodile River Basin Study', 'Agricultural Landscape Tour'],
    'Pilanesberg National Park': ['Alkaline Ring Complex Tour', 'Volcanic Crater Geography Walk'],
    'Sun City Resort': ['Pilanesberg Volcanic Landscape Tour', 'Bushveld Biome Study'],
    'Witbank': ['Coal Formation Geology Tour', 'Highveld Grassland Ecosystem Study'],
    'Kruger National Park': ['Lowveld Ecosystem Tour', 'River Systems Study Walk', 'Savanna Biome Exploration'],
    'Panorama Route': ['Blyde River Canyon Formation Tour', 'Three Rondavels Geology Walk', 'God\'s Window Escarpment Study'],
    'Bela Bela': ['Waterberg Biosphere Reserve Tour', 'Hot Springs Geological Study', 'Bushveld Vegetation Zone Walk'],
    'Mapungubwe': ['Limpopo River Confluence Study', 'Sandstone Formations Tour', 'Semi-Arid Ecosystem Walk'],
    'Venda': ['Soutpansberg Mountain Range Tour', 'Sacred Lakes Geography Study', 'Subtropical Forest Walk'],
    'Port Elizabeth': ['Coastal Dune Systems Tour', 'Swartkops Estuary Study Walk', 'Alexandria Dunefield Tour'],
    'East London': ['Nahoon Estuary Ecosystem Tour', 'Coastal Erosion Study Walk'],
    'Durban': ['Durban Beachfront Coastal Erosion Study', 'uMgeni River Estuary Tour', 'Berea Ridge Geology Walk'],
    'Umhlanga': ['Umhlanga Lagoon Nature Reserve Tour', 'Hawaan Forest Ecosystem Walk'],
    'Lake St Lucia': ['St Lucia Estuary Ecosystem Tour', 'Coastal Dune Forest Walk', 'Wetland Systems Study'],
    'Drakensberg': ['uKhahlamba Mountain Formation Tour', 'Amphitheatre Geology Walk', 'Tugela Falls Watershed Study'],
    'Shakaland': ['Mhlatuze River Valley Tour', 'Zululand Savanna Ecosystem Walk'],
    'Battlefields': ['Tugela River Geography Tour', 'Highveld to Lowveld Transition Study'],
  },
  'Maths Tour': {
    'Pretoria': ['CSIR Innovation Centre Maths Workshop', 'University of Pretoria Maths Discovery Day'],
    'Johannesburg': ['Sci-Bono Discovery Centre Maths Lab', 'Planetarium Astronomy & Maths Tour', 'Bridge Engineering Maths Walk'],
    'Vaal': ['Vaal Dam Volume & Capacity Calculations Tour', 'Engineering Maths at Vaal Bridge'],
    'Harties': ['Dam Engineering Maths Tour', 'Cableway Gradient Calculations Workshop'],
    'Brits': ['Agricultural Maths: Crop Yield Calculations', 'Irrigation Systems Maths Tour'],
    'Pilanesberg National Park': ['Wildlife Population Statistics Tour', 'GPS Navigation & Coordinates Workshop'],
    'Sun City Resort': ['Resort Architecture Geometry Tour', 'Water Park Physics & Maths Workshop'],
    'Witbank': ['Mining Calculations Workshop', 'Power Station Energy Maths Tour'],
    'Kruger National Park': ['Animal Census & Statistics Workshop', 'Park Area & Distance Calculations Tour'],
    'Panorama Route': ['Canyon Depth & Height Measurements Tour', 'Altitude & Distance Calculations Walk'],
    'Bela Bela': ['Hot Spring Temperature & Volume Calculations', 'Water Flow Rate Maths Tour'],
    'Mapungubwe': ['Archaeological Dating Maths Workshop', 'Ancient Trade Route Distance Calculations'],
    'Venda': ['Traditional Pattern Geometry Workshop', 'Forestry Measurement Maths Tour'],
    'Port Elizabeth': ['Oceanarium Volume Calculations Tour', 'Tidal Pattern Maths Workshop'],
    'East London': ['Aquarium Maths Workshop', 'Harbour Engineering Calculations Tour'],
    'Durban': ['uShaka Marine World Volume Calculations Tour', 'Stadium Architecture Geometry Workshop'],
    'Umhlanga': ['Lighthouse Trigonometry Workshop', 'Coastal Measurement Maths Tour'],
    'Lake St Lucia': ['Estuary Area Calculations Tour', 'Hippo Population Statistics Workshop'],
    'Drakensberg': ['Mountain Height Trigonometry Tour', 'Waterfall Flow Rate Calculations'],
    'Shakaland': ['Traditional Hut Geometry Workshop', 'Kraal Area Calculations Tour'],
    'Battlefields': ['Battle Formation Strategy & Geometry Tour', 'Historical Distance Calculations Walk'],
  },
  'Science Tour': {
    'Pretoria': ['Ditsong National Museum of Natural History', 'CSIR Science Discovery Tour', 'Pretoria Observatory Astronomy Night'],
    'Johannesburg': ['Sci-Bono Discovery Centre Tour', 'Planetarium Space Science Show', 'James Hall Transport Museum'],
    'Vaal': ['Vaal River Water Quality Testing Tour', 'Aquadome Physics Exploration'],
    'Harties': ['Elephant Sanctuary Animal Science Tour', 'Reptile Centre Zoology Workshop'],
    'Brits': ['Agricultural Science Farm Tour', 'Soil Science & Crop Study Workshop'],
    'Pilanesberg National Park': ['Ecosystem Science Safari', 'Volcanic Rock Science Walk'],
    'Sun City Resort': ['Valley of the Waves Physics Tour', 'Water Treatment Science Workshop'],
    'Witbank': ['Coal Chemistry & Energy Science Tour', 'Power Station Physics Workshop'],
    'Kruger National Park': ['Wildlife Ecology Science Safari', 'Veterinary Science Workshop', 'Biodiversity Study Tour'],
    'Panorama Route': ['Geological Science Trail', 'Forest Ecology Study Walk'],
    'Bela Bela': ['Geothermal Science Tour', 'Hot Springs Chemistry Workshop', 'Wildlife Rehabilitation Science Visit'],
    'Mapungubwe': ['Archaeological Science Tour', 'Climate Science Study Walk'],
    'Venda': ['Ethnobotany Science Tour', 'Forest Ecology Workshop', 'Traditional Medicine Science Walk'],
    'Port Elizabeth': ['Bayworld Oceanarium Science Tour', 'SAAO Astronomy Workshop'],
    'East London': ['East London Museum Natural Science Tour', 'Inkwenkwezi Wildlife Science Safari'],
    'Durban': ['uShaka Marine World Ocean Science Tour', 'Durban Natural Science Museum Visit', 'Sugar Cane Chemistry Workshop'],
    'Umhlanga': ['Shark Lab Marine Science Tour', 'Coastal Ecology Workshop'],
    'Lake St Lucia': ['Marine Biology Science Tour', 'Wetland Ecology Workshop', 'Turtle Conservation Science Walk'],
    'Drakensberg': ['Alpine Ecology Science Tour', 'Weather & Climate Study Workshop'],
    'Shakaland': ['Traditional Metallurgy Science Tour', 'Zululand Ecology Workshop'],
    'Battlefields': ['Military Engineering Science Tour', 'Battlefield Forensic Science Walk'],
  },
  'Life Sciences Tour': {
    'Pretoria': ['National Zoological Gardens Tour', 'Pretoria Botanical Gardens Biodiversity Walk', 'Austin Roberts Bird Sanctuary'],
    'Johannesburg': ['Johannesburg Zoo Life Sciences Tour', 'Walter Sisulu Botanical Gardens Ecology Walk', 'Cradle of Humankind Evolution Tour'],
    'Vaal': ['Vaal River Biodiversity Walk', 'Wetland Bird Watching Tour', 'Suikerbosrand Nature Reserve Ecology Walk'],
    'Harties': ['De Wildt Cheetah Centre Visit', 'Elephant Sanctuary Life Sciences Tour', 'Snake & Reptile Park Biology Walk'],
    'Brits': ['Kgaswane Mountain Reserve Ecology Walk', 'Indigenous Plant Nursery Tour'],
    'Pilanesberg National Park': ['Big Five Ecology Safari', 'Predator-Prey Relationships Tour'],
    'Sun City Resort': ['Pilanesberg Life Sciences Safari', 'Bird of Prey Centre Visit'],
    'Witbank': ['Middelburg Dam Aquatic Life Tour', 'Grassland Biodiversity Walk'],
    'Kruger National Park': ['Big Five Life Sciences Safari', 'Sable Hide Bird Watching Tour', 'Medicinal Plants Walk'],
    'Panorama Route': ['Blyde River Canyon Flora Tour', 'Forest Canopy Life Walk'],
    'Bela Bela': ['Raptors Centre Bird of Prey Tour', 'Waterberg Nature Reserve Ecology Walk', 'Adventures with Elephants Life Sciences Tour'],
    'Mapungubwe': ['Biodiversity Hotspot Tour', 'Baobab Tree Ecology Walk', 'Bird Species Identification Tour'],
    'Venda': ['Subtropical Forest Ecology Tour', 'Lake Fundudzi Aquatic Life Walk', 'Traditional Plant Medicine Tour'],
    'Port Elizabeth': ['Addo Elephant Park Life Sciences Tour', 'Kragga Kamma Wildlife Ecology Walk'],
    'East London': ['Nahoon Beach Marine Life Walk', 'Inkwenkwezi Reserve Ecology Tour'],
    'Durban': ['uShaka Marine World Marine Biology Tour', 'Durban Botanical Gardens Plant Life Walk', 'Beachwood Mangroves Ecology Tour'],
    'Umhlanga': ['Umhlanga Lagoon Bird Life Tour', 'Hawaan Forest Indigenous Plant Walk'],
    'Lake St Lucia': ['Hippo & Crocodile Ecology Tour', 'Mangrove Swamp Life Sciences Walk', 'Sea Turtle Nesting Tour'],
    'Drakensberg': ['Drakensberg Alpine Flora Tour', 'Lammergeier Vulture Conservation Walk', 'Wetland Ecosystem Study'],
    'Shakaland': ['Dlinza Forest Canopy Boardwalk', 'Zululand Butterfly Route Tour'],
    'Battlefields': ['Chelmsford Nature Reserve Ecology Walk', 'Blood River Biodiversity Tour'],
  },
};

export default function SchoolTrips() {
  const navigate = useNavigate();

  // Form state
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolProvince, setSchoolProvince] = useState('');
  const [subject, setSubject] = useState('');
  const [tripType, setTripType] = useState<'day' | 'multi-day' | ''>('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactTel, setContactTel] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(20);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Results
  const [showResults, setShowResults] = useState(false);

  // Get available provinces for destination dropdown based on trip type
  const availableProvinces = useMemo(() => {
    if (!tripType || !schoolProvince) return Object.keys(PROVINCES);
    if (tripType === 'day') {
      // Only show the school's province
      return [schoolProvince];
    }
    // Multi-day: show all provinces
    return Object.keys(PROVINCES);
  }, [tripType, schoolProvince]);

  // Get areas for selected province
  const availableAreas = useMemo(() => {
    if (!selectedProvince) return [];
    return PROVINCES[selectedProvince] || [];
  }, [selectedProvince]);

  // Get tours for selected subject + area
  const tours = useMemo(() => {
    if (!subject || !selectedArea) return [];
    return EDUCATIONAL_TOURS[subject]?.[selectedArea] || [];
  }, [subject, selectedArea]);

  // Reset downstream selections when trip type changes
  const handleTripTypeChange = (type: 'day' | 'multi-day') => {
    setTripType(type);
    setSelectedProvince('');
    setSelectedArea('');
    setShowResults(false);

    // If day trip, auto-select the school's province
    if (type === 'day' && schoolProvince) {
      setSelectedProvince(schoolProvince);
    }
  };

  const handleViewOutings = () => {
    if (!schoolProvince || !subject || !tripType || !selectedArea || !contactName || !contactTel || !contactEmail) {
      return;
    }
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('school-trip-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2073&q=80"
            alt="School educational trip"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 text-white mb-4">
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-semibold">Educational School Outings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              School Trips
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Plan unforgettable educational outings for your learners. Explore South Africa's rich history, geography, and science destinations.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="space-y-5">

                {/* School Address */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    My School Address *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Type your school name and address..."
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>

                {/* School Province */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Your Province *</Label>
                  <Select value={schoolProvince} onValueChange={(v) => {
                    setSchoolProvince(v);
                    // Reset downstream if trip type is day
                    if (tripType === 'day') {
                      setSelectedProvince(v);
                      setSelectedArea('');
                    }
                    setShowResults(false);
                  }}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder="Select your province" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PROVINCES).map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Matter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Subject Matter *
                  </Label>
                  <Select value={subject} onValueChange={(v) => { setSubject(v); setShowResults(false); }}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder="Select subject matter" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trip Type */}
                {subject && schoolProvince && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Trip Type *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleTripTypeChange('day')}
                        className={cn(
                          'px-4 py-3 rounded-lg border-2 transition-all font-medium',
                          tripType === 'day'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                        )}
                      >
                        🚌 Day Trip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTripTypeChange('multi-day')}
                        className={cn(
                          'px-4 py-3 rounded-lg border-2 transition-all font-medium',
                          tripType === 'multi-day'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                        )}
                      >
                        🏨 Multi-Day Trip
                      </button>
                    </div>
                    {tripType === 'day' && (
                      <p className="text-xs text-muted-foreground">Day trips show destinations within your province only.</p>
                    )}
                    {tripType === 'multi-day' && (
                      <p className="text-xs text-muted-foreground">Multi-day trips include all provinces across South Africa.</p>
                    )}
                  </div>
                )}

                {/* Destination Selection */}
                {tripType && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Province *</Label>
                      <Select value={selectedProvince} onValueChange={(v) => { setSelectedProvince(v); setSelectedArea(''); setShowResults(false); }}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProvinces.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Area / Destination *</Label>
                      <Select value={selectedArea} onValueChange={(v) => { setSelectedArea(v); setShowResults(false); }}>
                        <SelectTrigger className="h-11 bg-white border-gray-200" disabled={!selectedProvince}>
                          <SelectValue placeholder={selectedProvince ? "Select area" : "Select province first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAreas.map(a => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Dates & Group Size */}
                {tripType && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Trip Date *</Label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        min={today}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                    {tripType === 'multi-day' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Return Date *</Label>
                        <Input
                          type="date"
                          value={checkOut}
                          onChange={e => setCheckOut(e.target.value)}
                          min={checkIn || today}
                          className="h-11 bg-white border-gray-200"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Teachers / Adults
                      </Label>
                      <Select value={adults.toString()} onValueChange={v => setAdults(parseInt(v))}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                            <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Learners</Label>
                      <Select value={children.toString()} onValueChange={v => setChildren(parseInt(v))}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 200 }, (_, i) => i + 1).map(n => (
                            <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Contact Details *</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telephone Number *</Label>
                      <Input
                        type="tel"
                        placeholder="e.g. 072 123 4567"
                        value={contactTel}
                        onChange={(e) => setContactTel(e.target.value)}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleViewOutings}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
                  disabled={!schoolProvince || !subject || !tripType || !selectedArea || !contactName || !contactTel || !contactEmail}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  View Educational Outings
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && tours.length > 0 && (
            <div id="school-trip-results" className="max-w-4xl mx-auto mt-8 animate-fade-in scroll-mt-4">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-primary mb-2">
                  {subject} — {selectedArea}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {tours.length} educational outing{tours.length !== 1 ? 's' : ''} found for your {tripType === 'day' ? 'day trip' : 'multi-day trip'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tours.map((tour, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{tour}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedArea}, {selectedProvince}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                                {subject}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                {tripType === 'day' ? 'Day Trip' : 'Multi-Day'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Next step:</strong> Our team will contact you at <strong>{contactEmail}</strong> with detailed pricing, itineraries, and transport options for your selected educational outings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showResults && tours.length === 0 && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 text-center">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No tours found</h3>
                <p className="text-muted-foreground">
                  We don't have {subject.toLowerCase()} tours listed for {selectedArea} yet. Please contact us and we'll arrange a custom educational outing for your school.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
