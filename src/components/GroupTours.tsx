import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin } from 'lucide-react';
import sunCityImage from '@/assets/sun-city.jpeg';

const groupTours = [
  {
    id: 'cape-town-christmas',
    title: 'Christmas in Cape Town',
    dates: '24-27 December 2025',
    price: 2500,
    image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/cape%20town.jpg',
    badge: 'CHRISTMAS',
    location: 'Cape Town',
  },
  {
    id: 'sun-city-newyear',
    title: 'New Year in Sun City',
    dates: '31 Dec - 02 Jan 2026',
    price: 2800,
    image: sunCityImage,
    badge: 'NEW YEAR',
    location: 'Sun City',
  },
  {
    id: 'durban-christmas',
    title: 'Christmas in Durban',
    dates: '24-27 December 2025',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b8b4c22?w=800',
    badge: 'CHRISTMAS',
    location: 'Durban',
  },
  {
    id: 'mpumalanga-newyear',
    title: 'New Year in Mpumalanga',
    dates: '31 Dec - 02 Jan 2026',
    price: 2600,
    image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=800',
    badge: 'NEW YEAR',
    location: 'Mpumalanga',
  },
];

export function GroupTours() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="group-tours" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Group Tours & Special Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our organized group getaways for Christmas and New Year celebrations. 
            All-inclusive packages with transport, accommodation, and activities!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupTours.map(tour => (
            <Card key={tour.id} className="group overflow-hidden border-0 shadow-soft bg-card hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${
                  tour.badge === 'CHRISTMAS' 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {tour.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-display font-bold text-white mb-1">
                    {tour.title}
                  </h3>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tour.location}
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{tour.dates}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(tour.price)} pp</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const text = `Hi! I'm interested in the ${tour.title} group tour (${tour.dates}). Please send me more details.`;
                      window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
