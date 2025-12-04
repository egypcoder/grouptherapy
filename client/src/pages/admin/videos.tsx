
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Video as VideoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";
import { VideoUpload } from "@/components/video-upload";
import { AdminLayout } from "./index";
import type { Video } from "@shared/schema";

export default function AdminVideos() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    artistName: "",
    youtubeId: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "music-video",
    description: "",
    featured: false,
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || "",
      artistName: video.artistName || "",
      youtubeId: video.youtubeId || "",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "music-video",
      description: video.description || "",
      featured: video.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      toast({
        title: "Video deleted",
        description: "The video has been removed.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: editingVideo ? "Video updated" : "Video created",
      description: editingVideo ? "The video has been updated." : "The video has been created.",
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      title: "",
      artistName: "",
      youtubeId: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "music-video",
      description: "",
      featured: false,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground">Manage video content</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>

        <div className="grid gap-4">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <VideoIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.artistName}</p>
                    <p className="text-xs text-muted-foreground mt-1">Category: {video.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(video.id)}>
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
              <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
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
                <Label htmlFor="artistName">Artist Name</Label>
                <Input
                  id="artistName"
                  value={formData.artistName}
                  onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="youtubeId">YouTube ID (Optional)</Label>
                <Input
                  id="youtubeId"
                  value={formData.youtubeId}
                  onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                />
                <p className="text-xs text-muted-foreground mt-1">Or upload a video file below</p>
              </div>
              <div>
                <Label>Video Upload</Label>
                <VideoUpload
                  onUploadComplete={(url) => setFormData({ ...formData, videoUrl: url })}
                  bucket="media"
                  folder="videos"
                />
              </div>
              <div>
                <Label>Thumbnail Image</Label>
                <ImageUpload
                  onUploadComplete={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                  bucket="media"
                  folder="thumbnails"
                  aspectRatio="video"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music-video">Music Video</SelectItem>
                    <SelectItem value="live">Live Performance</SelectItem>
                    <SelectItem value="behind-the-scenes">Behind the Scenes</SelectItem>
                    <SelectItem value="event">Event Video</SelectItem>
                  </SelectContent>
                </Select>
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
