
import { useState, useRef } from "react";
import { Upload, X, Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { uploadAudio, isCloudinaryConfigured } from "@/lib/cloudinary";

interface AudioUploadProps {
  onUploadComplete: (url: string) => void;
  bucket?: string;
  folder?: string;
  currentAudio?: string;
  acceptedFormats?: string[];
}

export function AudioUpload({
  onUploadComplete,
  bucket = "media",
  folder = "audio",
  currentAudio,
  acceptedFormats = [".mp3", ".wav", ".m4a", ".aac"]
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(currentAudio || null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Audio must be less than 50MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const url = await uploadAudio(file, folder);
      
      setAudioUrl(url);
      onUploadComplete(url);
      toast({ title: "Audio uploaded successfully" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
      setAudioUrl(null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setAudioUrl(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {audioUrl ? (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName || "Audio file"}</p>
              <audio controls className="w-full mt-2" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
            {!uploading && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
          </div>
        </Card>
      ) : (
        <Card
          className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer p-8"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Music className="h-12 w-12" />
            <div className="text-center">
              <p className="font-medium">Click to upload audio</p>
              <p className="text-sm">MP3, WAV, M4A, AAC up to 50MB</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
