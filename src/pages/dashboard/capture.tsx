import { useState } from 'react'
import { Camera, Upload, MapPin, ImagePlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function CapturePage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Capture Upload</h1>
        <p className="text-muted-foreground mt-1">
          Mobile-first, offline-tolerant photo capture and batch upload
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Location picker */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Select site, floor, and room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site</Label>
              <Input placeholder="Select site" />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input placeholder="Select floor" />
            </div>
            <div className="space-y-2">
              <Label>Room / Zone</Label>
              <Input placeholder="Select room or zone" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Recent: Building A, Floor 2
            </div>
          </CardContent>
        </Card>

        {/* Upload area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Capture or select from camera roll. Add batch metadata before upload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-2xl p-12 text-center transition-colors',
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              )}
            >
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium mb-2">Upload photos</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to select
              </p>
              <div className="flex gap-2 justify-center">
                <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  Select files
                </label>
                <Button variant="outline">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {selectedFiles.length} file(s) selected
                </p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() => removeFile(i)}
                    >
                      {file.name.slice(0, 20)}...
                      <span className="ml-1">×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Offline queue: 0</Badge>
              <span>Photos will sync when online</span>
            </div>

            <Button className="w-full rounded-full" disabled={selectedFiles.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Upload batch
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
