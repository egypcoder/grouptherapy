
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";
import { AdminLayout } from "./index";
import type { Artist } from "@shared/schema";

export default function AdminArtists() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    imageUrl: "",
    spotify: "",
    instagram: "",
    soundcloud: "",
    featured: false,
  });

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name || "",
      bio: artist.bio || "",
      imageUrl: artist.imageUrl || "",
      spotify: artist.socialLinks?.spotify || "",
      instagram: artist.socialLinks?.instagram || "",
      soundcloud: artist.socialLinks?.soundcloud || "",
      featured: artist.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this artist?")) {
      toast({
        title: "Artist deleted",
        description: "The artist has been removed.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: editingArtist ? "Artist updated" : "Artist created",
      description: editingArtist ? "The artist has been updated." : "The artist has been created.",
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingArtist(null);
    setFormData({
      name: "",
      bio: "",
      imageUrl: "",
      spotify: "",
      instagram: "",
      soundcloud: "",
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Artists</h1>
            <p className="text-muted-foreground">Manage artist profiles</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Artist
          </Button>
        </div>

        <div className="grid gap-4">
          {artists.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-full overflow-hidden flex-shrink-0">
                    {artist.imageUrl ? (
                      <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(artist)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(artist.id)}>
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
              <DialogTitle>{editingArtist ? "Edit Artist" : "Add New Artist"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div>
                <Label>Artist Image</Label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
                  bucket="media"
                  folder="artists"
                  aspectRatio="square"
                  currentImage={formData.imageUrl}
                />
              </div>
              <div>
                <Label>Social Links</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Spotify URL"
                    value={formData.spotify}
                    onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                  />
                  <Input
                    placeholder="Instagram URL"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                  <Input
                    placeholder="SoundCloud URL"
                    value={formData.soundcloud}
                    onChange={(e) => setFormData({ ...formData, soundcloud: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured Artist</Label>
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
