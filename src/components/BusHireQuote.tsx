import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Users, PartyPopper, Calculator, ChevronDown, Check, Download, FileText } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

type UserType = 'bus-company' | 'group-organizer' | null;

export function BusHireQuote() {
  const [userType, setUserType] = useState<UserType>(null);
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(20);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<string>('');
  const [busQuoteAmount, setBusQuoteAmount] = useState('');
  const [calculatedQuotes, setCalculatedQuotes] = useState<Array<{
    packageName: string;
    packageId: string;
    activitiesIncluded: string[];
    busTransportCost: number;
    packageCostPerPerson: number;
    totalPerPerson: number;
    totalGroupCost: number;
    adults: number;
    children: number;
    nights: number;
  }>>([]);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setCalculatedQuotes([]);
  }, [destination]);

  // Auto-set checkout to day after check-in
  useEffect(() => {
    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 2);
      const formatted = checkInDate.toISOString().split('T')[0];
      if (!checkOut || new Date(checkOut) <= new Date(checkIn)) {
        setCheckOut(formatted);
      }
    }
  }, [checkIn]);

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateQuotes = () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    const busAmount = parseFloat(busQuoteAmount) || 0;
    const totalPeople = adults + children;
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    const busPerPerson = totalPeople > 0 ? busAmount / totalPeople : 0;

    const quotes = packageIds.map(pkgId => {
      const pkg = packages.find(p => p.id === pkgId);
      if (!pkg) return null;

      // Calculate package cost per person (activities only for bus groups - no accommodation)
      const packageCostPerPerson = pkg.basePrice;
      const totalPerPerson = packageCostPerPerson + busPerPerson;
      const totalGroupCost = totalPerPerson * totalPeople;

      return {
        packageName: pkg.name,
        packageId: pkgId,
        activitiesIncluded: pkg.activitiesIncluded,
        busTransportCost: busAmount,
        packageCostPerPerson,
        totalPerPerson,
        totalGroupCost,
        adults,
        children,
        nights,
      };
    }).filter(Boolean) as typeof calculatedQuotes;

    setCalculatedQuotes(quotes);
    toast.success(`${quotes.length} package quotes calculated!`);
  };

  const downloadPDF = (quote: typeof calculatedQuotes[0]) => {
    const pdf = new jsPDF();
    const destinationName = destinations.find(d => d.id === destination)?.name || destination;
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(30, 64, 175);
    pdf.text('Bus Group Travel Quote', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Quote Details
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Trip Details', 20, 50);
    
    pdf.setFontSize(11);
    let y = 60;
    
    pdf.text(`Destination: ${destinationName}`, 20, y);
    y += 8;
    pdf.text(`Package: ${quote.packageName}`, 20, y);
    y += 8;
    pdf.text(`Check-in: ${new Date(checkIn).toLocaleDateString()}`, 20, y);
    y += 8;
    pdf.text(`Check-out: ${new Date(checkOut).toLocaleDateString()}`, 20, y);
    y += 8;
    pdf.text(`Duration: ${quote.nights} night${quote.nights > 1 ? 's' : ''}`, 20, y);
    y += 8;
    pdf.text(`Group Size: ${quote.adults} adults${quote.children > 0 ? ` + ${quote.children} children` : ''}`, 20, y);
    y += 15;
    
    // Activities
    pdf.setFontSize(14);
    pdf.text('Activities Included:', 20, y);
    y += 10;
    pdf.setFontSize(10);
    quote.activitiesIncluded.forEach(activity => {
      pdf.text(`• ${activity}`, 25, y);
      y += 6;
    });
    y += 10;
    
    // Pricing
    pdf.setFontSize(14);
    pdf.text('Pricing Breakdown', 20, y);
    y += 10;
    pdf.setFontSize(11);
    
    pdf.text(`Activities Package: R${quote.packageCostPerPerson.toLocaleString()} per person`, 20, y);
    y += 8;
    if (quote.busTransportCost > 0) {
      pdf.text(`Bus Transport: R${quote.busTransportCost.toLocaleString()} total (R${Math.round(quote.busTransportCost / (quote.adults + quote.children)).toLocaleString()} per person)`, 20, y);
      y += 8;
    }
    
    y += 5;
    pdf.setFontSize(13);
    pdf.setTextColor(30, 64, 175);
    pdf.text(`Total Per Person: R${Math.round(quote.totalPerPerson).toLocaleString()}`, 20, y);
    y += 10;
    pdf.setFontSize(14);
    pdf.text(`Grand Total: R${Math.round(quote.totalGroupCost).toLocaleString()}`, 20, y);
    
    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('This quote is valid for 7 days. Terms and conditions apply.', 20, 280);
    
    pdf.save(`bus-group-quote-${quote.packageName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    toast.success('Quote PDF downloaded!');
  };

  const today = new Date().toISOString().split('T')[0];

  if (!userType) {
    return (
      <section id="bus-hire" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-4">
              <Bus className="w-4 h-4" />
              <span className="text-sm font-semibold">Bus Hire & Group Transport</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Add Transport to Your Package Quote
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Are you a bus hire company or a group tour organizer? Select your type below to get started with a customized quote.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setUserType('bus-company')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <Bus className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I represent a Bus Hire Company
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Add your transport quote to our curated packages and provide complete trip quotes to your clients
                  </p>
                </div>
              </button>

              <button
                onClick={() => setUserType('group-organizer')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-green-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                    <Users className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I am a Group Tour Organizer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Looking for fun activities and need to include bus hire in your group quote
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bus-hire" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* User Type Toggle */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={userType === 'bus-company' ? 'default' : 'outline'}
            onClick={() => {
              setUserType('bus-company');
              setCalculatedQuotes([]);
            }}
            className="gap-2"
          >
            <Bus className="w-4 h-4" />
            I represent a Bus Hire Company
          </Button>
          <Button
            variant={userType === 'group-organizer' ? 'default' : 'outline'}
            onClick={() => {
              setUserType('group-organizer');
              setCalculatedQuotes([]);
            }}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            I am a Group Tour Organizer
          </Button>
          <Button
            variant="ghost"
            onClick={() => setUserType(null)}
            className="text-gray-500"
          >
            Change Selection
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
            {userType === 'bus-company' 
              ? 'Bus Company Quote Calculator' 
              : 'Group Tour Quote Calculator'}
          </h2>
          <p className="text-gray-600">
            {userType === 'bus-company'
              ? 'Enter your bus transport quote and select packages to generate complete quotes for your clients'
              : 'Calculate per-person costs including activities and transport for your group'}
          </p>
        </div>

        {/* Quote Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="space-y-5">
              {/* Row 1: Destination, Check In, Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Destination *</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">South Africa</div>
                      {destinations.filter(d => !d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">International</div>
                      {destinations.filter(d => d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}, {d.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check In *</Label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check Out *</Label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Row 2: Package Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Package/s *</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Choose one or more activity packages to include in your group quote
                </p>
                <Popover open={isPackageDropdownOpen} onOpenChange={setIsPackageDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!destination}
                      className="w-full h-11 justify-between bg-white border-gray-200 text-left font-normal"
                    >
                      <span className="truncate">
                        {packageIds.length === 0 
                          ? (destination ? 'Select packages...' : 'Select destination first')
                          : `${packageIds.length} package${packageIds.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[300px] p-2" align="start">
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {availablePackages.map(pkg => (
                        <div
                          key={pkg.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                            packageIds.includes(pkg.id) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => togglePackageSelection(pkg.id)}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            packageIds.includes(pkg.id) ? 'bg-primary border-primary' : 'border-gray-300'
                          }`}>
                            {packageIds.includes(pkg.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.duration} • From R{pkg.basePrice}/person</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 3: Group Size */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Number of Adults *</Label>
                  <Input
                    type="number"
                    value={adults}
                    onChange={e => setAdults(parseInt(e.target.value) || 0)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Number of Children</Label>
                  <Input
                    type="number"
                    value={children}
                    onChange={e => setChildren(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-sm font-medium text-gray-700">
                    <Bus className="w-4 h-4 inline mr-1" />
                    Bus Transport Quote (R) *
                  </Label>
                  <Input
                    type="number"
                    value={busQuoteAmount}
                    onChange={e => setBusQuoteAmount(e.target.value)}
                    placeholder="Enter total bus quote amount"
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the total transport cost for the group
                  </p>
                </div>
              </div>

              {/* Child Age Selection */}
              {children > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Child Ages (3-17 years)</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: children }, (_, i) => {
                      const ages = childrenAges.split(',').map(a => a.trim());
                      const currentAge = ages[i] || '5';
                      return (
                        <div key={i} className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Child {i + 1}:</span>
                          <Select 
                            value={currentAge} 
                            onValueChange={v => {
                              const newAges = [...ages];
                              newAges[i] = v;
                              while (newAges.length < children) {
                                newAges.push('5');
                              }
                              setChildrenAges(newAges.slice(0, children).join(','));
                            }}
                          >
                            <SelectTrigger className="h-9 w-20 bg-white border-gray-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {Array.from({ length: 15 }, (_, age) => age + 3).map(age => (
                                <SelectItem key={age} value={age.toString()}>{age} yrs</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <Button
                onClick={calculateQuotes}
                className="w-full h-12 text-lg gap-2"
                size="lg"
              >
                <Calculator className="w-5 h-5" />
                Calculate Group Quote
              </Button>
            </div>

            {/* Results */}
            {calculatedQuotes.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Your Group Quotes ({calculatedQuotes.length})
                </h3>
                
                <div className="space-y-4">
                  {calculatedQuotes.map((quote, index) => (
                    <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <PartyPopper className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-lg">{quote.packageName}</h4>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Group:</span> {quote.adults} adults
                                {quote.children > 0 && ` + ${quote.children} children`}
                              </p>
                              <p>
                                <span className="font-medium">Duration:</span> {quote.nights} night{quote.nights > 1 ? 's' : ''}
                              </p>
                              
                              <div className="mt-3">
                                <p className="font-medium text-gray-700 mb-1">Activities Included:</p>
                                <ul className="text-xs space-y-0.5">
                                  {quote.activitiesIncluded.slice(0, 4).map((activity, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                      <Check className="w-3 h-3 text-green-500" />
                                      {activity}
                                    </li>
                                  ))}
                                  {quote.activitiesIncluded.length > 4 && (
                                    <li className="text-gray-500">+{quote.activitiesIncluded.length - 4} more activities</li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right space-y-2">
                            <div className="text-xs text-gray-500 space-y-1">
                              <p>Activities: {formatCurrency(quote.packageCostPerPerson)}/person</p>
                              {quote.busTransportCost > 0 && (
                                <p>Transport: {formatCurrency(Math.round(quote.busTransportCost / (quote.adults + quote.children)))}/person</p>
                              )}
                            </div>
                            
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(Math.round(quote.totalPerPerson))}
                            </p>
                            <p className="text-xs text-gray-500">per person</p>
                            
                            <div className="pt-2 border-t">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(Math.round(quote.totalGroupCost))}
                              </p>
                              <p className="text-xs text-gray-500">total for group</p>
                            </div>
                            
                            <Button
                              onClick={() => downloadPDF(quote)}
                              variant="outline"
                              size="sm"
                              className="gap-2 mt-3"
                            >
                              <Download className="w-4 h-4" />
                              Download Quote
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
