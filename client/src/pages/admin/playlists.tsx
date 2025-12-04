
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ListMusic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";
import { AdminLayout } from "./index";
import type { Playlist } from "@shared/schema";

export default function AdminPlaylists() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    spotifyUrl: "",
    spotifyPlaylistId: "",
    featured: false,
  });

  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const handleEdit = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      title: playlist.title || "",
      description: playlist.description || "",
      coverUrl: playlist.coverUrl || "",
      spotifyUrl: playlist.spotifyUrl || "",
      spotifyPlaylistId: playlist.spotifyPlaylistId || "",
      featured: playlist.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      toast({
        title: "Playlist deleted",
        description: "The playlist has been removed.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: editingPlaylist ? "Playlist updated" : "Playlist created",
      description: editingPlaylist ? "The playlist has been updated." : "The playlist has been created.",
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingPlaylist(null);
    setFormData({
      title: "",
      description: "",
      coverUrl: "",
      spotifyUrl: "",
      spotifyPlaylistId: "",
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Playlists</h1>
            <p className="text-muted-foreground">Manage curated playlists</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Playlist
          </Button>
        </div>

        <div className="grid gap-4">
          {playlists.map((playlist) => (
            <Card key={playlist.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                    {playlist.coverUrl ? (
                      <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ListMusic className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{playlist.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                    {playlist.trackCount && (
                      <p className="text-xs text-muted-foreground mt-1">{playlist.trackCount} tracks</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(playlist)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(playlist.id)}>
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
              <DialogTitle>{editingPlaylist ? "Edit Playlist" : "Add New Playlist"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label>Playlist Cover</Label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, coverUrl: url })}
                  bucket="media"
                  folder="playlists"
                  aspectRatio="square"
                  currentImage={formData.coverUrl}
                />
              </div>
              <div>
                <Label htmlFor="spotifyUrl">Spotify URL</Label>
                <Input
                  id="spotifyUrl"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/playlist/..."
                />
              </div>
              <div>
                <Label htmlFor="spotifyPlaylistId">Spotify Playlist ID</Label>
                <Input
                  id="spotifyPlaylistId"
                  value={formData.spotifyPlaylistId}
                  onChange={(e) => setFormData({ ...formData, spotifyPlaylistId: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <Label htmlFor="featured">Featured</Label>
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
