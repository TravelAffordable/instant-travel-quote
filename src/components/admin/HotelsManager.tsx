import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Area = {
  id: string;
  destination: string;
  name: string;
};

type Hotel = {
  id: string;
  area_id: string;
  name: string;
  star_rating: number | null;
  tier: string;
  includes_breakfast: boolean;
  is_active: boolean;
  areas?: Area;
};

const TIERS = [
  { value: "budget", label: "Budget", color: "bg-green-500" },
  { value: "affordable", label: "Affordable", color: "bg-blue-500" },
  { value: "premium", label: "Premium", color: "bg-purple-500" },
];

export const HotelsManager = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newHotel, setNewHotel] = useState<{
    area_id: string;
    name: string;
    star_rating: number;
    tier: "budget" | "affordable" | "premium";
    includes_breakfast: boolean;
  }>({
    area_id: "",
    name: "",
    star_rating: 3,
    tier: "affordable",
    includes_breakfast: false,
  });
  const { toast } = useToast();

  const fetchData = async () => {
    const [hotelsRes, areasRes] = await Promise.all([
      supabase
        .from("hotels")
        .select("*, areas(id, destination, name)")
        .order("name", { ascending: true }),
      supabase.from("areas").select("*").order("destination").order("name"),
    ]);

    if (hotelsRes.error) {
      toast({ title: "Error", description: hotelsRes.error.message, variant: "destructive" });
    } else {
      setHotels(hotelsRes.data || []);
    }

    if (areasRes.error) {
      toast({ title: "Error", description: areasRes.error.message, variant: "destructive" });
    } else {
      setAreas(areasRes.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddHotel = async () => {
    if (!newHotel.area_id || !newHotel.name) {
      toast({ title: "Error", description: "Area and hotel name are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("hotels").insert([newHotel]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Hotel added successfully" });
      setNewHotel({ area_id: "", name: "", star_rating: 3, tier: "affordable", includes_breakfast: false });
      setDialogOpen(false);
      fetchData();
    }
  };

  const handleDeleteHotel = async (id: string) => {
    const { error } = await supabase.from("hotels").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Hotel deleted" });
      fetchData();
    }
  };

  const filteredHotels = hotels.filter((h) => {
    if (filterArea !== "all" && h.area_id !== filterArea) return false;
    if (filterTier !== "all" && h.tier !== filterTier) return false;
    return true;
  });

  const getTierBadge = (tier: string) => {
    const t = TIERS.find((x) => x.value === tier);
    return (
      <Badge className={`${t?.color} text-white`}>
        {t?.label || tier}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hotels</CardTitle>
            <CardDescription>Manage hotels across all areas and tiers.</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hotel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Select value={newHotel.area_id} onValueChange={(v) => setNewHotel({ ...newHotel, area_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.destination.replace("_", " ")} - {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hotel Name</Label>
                  <Input
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    placeholder="e.g. Southern Sun Elangeni"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Star Rating</Label>
                  <Select
                    value={String(newHotel.star_rating)}
                    onValueChange={(v) => setNewHotel({ ...newHotel, star_rating: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <SelectItem key={s} value={String(s)}>
                          {s} Star{s > 1 && "s"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price Tier</Label>
                  <Select value={newHotel.tier} onValueChange={(v) => setNewHotel({ ...newHotel, tier: v as "budget" | "affordable" | "premium" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="breakfast"
                    checked={newHotel.includes_breakfast}
                    onCheckedChange={(c) => setNewHotel({ ...newHotel, includes_breakfast: c === true })}
                  />
                  <Label htmlFor="breakfast">Includes Breakfast</Label>
                </div>
                <Button onClick={handleAddHotel} className="w-full">
                  Add Hotel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.destination.replace("_", " ")} - {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {TIERS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="self-center">
            {filteredHotels.length} hotels
          </Badge>
        </div>

        {/* Hotels Table */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredHotels.length === 0 ? (
          <p className="text-muted-foreground">No hotels found. Add hotels to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Stars</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Breakfast</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-medium">{hotel.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {hotel.areas?.destination.replace("_", " ")} - {hotel.areas?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {hotel.star_rating}
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(hotel.tier)}</TableCell>
                  <TableCell>
                    {hotel.includes_breakfast ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteHotel(hotel.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
