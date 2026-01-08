import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { Copy, Check, Search, Hotel, ChevronDown, ChevronUp, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import html2canvas from 'html2canvas';

interface LogEntry {
  step: string;
  timestamp: string;
  request: any;
  response: any;
}

interface HotelRoom {
  code: string;
  name: string;
  rates: Array<{
    rateKey: string;
    net: string;
    boardCode: string;
    boardName: string;
  }>;
}

interface HotelResult {
  code: string;
  name: string;
  categoryName: string;
  destinationName: string;
  rooms: HotelRoom[];
}

export default function HotelbedsTest() {
  // Search state
  const [searchDestination, setSearchDestination] = useState('johannesburg'); // South African destination
  const [searchCheckIn, setSearchCheckIn] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  const [searchCheckOut, setSearchCheckOut] = useState(format(addDays(new Date(), 32), 'yyyy-MM-dd'));
  const [searchLoading, setSearchLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Booking state
  const [rateKey, setRateKey] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [holderName, setHolderName] = useState('Test');
  const [holderSurname, setHolderSurname] = useState('User');
  const [guestName, setGuestName] = useState('John');
  const [guestSurname, setGuestSurname] = useState('Doe');
  const [clientReference, setClientReference] = useState(`TEST-${Date.now()}`);
  
  const [loading, setLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastResult, setLastResult] = useState<any>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  const captureScreenshot = async (stepName: string) => {
    if (!responseRef.current) {
      toast.error('No response to capture');
      return;
    }
    
    try {
      const canvas = await html2canvas(responseRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `hotelbeds-${stepName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success(`Screenshot saved: ${stepName}`);
    } catch (err) {
      toast.error('Failed to capture screenshot');
    }
  };

  const addLog = (step: string, request: any, response: any) => {
    setLogs(prev => [...prev, {
      step,
      timestamp: new Date().toISOString(),
      request,
      response
    }]);
  };

  // Search for hotels
  const handleSearch = async () => {
    setSearchLoading(true);
    setHotels([]);
    try {
      const requestBody = {
        destination: searchDestination,
        checkIn: searchCheckIn,
        checkOut: searchCheckOut,
        adults: 2,
        children: 0,
        childrenAges: [],
        rooms: 1,
      };

      const { data, error } = await supabase.functions.invoke('hotelbeds-search', {
        body: requestBody
      });

      if (error) throw error;

      addLog('Availability Search', requestBody, data);

      if (data.hotels && data.hotels.length > 0) {
        setHotels(data.hotels.slice(0, 5)); // Show first 5 hotels
        toast.success(`Found ${data.hotels.length} hotels. Click on a hotel to see rate keys.`);
      } else {
        toast.error('No hotels found. Try different dates or destination.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const copyRateKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setRateKey(key);
    setCopiedKey(key);
    toast.success('Rate key copied and added to Step 1!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Step 1: Check Rate
  const handleCheckRate = async () => {
    if (!rateKey) {
      toast.error('Please enter a rate key from the availability search');
      return;
    }

    setLoading('checkRate');
    try {
      const requestBody = { action: 'checkRate', rateKey };
      
      const { data, error } = await supabase.functions.invoke('hotelbeds-booking', {
        body: requestBody
      });

      if (error) throw error;

      addLog('CheckRate', requestBody, data);
      setLastResult(data);

      if (data.success) {
        toast.success('CheckRate successful! Rate is valid.');
        // Update rateKey with the validated one if different
        if (data.checkRate?.rateKey) {
          setRateKey(data.checkRate.rateKey);
        }
      } else {
        toast.error(data.error || 'CheckRate failed');
      }
    } catch (err: any) {
      toast.error(err.message);
      addLog('CheckRate', { rateKey }, { error: err.message });
    } finally {
      setLoading(null);
    }
  };

  // Step 2: Book (Confirmation)
  const handleBook = async () => {
    if (!rateKey) {
      toast.error('Please complete CheckRate first');
      return;
    }

    setLoading('book');
    try {
      const requestBody = {
        action: 'book',
        rateKey,
        holder: { name: holderName, surname: holderSurname },
        rooms: [{
          rateKey,
          paxes: [{
            roomId: 1,
            type: 'AD' as const,
            name: guestName,
            surname: guestSurname
          }]
        }],
        clientReference
      };

      const { data, error } = await supabase.functions.invoke('hotelbeds-booking', {
        body: requestBody
      });

      if (error) throw error;

      addLog('Booking (Confirmation)', requestBody, data);
      setLastResult(data);

      if (data.success) {
        toast.success(`Booking confirmed! Reference: ${data.booking?.reference}`);
        setBookingReference(data.booking?.reference || '');
      } else {
        toast.error(data.error || 'Booking failed');
      }
    } catch (err: any) {
      toast.error(err.message);
      addLog('Booking (Confirmation)', { rateKey, holder: { name: holderName, surname: holderSurname } }, { error: err.message });
    } finally {
      setLoading(null);
    }
  };

  // Step 3: Cancel
  const handleCancel = async () => {
    if (!bookingReference) {
      toast.error('Please enter the booking reference to cancel');
      return;
    }

    setLoading('cancel');
    try {
      const requestBody = { action: 'cancel', bookingReference };

      const { data, error } = await supabase.functions.invoke('hotelbeds-booking', {
        body: requestBody
      });

      if (error) throw error;

      addLog('Cancellation', requestBody, data);
      setLastResult(data);

      if (data.success) {
        toast.success('Booking cancelled successfully!');
      } else {
        toast.error(data.error || 'Cancellation failed');
      }
    } catch (err: any) {
      toast.error(err.message);
      addLog('Cancellation', { bookingReference }, { error: err.message });
    } finally {
      setLoading(null);
    }
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `${'='.repeat(60)}\n` +
      `STEP: ${log.step}\n` +
      `TIMESTAMP: ${log.timestamp}\n` +
      `${'='.repeat(60)}\n\n` +
      `REQUEST:\n${JSON.stringify(log.request, null, 2)}\n\n` +
      `RESPONSE:\n${JSON.stringify(log.response, null, 2)}\n\n`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotelbeds-certification-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exported!');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hotelbeds API Certification Test</h1>
          <p className="text-muted-foreground">
            Complete all steps below to generate certification logs for Hotelbeds
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column - Actions */}
          <div className="space-y-4">
            {/* Step 0: Search Hotels */}
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Step 0: Search Hotels (Get Rate Key)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Search for hotels to get a rate key. Use TEST environment destinations like PMI (Palma de Mallorca).
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Destination Code</Label>
                    <Input 
                      value={searchDestination} 
                      onChange={(e) => setSearchDestination(e.target.value)}
                      placeholder="PMI"
                    />
                  </div>
                  <div>
                    <Label>Check-in</Label>
                    <Input 
                      type="date" 
                      value={searchCheckIn} 
                      onChange={(e) => setSearchCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input 
                      type="date" 
                      value={searchCheckOut} 
                      onChange={(e) => setSearchCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={searchLoading}
                  className="w-full"
                >
                  {searchLoading ? 'Searching...' : 'Search Hotels'}
                </Button>

                {/* Hotel Results */}
                {hotels.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label>Select a hotel to see rate keys:</Label>
                    {hotels.map((hotel) => (
                      <div key={hotel.code} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedHotel(expandedHotel === hotel.code ? null : hotel.code)}
                          className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Hotel className="w-4 h-4 text-primary" />
                            <span className="font-medium">{hotel.name}</span>
                            <Badge variant="outline" className="text-xs">{hotel.categoryName}</Badge>
                          </div>
                          {expandedHotel === hotel.code ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        
                        {expandedHotel === hotel.code && (
                          <div className="border-t p-3 bg-muted/30 space-y-2">
                            {hotel.rooms?.map((room, roomIdx) => (
                              <div key={roomIdx} className="space-y-1">
                                <p className="text-sm font-medium">{room.name}</p>
                                {room.rates?.map((rate, rateIdx) => (
                                  <div 
                                    key={rateIdx} 
                                    className="flex items-center justify-between p-2 bg-background rounded border text-xs"
                                  >
                                    <div>
                                      <span className="font-mono">{rate.boardName}</span>
                                      <span className="text-muted-foreground ml-2">€{rate.net}</span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={copiedKey === rate.rateKey ? "default" : "outline"}
                                      onClick={() => copyRateKey(rate.rateKey)}
                                      className="h-7"
                                    >
                                      {copiedKey === rate.rateKey ? (
                                        <>
                                          <Check className="w-3 h-3 mr-1" />
                                          Copied!
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3 mr-1" />
                                          Use This Rate
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rate Key Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Rate Key</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={rateKey} 
                  onChange={(e) => setRateKey(e.target.value)}
                  placeholder="Search above and click 'Use This Rate' to select a rate key, or paste one manually..."
                  className="font-mono text-xs"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Step 1: Check Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 1: CheckRate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Validates the rate is still available before booking.
                </p>
                <Button 
                  onClick={handleCheckRate} 
                  disabled={loading !== null || !rateKey}
                  className="w-full"
                >
                  {loading === 'checkRate' ? 'Checking...' : 'Check Rate'}
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Book */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 2: Book (Confirmation)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Holder First Name</Label>
                    <Input value={holderName} onChange={(e) => setHolderName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Holder Last Name</Label>
                    <Input value={holderSurname} onChange={(e) => setHolderSurname(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Guest First Name</Label>
                    <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Guest Last Name</Label>
                    <Input value={guestSurname} onChange={(e) => setGuestSurname(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Client Reference</Label>
                  <Input value={clientReference} onChange={(e) => setClientReference(e.target.value)} />
                </div>
                <Button 
                  onClick={handleBook} 
                  disabled={loading !== null || !rateKey}
                  className="w-full"
                >
                  {loading === 'book' ? 'Booking...' : 'Create Booking'}
                </Button>
              </CardContent>
            </Card>

            {/* Step 3: Cancel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 3: Cancellation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Booking Reference</Label>
                  <Input 
                    value={bookingReference} 
                    onChange={(e) => setBookingReference(e.target.value)}
                    placeholder="e.g., 123-456789"
                  />
                </div>
                <Button 
                  onClick={handleCancel} 
                  disabled={loading !== null || !bookingReference}
                  variant="destructive"
                  className="w-full"
                >
                  {loading === 'cancel' ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </CardContent>
            </Card>

            {/* Export Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Export Certification Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={exportLogs} 
                  disabled={logs.length === 0}
                  variant="outline"
                  className="w-full"
                >
                  Download All Logs ({logs.length} entries)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Last Response</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => captureScreenshot(logs.length > 0 ? logs[logs.length - 1].step : 'response')}
                  disabled={!lastResult}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Screenshot
                </Button>
              </CardHeader>
              <CardContent>
                <div ref={responseRef} className="bg-white p-4 rounded-lg">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[600px] whitespace-pre-wrap text-foreground">
                    {lastResult ? JSON.stringify(lastResult, null, 2) : 'No response yet. Complete a step to see results.'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Log History */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complete Log History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{log.step}</span>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Request</Label>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.request, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <Label className="text-xs">Response</Label>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
