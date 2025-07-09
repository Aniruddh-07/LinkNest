
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Paperclip, Share2, Wifi } from "lucide-react";

export function FileShare() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (selectedFile && progress < 100) {
            timer = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 100 : prev + 10));
            }, 500);
        }
        if (progress >= 100) {
            setTimeout(() => {
                setSelectedFile(null);
                setProgress(0);
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [selectedFile, progress]);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
            setProgress(0);
        }
    }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">File Share</CardTitle>
        <Share2 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
             <label htmlFor="file-upload" className="relative cursor-pointer">
                <div className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-lg border-muted-foreground/30 hover:bg-muted">
                    <div className="text-center">
                        <Paperclip className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-1 text-sm text-muted-foreground">Click to select a file</p>
                    </div>
                </div>
            </label>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          </div>
          
          {selectedFile && (
             <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-muted-foreground">{progress}%</p>
                </div>
                <Progress value={progress} />
             </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled={!selectedFile || (progress > 0 && progress < 100)}>
              <Share2 className="mr-2 h-4 w-4" />
              Torrent Share
            </Button>
            <Button variant="outline" disabled={!selectedFile || (progress > 0 && progress < 100)}>
              <Wifi className="mr-2 h-4 w-4" />
              Nearby Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
