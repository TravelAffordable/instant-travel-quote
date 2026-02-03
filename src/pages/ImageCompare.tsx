import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bookingScreenshot from "@/assets/compare/the-hart-house-booking.png";
import aiImage from "@/assets/hotels/harties-budget-2s-8a.jpg";

export default function ImageCompare() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold">Image Comparison</h1>
            <p className="text-sm text-muted-foreground">
              Harties Budget 2 Sleeper Option 8 (The Hart House)
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold">Real (Booking.com screenshot)</h2>
              <p className="text-sm text-muted-foreground">Reference only (not used in app)</p>
            </CardHeader>
            <CardContent>
              <img
                src={bookingScreenshot}
                alt="The Hart House on Booking.com (screenshot)"
                className="w-full h-auto rounded-md border"
                loading="lazy"
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <h2 className="text-base font-semibold">AI-generated (used in quote cards)</h2>
              <p className="text-sm text-muted-foreground">File: harties-budget-2s-8a.jpg</p>
            </CardHeader>
            <CardContent>
              <img
                src={aiImage}
                alt="AI-generated image for Harties Budget 2 Sleeper Option 8"
                className="w-full h-auto rounded-md border"
                loading="lazy"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
