import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Users, Calculator, ChevronDown, Check, Search, Plus, Trash2, Building2, DollarSign, Star, Wifi, Car, Coffee, Dumbbell, UtensilsCrossed, Waves, SpadeIcon } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

interface RoomCategory {
  id: string;
  name: string;
  count: number;
}

interface QuoteResult {
  packageName: string;
  packagePrice: number;
  hotelCost: number;
  serviceFee: number;
  totalPerPerson: number;
  totalGroupCost: number;
  groupSize: number;
}

export function AccommodationProviderQuote() {
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(25);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [hotelQuoteAmount, setHotelQuoteAmount] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([
    { id: '1', name: '', count: 1 }
  ]);
  const [facilities, setFacilities] = useState<string[]>(['', '', '', '', '']);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [quoteResults, setQuoteResults] = useState<QuoteResult[]>([]);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];
  const selectedPackages = packages.filter(p => packageIds.includes(p.id));

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setHasCalculated(false);
    setQuoteResults([]);
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

  // Update children ages array when children count changes
  useEffect(() => {
    setChildrenAges(prev => {
      if (children > prev.length) {
        return [...prev, ...Array(children - prev.length).fill(5)];
      }
      return prev.slice(0, children);
    });
  }, [children]);

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

  const addRoomCategory = () => {
    const newId = (roomCategories.length + 1).toString();
    setRoomCategories([...roomCategories, { id: newId, name: '', count: 1 }]);
  };

  const removeRoomCategory = (id: string) => {
    if (roomCategories.length > 1) {
      setRoomCategories(roomCategories.filter(r => r.id !== id));
    }
  };

  const updateRoomCategory = (id: string, field: 'name' | 'count', value: string | number) => {
    setRoomCategories(roomCategories.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const updateFacility = (index: number, value: string) => {
    const newFacilities = [...facilities];
    newFacilities[index] = value;
    setFacilities(newFacilities);
  };

  const totalRooms = roomCategories.reduce((sum, r) => sum + r.count, 0);
  const totalGuests = adults + children;

  // Calculate service fee: R400 per person from the 26th person onwards for groups of 25+
  const calculateServiceFee = (groupSize: number): number => {
    if (groupSize >= 25) {
      const extraPeople = groupSize - 25;
      return extraPeople > 0 ? extraPeople * 400 : 0;
    }
    return 0;
  };

  const handleCalculate = () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut || !hotelQuoteAmount) {
      toast.error('Please fill in all required fields including hotel quote amount');
      return;
    }

    const hotelAmount = parseFloat(hotelQuoteAmount) || 0;
    const serviceFee = calculateServiceFee(totalGuests);
    
    const results: QuoteResult[] = selectedPackages.map(pkg => {
      const packagePricePerPerson = pkg.basePrice;
      const hotelCostPerPerson = hotelAmount / totalGuests;
      const serviceFeePerPerson = serviceFee / totalGuests;
      const totalPerPerson = packagePricePerPerson + hotelCostPerPerson + serviceFeePerPerson;
      const totalGroupCost = totalPerPerson * totalGuests;

      return {
        packageName: pkg.name,
        packagePrice: packagePricePerPerson,
        hotelCost: hotelCostPerPerson,
        serviceFee: serviceFeePerPerson,
        totalPerPerson,
        totalGroupCost,
        groupSize: totalGuests,
      };
    });

    setQuoteResults(results);
    setHasCalculated(true);
    toast.success('Quote calculated successfully!');
  };

  const downloadQuotePDF = (result: QuoteResult) => {
    const doc = new jsPDF();
    const destinationName = destinations.find(d => d.id === destination)?.name || destination;
    const nights = checkIn && checkOut 
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;

    // Header
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Hotel Guest Quote', 20, 25);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Hotel Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Accommodation Details', 20, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let yPos = 65;
    if (hotelName) {
      doc.text(`Hotel: ${hotelName}`, 20, yPos);
      yPos += 7;
    }
    doc.text(`Destination: ${destinationName}`, 20, yPos);
    yPos += 7;
    doc.text(`Check-in: ${checkIn}  |  Check-out: ${checkOut}  |  ${nights} Night${nights !== 1 ? 's' : ''}`, 20, yPos);
    yPos += 7;
    doc.text(`Group Size: ${adults} Adults${children > 0 ? `, ${children} Children` : ''}`, 20, yPos);
    yPos += 12;

    // Room Categories
    const filledRooms = roomCategories.filter(r => r.name.trim());
    if (filledRooms.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Room Categories', 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      filledRooms.forEach(room => {
        doc.text(`• ${room.name}: ${room.count} room${room.count !== 1 ? 's' : ''}`, 25, yPos);
        yPos += 6;
      });
      yPos += 6;
    }

    // Facilities
    const filledFacilities = facilities.filter(f => f.trim());
    if (filledFacilities.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Hotel Facilities', 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      filledFacilities.forEach(facility => {
        doc.text(`• ${facility}`, 25, yPos);
        yPos += 6;
      });
      yPos += 6;
    }

    // Package Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Activity Package', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(result.packageName, 20, yPos);
    yPos += 15;

    // Pricing breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pricing Breakdown (Per Person)', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Accommodation: ${formatCurrency(result.hotelCost)}`, 25, yPos);
    yPos += 7;
    doc.text(`Activity Package: ${formatCurrency(result.packagePrice)}`, 25, yPos);
    yPos += 7;
    if (result.serviceFee > 0) {
      doc.text(`Service Fee: ${formatCurrency(result.serviceFee)}`, 25, yPos);
      yPos += 7;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Per Person: ${formatCurrency(result.totalPerPerson)}`, 25, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total Group Cost: ${formatCurrency(result.totalGroupCost)}`, 25, yPos);

    // Service fee note
    if (totalGuests >= 25) {
      yPos += 15;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('* Service fee of R400 per person applies from the 26th guest onwards for groups of 25+', 20, yPos);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Quote generated on ${new Date().toLocaleDateString()}`, 20, 280);
    doc.text('Prices are subject to availability and may change', 20, 285);

    const fileName = `Hotel_Quote_${result.packageName.replace(/\s+/g, '_')}_${destinationName}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF downloaded successfully!');
  };

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  const destinationName = destinations.find(d => d.id === destination)?.name || destination;

  return (
    <section id="hotel-provider" className="py-16 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 mb-4">
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-semibold">For Hotels & Accommodation Providers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Add Our Curated Activity Packages to Your Guest Quotation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your hotel quotes by including our exciting activity packages. Perfect for group bookings and corporate events.
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
                    <SelectContent className="bg-white">
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

              {/* Hotel Name & Quote Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Hotel Name (Optional)</Label>
                  <Input
                    type="text"
                    value={hotelName}
                    onChange={e => setHotelName(e.target.value)}
                    placeholder="e.g. Grand Hotel Resort"
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Total Hotel Quote Amount (R) *
                  </Label>
                  <Input
                    type="number"
                    value={hotelQuoteAmount}
                    onChange={e => setHotelQuoteAmount(e.target.value)}
                    placeholder="Total accommodation cost"
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Room Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Room Categories</Label>
                <p className="text-xs text-muted-foreground">
                  Add room types and quantities for your quote
                </p>
                <div className="space-y-2">
                  {roomCategories.map((room, index) => (
                    <div key={room.id} className="flex items-center gap-3">
                      <Input
                        type="text"
                        value={room.name}
                        onChange={e => updateRoomCategory(room.id, 'name', e.target.value)}
                        placeholder="e.g. Deluxe Double Room"
                        className="flex-1 h-10 bg-white border-gray-200"
                      />
                      <Select 
                        value={room.count.toString()} 
                        onValueChange={v => updateRoomCategory(room.id, 'count', parseInt(v))}
                      >
                        <SelectTrigger className="w-24 h-10 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-white">
                          {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {roomCategories.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoomCategory(room.id)}
                          className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRoomCategory}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Room Category
                </Button>
              </div>

              {/* Hotel Facilities */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Hotel Facilities & Amenities</Label>
                <p className="text-xs text-muted-foreground">
                  Add up to 5 key facilities to highlight in the quote
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {facilities.map((facility, index) => (
                    <Input
                      key={index}
                      type="text"
                      value={facility}
                      onChange={e => updateFacility(index, e.target.value)}
                      placeholder={`Facility ${index + 1}`}
                      className="h-10 bg-white border-gray-200"
                    />
                  ))}
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Activity Package/s *</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Choose one or more activity packages to include in your guest quote
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
                  <PopoverContent className="w-full min-w-[300px] p-2 bg-white" align="start">
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
                  <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                  <Input
                    type="number"
                    value={adults}
                    onChange={e => setAdults(parseInt(e.target.value) || 0)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Children</Label>
                  <Input
                    type="number"
                    value={children}
                    onChange={e => setChildren(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-sm font-medium text-gray-700">Total Rooms</Label>
                  <div className="h-11 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 text-gray-700 font-medium">
                    {totalRooms} room{totalRooms !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Child Age Selection */}
              {children > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Child Ages (3-17 years)</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: children }, (_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Child {i + 1}:</span>
                        <Select 
                          value={childrenAges[i]?.toString() || '5'} 
                          onValueChange={v => {
                            const newAges = [...childrenAges];
                            newAges[i] = parseInt(v);
                            setChildrenAges(newAges);
                          }}
                        >
                          <SelectTrigger className="h-9 w-20 bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] bg-white">
                            {Array.from({ length: 15 }, (_, age) => age + 3).map(age => (
                              <SelectItem key={age} value={age.toString()}>{age} yrs</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Fee Info */}
              {totalGuests >= 25 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Service Fee Applies</p>
                      <p className="text-xs text-emerald-600">
                        For groups of 25+ people, a service fee of R400 per person applies from the 26th guest onwards.
                        {totalGuests > 25 && (
                          <span className="font-medium"> Estimated service fee: {formatCurrency((totalGuests - 25) * 400)}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <Button 
                onClick={handleCalculate}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Guest Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Quote Results */}
        {hasCalculated && quoteResults.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Guest Quote Results
            </h3>
            <div className="grid gap-6">
              {quoteResults.map((result, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      {/* Quote Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{result.packageName}</h4>
                          <p className="text-sm text-gray-600">
                            {destinationName} • {nights} Night{nights !== 1 ? 's' : ''} • {result.groupSize} Guests
                          </p>
                        </div>

                        {/* Room Categories Summary */}
                        {roomCategories.some(r => r.name.trim()) && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Rooms: </span>
                            {roomCategories.filter(r => r.name.trim()).map(r => `${r.name} (${r.count})`).join(', ')}
                          </div>
                        )}

                        {/* Facilities */}
                        {facilities.some(f => f.trim()) && (
                          <div className="flex flex-wrap gap-2">
                            {facilities.filter(f => f.trim()).map((facility, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                                <Star className="w-3 h-3" />
                                {facility}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Pricing Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Accommodation (per person)</span>
                            <span className="font-medium">{formatCurrency(result.hotelCost)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Activity Package (per person)</span>
                            <span className="font-medium">{formatCurrency(result.packagePrice)}</span>
                          </div>
                          {result.serviceFee > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Service Fee (per person)</span>
                              <span className="font-medium">{formatCurrency(result.serviceFee)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-base font-bold">
                              <span>Total Per Person</span>
                              <span className="text-emerald-600">{formatCurrency(result.totalPerPerson)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-1">
                              <span>Total Group Cost</span>
                              <span className="text-emerald-600">{formatCurrency(result.totalGroupCost)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button
                          onClick={() => downloadQuotePDF(result)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                        >
                          Download PDF Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const message = `Hotel Quote for ${result.packageName}\n\nDestination: ${destinationName}\nDates: ${checkIn} - ${checkOut}\nGuests: ${result.groupSize}\n\nTotal Per Person: ${formatCurrency(result.totalPerPerson)}\nTotal Group Cost: ${formatCurrency(result.totalGroupCost)}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          Share via WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const subject = `Hotel Quote - ${result.packageName} - ${destinationName}`;
                            const body = `Hotel Quote for ${result.packageName}\n\nDestination: ${destinationName}\nDates: ${checkIn} - ${checkOut}\nGuests: ${result.groupSize}\n\nTotal Per Person: ${formatCurrency(result.totalPerPerson)}\nTotal Group Cost: ${formatCurrency(result.totalGroupCost)}`;
                            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          Share via Email
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
    </section>
  );
}
