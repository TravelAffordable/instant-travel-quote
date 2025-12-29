import { jsPDF } from 'jspdf';

// Booking disclaimer text to appear at bottom of every quote
export const BOOKING_DISCLAIMER = `BOOKING PROCESS

To start with your booking please request the invoice. Please request on the day you would be making payment as the invoice and availability confirmation are valid for only 1 day.

A 50% deposit secures the booking.

As soon as we receive your deposit we proceed with bookings then send you a confirmation letter which will have your hotel confirmation number and all the important information on your Getaway Package.

Thank you,

Accounts,
Travel Affordable Pty Ltd
The Atrium Building
5th Street, Sandown
Sandton
Tel: 0796813869
e: info@travelaffordable.co.za
https://instant-travel-quote.lovable.app`;

// Interface for quote data that can be embedded in PDFs
export interface QuoteFormData {
  quoteType: 'accommodation-provider' | 'travel-agent' | 'bus-hire' | 'custom';
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms?: number;
  packageIds: string[];
  hotelName?: string;
  hotelQuoteAmount?: string;
  hotels?: { id: string; name: string; quoteAmount: string }[];
  roomCategories?: { id: string; name: string; count: number }[];
  facilities?: string[];
  busQuoteAmount?: string;
  companyDetails?: {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;
    vatNumber: string;
    quoteValidDays: number;
    termsAndConditions: string;
    clientName: string;
    clientCompany: string;
    clientEmail: string;
  };
  enableFamilySplit?: boolean;
  families?: { id: string; familyName: string; adults: number; children: number; childrenAges: number[] }[];
  quoteNumber?: string;
}

// Encode quote data as base64 for embedding
export function encodeQuoteData(data: QuoteFormData): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

// Decode quote data from base64
export function decodeQuoteData(encoded: string): QuoteFormData | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch (e) {
    console.error('Failed to decode quote data:', e);
    return null;
  }
}

// Add quote data marker to PDF content (as hidden text)
export function addQuoteDataToPDF(doc: jsPDF, data: QuoteFormData): void {
  const encoded = encodeQuoteData(data);
  // Add as metadata that won't be visible but can be extracted
  doc.setProperties({
    title: 'Travel Quote',
    subject: 'Travel Quote Document',
    author: 'Travel Affordable',
    keywords: `QUOTE_DATA:${encoded}`,
    creator: 'Travel Affordable Quote System'
  });
}

// Add booking disclaimer to PDF
export function addBookingDisclaimerToPDF(doc: jsPDF, startY?: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Check if we need a new page
  let yPos = startY || 200;
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }
  
  // Draw separator line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  // Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Blue color
  doc.text('BOOKING PROCESS', 20, yPos);
  yPos += 8;
  
  // Body text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const lines = [
    'To start with your booking please request the invoice. Please request on the day you would be',
    'making payment as the invoice and availability confirmation are valid for only 1 day.',
    '',
    'A 50% deposit secures the booking.',
    '',
    'As soon as we receive your deposit we proceed with bookings then send you a confirmation',
    'letter which will have your hotel confirmation number and all the important information on',
    'your Getaway Package.',
    '',
    'Thank you,'
  ];
  
  lines.forEach(line => {
    if (yPos < pageHeight - 30) {
      doc.text(line, 20, yPos);
      yPos += 4;
    }
  });
  
  yPos += 2;
  
  // Company signature
  doc.setFont('helvetica', 'bold');
  doc.text('Accounts,', 20, yPos); yPos += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Travel Affordable Pty Ltd', 20, yPos); yPos += 4;
  doc.text('The Atrium Building', 20, yPos); yPos += 4;
  doc.text('5th Street, Sandown', 20, yPos); yPos += 4;
  doc.text('Sandton', 20, yPos); yPos += 4;
  doc.text('Tel: 0796813869', 20, yPos); yPos += 4;
  doc.text('e: info@travelaffordable.co.za', 20, yPos); yPos += 4;
  doc.setTextColor(30, 64, 175);
  doc.text('https://instant-travel-quote.lovable.app', 20, yPos);
  
  return yPos;
}

// Extract quote data from a PDF file
export async function extractQuoteDataFromPDF(file: File): Promise<QuoteFormData | null> {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure worker using unpkg CDN which works better with ES modules
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Try to get metadata
    const metadata = await pdf.getMetadata();
    const keywords = (metadata?.info as any)?.Keywords || '';
    
    // Check if we have embedded quote data
    if (keywords.startsWith('QUOTE_DATA:')) {
      const encodedData = keywords.replace('QUOTE_DATA:', '');
      return decodeQuoteData(encodedData);
    }
    
    // If no embedded data, try to parse from text content
    return await parseQuoteFromText(pdf);
  } catch (error) {
    console.error('Error extracting quote data from PDF:', error);
    return null;
  }
}

// Fallback: Try to parse quote data from PDF text content
async function parseQuoteFromText(pdf: any): Promise<QuoteFormData | null> {
  try {
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    // Parse basic fields from text
    const data: Partial<QuoteFormData> = {
      quoteType: 'accommodation-provider',
      packageIds: [],
      childrenAges: [],
    };
    
    // Extract destination
    const destMatch = fullText.match(/Destination:\s*([^\n\r]+)/i);
    if (destMatch) {
      data.destination = destMatch[1].trim();
    }
    
    // Extract check-in date
    const checkinMatch = fullText.match(/Check-in:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
    if (checkinMatch) {
      data.checkIn = checkinMatch[1];
    }
    
    // Extract check-out date
    const checkoutMatch = fullText.match(/Check-out:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
    if (checkoutMatch) {
      data.checkOut = checkoutMatch[1];
    }
    
    // Extract adults
    const adultsMatch = fullText.match(/(\d+)\s*Adults?/i);
    if (adultsMatch) {
      data.adults = parseInt(adultsMatch[1]);
    }
    
    // Extract children
    const childrenMatch = fullText.match(/(\d+)\s*Children?/i);
    if (childrenMatch) {
      data.children = parseInt(childrenMatch[1]);
    }
    
    // Extract hotel name
    const hotelMatch = fullText.match(/Hotel:\s*([^\n\r|]+)/i);
    if (hotelMatch) {
      data.hotelName = hotelMatch[1].trim();
    }
    
    // Extract rooms
    const roomsMatch = fullText.match(/(\d+)\s*room/i);
    if (roomsMatch) {
      data.rooms = parseInt(roomsMatch[1]);
    }
    
    // Determine quote type from content
    if (fullText.includes('Travel Agent') || fullText.includes('TRAVEL AGENT')) {
      data.quoteType = 'travel-agent';
    } else if (fullText.includes('Bus Company') || fullText.includes('Group Tour Quote')) {
      data.quoteType = 'bus-hire';
    }
    
    return data as QuoteFormData;
  } catch (error) {
    console.error('Error parsing text from PDF:', error);
    return null;
  }
}
