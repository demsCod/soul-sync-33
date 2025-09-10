import { useState } from "react"
import { Camera, MapPin, Star, Eye, Heart, Edit, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrutalButton } from "@/components/ui/brutal-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const availableTags = [
  "Art 🎨", "Coffee ☕", "Hiking 🥾", "Foodie 🍕", "Photography 📸", 
  "Tech 💻", "Music 🎵", "Guitar 🎸", "Travel ✈️", "Yoga 🧘‍♀️", 
  "Mindfulness 🧠", "Nature 🌲", "Cooking 👨‍🍳", "Dogs 🐕", "Design 🎯", 
  "Fitness 💪", "Climbing 🧗‍♂️", "Adventure 🏔️", "Science 🔬"
]

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Emma Martinez",
    age: 28,
    bio: "Passionate about art, coffee, and meaningful conversations. Love exploring new places and trying different cuisines. Looking for someone who shares my curiosity about the world! 🌎",
    location: "Paris, France",
    tags: ["Art 🎨", "Coffee ☕", "Travel ✈️", "Photography 📸"],
    gender: "woman",
    orientation: "straight",
    photos: [
      "/placeholder.svg",
      "/placeholder.svg", 
      "/placeholder.svg"
    ]
  })

  const stats = {
    profileViews: 127,
    likes: 89,
    fameRating: 4.2,
    matches: 23
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated! ✨",
      description: "Your changes have been saved successfully.",
    })
  }

  const toggleTag = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag].slice(0, 8) // Max 8 tags
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">My Profile 👤</h1>
          <p className="text-muted-foreground">
            Manage your profile and privacy settings
          </p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <BrutalButton onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </BrutalButton>
          </div>
        ) : (
          <BrutalButton onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </BrutalButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos Section */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photos ({profile.photos.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                    <img 
                      src={photo} 
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="destructive" size="sm">
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add Photo Placeholder */}
                {isEditing && profile.photos.length < 5 && (
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Add Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle>Basic Information ℹ️</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input 
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="rounded-xl"
                    />
                  ) : (
                    <p className="font-medium">{profile.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Age</Label>
                  <p className="font-medium">{profile.age} years old</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="woman">Woman</SelectItem>
                        <SelectItem value="man">Man</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium capitalize">{profile.gender}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orientation">Sexual Orientation</Label>
                  {isEditing ? (
                    <Select value={profile.orientation} onValueChange={(value) => setProfile(prev => ({ ...prev, orientation: value }))}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="straight">Straight</SelectItem>
                        <SelectItem value="gay">Gay</SelectItem>
                        <SelectItem value="lesbian">Lesbian</SelectItem>
                        <SelectItem value="bisexual">Bisexual</SelectItem>
                        <SelectItem value="pansexual">Pansexual</SelectItem>
                        <SelectItem value="asexual">Asexual</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-medium capitalize">{profile.orientation}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{profile.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea 
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="rounded-xl min-h-[120px]"
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle>Interests & Hobbies 🎯</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Selected: {profile.tags.length}/8
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={profile.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer transition-smooth rounded-full px-4 py-2"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {profile.tags.includes(tag) && (
                          <X className="w-3 h-3 ml-2" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full px-4 py-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle>Profile Stats 📊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Profile Views</span>
                </div>
                <span className="font-bold">{stats.profileViews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Likes Received</span>
                </div>
                <span className="font-bold">{stats.likes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Fame Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{stats.fameRating}</span>
                  <Star className="w-3 h-3 fill-primary text-primary" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">💕</span>
                  <span className="text-sm">Total Matches</span>
                </div>
                <span className="font-bold">{stats.matches}</span>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Safety */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle>Privacy & Safety 🔒</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start rounded-xl">
                🔐 Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl">
                🚫 Blocked Users
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl">
                📍 Location Settings
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl">
                🔔 Notification Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}