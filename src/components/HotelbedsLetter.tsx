import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

const HotelbedsLetter = () => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const letterContent = `
INSTANT TRAVEL QUOTE
South Africa

${currentDate}

Hotelbeds Certification Team
Hotelbeds Group
Palma de Mallorca, Spain

RE: API Integration Certification - Test Results Submission

Dear Hotelbeds Certification Team,

I am writing to formally submit the certification test results for our Hotelbeds API integration. Please find enclosed the complete documentation of our successful API testing, which demonstrates full compliance with your integration requirements.

CERTIFICATION TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following API endpoints have been successfully tested and validated:

1. AVAILABILITY SEARCH
   • Destination: Johannesburg, South Africa
   • Check-in: 7 February 2026
   • Check-out: 9 February 2026
   • Occupancy: 2 Adults, 1 Room
   • Result: Successfully retrieved hotel availability with rates

2. CHECK RATE
   • Hotel: The Bannister Hotel (Code: 585194)
   • Room Type: Double Room (DBL.ST-1)
   • Board: Bed and Breakfast
   • Rate: €96.38 / ZAR 1,973
   • Result: Rate successfully validated

3. BOOKING CONFIRMATION
   • Booking Reference: 241-3118073
   • Client Reference: TEST-1767878475008
   • Status: CONFIRMED
   • Hotel: The Bannister Hotel
   • Guest: John Doe
   • Result: Booking successfully created

4. BOOKING CANCELLATION
   • Booking Reference: 241-3118073
   • Cancellation Reference: 124a93833b0b1f5f01d7
   • Status: CANCELLED
   • Result: Booking successfully cancelled

TECHNICAL IMPLEMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our integration includes the following features:
• Secure SHA-256 signature generation for API authentication
• Real-time currency conversion (EUR to ZAR)
• Comprehensive error handling and logging
• Full request/response audit trail
• Support for complex occupancy configurations (adults + children)

ATTACHED DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Complete API log history with timestamps
2. Availability search request/response
3. CheckRate request/response
4. Booking confirmation request/response
5. Cancellation request/response
6. Screenshots of test interface

REQUEST FOR HOTEL IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

As we prepare to launch our booking platform, we kindly request access to high-quality, authentic hotel images to enhance our customer experience. Specifically, we would appreciate:

• High-resolution property exterior photos
• Room interior photographs for each room category
• Facility and amenity images (pool, restaurant, spa, etc.)
• Location and surrounding area photos

We understand that accurate visual representation is crucial for customer trust and would greatly appreciate guidance on:
1. How to access the Hotelbeds image API or content hub
2. Image licensing terms and usage rights
3. Best practices for image caching and display

We are committed to presenting your partner hotels in the best possible light and ensuring all imagery meets your brand standards.

NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We are eager to proceed with the certification approval and move to the production environment. Please review the enclosed documentation and advise on any additional requirements or adjustments needed.

We look forward to a successful partnership with Hotelbeds.

Yours sincerely,


_______________________________
[Your Name]
[Your Title]
Instant Travel Quote
Email: [your-email@domain.com]
Phone: [Your Phone Number]
Website: instant-travel-quote.lovable.app


ENCLOSURES:
• Certification Test Logs (hotelbeds-certification-logs.txt)
• API Response Screenshots (4 images)
• Integration Documentation
`.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letterContent);
    toast.success("Letter copied to clipboard!");
  };

  const downloadLetter = () => {
    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hotelbeds-certification-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Letter downloaded!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-3 mb-6">
        <Button onClick={copyToClipboard} className="gap-2">
          <Copy className="w-4 h-4" /> Copy Letter
        </Button>
        <Button onClick={downloadLetter} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Download
        </Button>
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-800">
            {letterContent}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelbedsLetter;
