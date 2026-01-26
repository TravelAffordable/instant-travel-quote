import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, BedDouble, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Hotel = {
  id: string;
  name: string;
  tier: string;
  areas?: { destination: string; name: string } | null;
};

type HotelInRate = {
  name: string;
  tier: string;
};

type RoomType = {
  id: string;
  hotel_id: string;
  name: string;
  capacity: string;
  max_adults: number;
  max_children: number;
  hotels?: Hotel | null;
};

type RoomRate = {
  id: string;
  room_type_id: string;
  base_rate_weekday: number;
  base_rate_weekend: number;
  effective_from: string;
  effective_to: string | null;
  room_types?: {
    id: string;
    hotel_id: string;
    name: string;
    capacity: string;
    max_adults: number;
    max_children: number;
    hotels?: HotelInRate | null;
  } | null;
};

const CAPACITIES = [
  { value: "2_sleeper", label: "2-Sleeper" },
  { value: "4_sleeper", label: "4-Sleeper" },
];

export const RatesManager = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterHotel, setFilterHotel] = useState<string>("all");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<{
    hotel_id: string;
    name: string;
    capacity: "2_sleeper" | "4_sleeper";
    max_adults: number;
    max_children: number;
  }>({
    hotel_id: "",
    name: "",
    capacity: "2_sleeper",
    max_adults: 2,
    max_children: 0,
  });
  const [newRate, setNewRate] = useState({
    room_type_id: "",
    base_rate_weekday: 0,
    base_rate_weekend: 0,
    effective_from: new Date().toISOString().split("T")[0],
  });
  const { toast } = useToast();

  const fetchData = async () => {
    const [hotelsRes, roomsRes, ratesRes] = await Promise.all([
      supabase.from("hotels").select("*, areas(destination, name)").order("name"),
      supabase.from("room_types").select("*, hotels(id, name, tier, areas(destination, name))").order("name"),
      supabase.from("room_rates").select("*, room_types(*, hotels(name, tier))").order("effective_from", { ascending: false }),
    ]);

    if (!hotelsRes.error) setHotels(hotelsRes.data || []);
    if (!roomsRes.error) setRoomTypes(roomsRes.data || []);
    if (!ratesRes.error) setRates(ratesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRoom = async () => {
    if (!newRoom.hotel_id || !newRoom.name) {
      toast({ title: "Error", description: "Hotel and room name are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("room_types").insert([newRoom]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Room type added" });
      setNewRoom({ hotel_id: "", name: "", capacity: "2_sleeper", max_adults: 2, max_children: 0 });
      setRoomDialogOpen(false);
      fetchData();
    }
  };

  const handleAddRate = async () => {
    if (!newRate.room_type_id || !newRate.base_rate_weekday) {
      toast({ title: "Error", description: "Room type and weekday rate are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("room_rates").insert([newRate]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Rate added" });
      setNewRate({ room_type_id: "", base_rate_weekday: 0, base_rate_weekend: 0, effective_from: new Date().toISOString().split("T")[0] });
      setRateDialogOpen(false);
      fetchData();
    }
  };

  const handleDeleteRoom = async (id: string) => {
    const { error } = await supabase.from("room_types").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Room type removed" });
      fetchData();
    }
  };

  const handleDeleteRate = async (id: string) => {
    const { error } = await supabase.from("room_rates").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Rate removed" });
      fetchData();
    }
  };

  const filteredRoomTypes = roomTypes.filter((r) => filterHotel === "all" || r.hotel_id === filterHotel);
  const filteredRates = rates.filter((r) => {
    if (filterHotel === "all") return true;
    const rt = roomTypes.find((rt) => rt.id === r.room_type_id);
    return rt?.hotel_id === filterHotel;
  });

  return (
    <div className="space-y-6">
      {/* Room Types Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room Types</CardTitle>
              <CardDescription>Define room configurations for each hotel.</CardDescription>
            </div>
            <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Room Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Room Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Hotel</Label>
                    <Select value={newRoom.hotel_id} onValueChange={(v) => setNewRoom({ ...newRoom, hotel_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((h) => (
                          <SelectItem key={h.id} value={h.id}>
                            {h.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Name</Label>
                    <Input
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="e.g. Deluxe Double Room"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity</Label>
                    <Select value={newRoom.capacity} onValueChange={(v) => setNewRoom({ ...newRoom, capacity: v as "2_sleeper" | "4_sleeper" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CAPACITIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Adults</Label>
                      <Input
                        type="number"
                        min={1}
                        max={6}
                        value={newRoom.max_adults}
                        onChange={(e) => setNewRoom({ ...newRoom, max_adults: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Children</Label>
                      <Input
                        type="number"
                        min={0}
                        max={4}
                        value={newRoom.max_children}
                        onChange={(e) => setNewRoom({ ...newRoom, max_children: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddRoom} className="w-full">
                    Add Room Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={filterHotel} onValueChange={setFilterHotel}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Filter by hotel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hotels</SelectItem>
              {hotels.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {loading ? (
            <p>Loading...</p>
          ) : filteredRoomTypes.length === 0 ? (
            <p className="text-muted-foreground">No room types. Add a hotel first, then add room types.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Max Occupancy</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoomTypes.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.hotels?.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <BedDouble className="h-3 w-3" />
                        {room.capacity === "2_sleeper" ? "2-Sleeper" : "4-Sleeper"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        {room.max_adults}A + {room.max_children}C
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}>
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

      {/* Rates Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room Rates</CardTitle>
              <CardDescription>Set weekday and weekend base rates for room types.</CardDescription>
            </div>
            <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Rate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Room Rate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Select value={newRate.room_type_id} onValueChange={(v) => setNewRate({ ...newRate, room_type_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.hotels?.name} - {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weekday Rate (R)</Label>
                      <Input
                        type="number"
                        value={newRate.base_rate_weekday}
                        onChange={(e) => setNewRate({ ...newRate, base_rate_weekday: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weekend Rate (R)</Label>
                      <Input
                        type="number"
                        value={newRate.base_rate_weekend}
                        onChange={(e) => setNewRate({ ...newRate, base_rate_weekend: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Effective From</Label>
                    <Input
                      type="date"
                      value={newRate.effective_from}
                      onChange={(e) => setNewRate({ ...newRate, effective_from: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddRate} className="w-full">
                    Add Rate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : filteredRates.length === 0 ? (
            <p className="text-muted-foreground">No rates defined. Add room types first, then set rates.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel / Room</TableHead>
                  <TableHead>Weekday</TableHead>
                  <TableHead>Weekend</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rate.room_types?.hotels?.name}</div>
                        <div className="text-sm text-muted-foreground">{rate.room_types?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">R{rate.base_rate_weekday.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">R{rate.base_rate_weekend.toLocaleString()}</TableCell>
                    <TableCell>{new Date(rate.effective_from).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRate(rate.id)}>
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
    </div>
  );
};
