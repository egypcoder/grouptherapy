
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";
import { AudioUpload } from "@/components/audio-upload";
import { AdminLayout } from "./index";
import type { RadioShow } from "@shared/schema";

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AdminRadioShows() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<RadioShow | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    hostName: "",
    description: "",
    hostImageUrl: "",
    coverUrl: "",
    recordedUrl: "",
    dayOfWeek: 1,
    startTime: "00:00",
    endTime: "00:00",
    timezone: "UTC",
  });

  const { data: shows = [] } = useQuery<RadioShow[]>({
    queryKey: ["/api/radio/shows"],
  });

  const handleEdit = (show: RadioShow) => {
    setEditingShow(show);
    setFormData({
      title: show.title || "",
      hostName: show.hostName || "",
      description: show.description || "",
      hostImageUrl: show.hostImageUrl || "",
      coverUrl: show.coverUrl || "",
      recordedUrl: show.recordedUrl || "",
      dayOfWeek: show.dayOfWeek || 1,
      startTime: show.startTime || "00:00",
      endTime: show.endTime || "00:00",
      timezone: show.timezone || "UTC",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this show?")) {
      toast({
        title: "Show deleted",
        description: "The radio show has been removed.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: editingShow ? "Show updated" : "Show created",
      description: editingShow ? "The radio show has been updated." : "The radio show has been created.",
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingShow(null);
    setFormData({
      title: "",
      hostName: "",
      description: "",
      hostImageUrl: "",
      coverUrl: "",
      recordedUrl: "",
      dayOfWeek: 1,
      startTime: "00:00",
      endTime: "00:00",
      timezone: "UTC",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Radio Shows</h1>
            <p className="text-muted-foreground">Manage radio show schedule</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Show
          </Button>
        </div>

        <div className="grid gap-4">
          {shows.map((show) => (
            <Card key={show.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-full overflow-hidden flex-shrink-0">
                    {show.hostImageUrl ? (
                      <img src={show.hostImageUrl} alt={show.hostName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Radio className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{show.title}</h3>
                    <p className="text-sm text-muted-foreground">with {show.hostName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {daysOfWeek.find(d => d.value === show.dayOfWeek)?.label} • {show.startTime} - {show.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(show)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(show.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingShow ? "Edit Show" : "Add New Show"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Show Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hostName">Host Name</Label>
                <Input
                  id="hostName"
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Host Image</Label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, hostImageUrl: url })}
                  bucket="media"
                  folder="hosts"
                  aspectRatio="square"
                />
              </div>
              <div>
                <Label>Show Cover Image</Label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, coverUrl: url })}
                  bucket="media"
                  folder="shows"
                  aspectRatio="square"
                />
              </div>
              <div>
                <Label>Recorded Episode (Optional)</Label>
                <AudioUpload
                  onUploadComplete={(url) => setFormData({ ...formData, recordedUrl: url })}
                  bucket="media"
                  folder="radio-recordings"
                />
              </div>
              <div>
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select value={formData.dayOfWeek.toString()} onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
