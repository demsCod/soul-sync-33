import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart, X, MessageCircle, Share2, Flag, Shield, MapPin, Star, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrutalButton } from "@/components/ui/brutal-button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getRandomProfiles, type MockProfile } from "@/data/mockProfiles"
import { toast } from "@/hooks/use-toast"

export function ProfileViewPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<MockProfile | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)

  // Mock user data - in real app this would come from API
  useEffect(() => {
    // Simulate API call
    const mockProfile = getRandomProfiles(1)[0]
    if (mockProfile) {
      setProfile({
        ...mockProfile,
        id: userId || mockProfile.id,
        bio: "Passionate photographer and coffee enthusiast ☕📸 Love capturing life's beautiful moments and exploring hidden gems in the city. Always up for a good conversation about art, travel, and the perfect espresso shot! Looking for someone who appreciates both adventure and cozy nights in. Let's create some amazing memories together! ✨",
        lastSeen: "2 hours ago",
        distance: Math.floor(Math.random() * 50) + 1,
        mutualFriends: Math.floor(Math.random() * 5) + 1,
        verified: Math.random() > 0.3,
        mutualFriends: Math.floor(Math.random() * 5) + 1
      })
    }
  }, [userId])

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === profile.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? profile.images.length - 1 : prev - 1
    )
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Like removed 💔" : "Profile liked! 💖",
      description: isLiked ? 
        "You've unliked this profile" : 
        "Your like has been sent! If they like you back, you'll match.",
    })
  }

  const handleBlock = () => {
    toast({
      title: "User blocked 🚫",
      description: "This user has been blocked and won't appear in your discoveries.",
    })
    navigate("/discover")
  }

  const handleReport = () => {
    setShowReportDialog(false)
    toast({
      title: "Report submitted 📋",
      description: "Thank you for reporting. We'll review this profile carefully.",
    })
  }

  const handleMessage = () => {
    if (isLiked) {
      navigate(`/chat/${profile.id}`)
    } else {
      toast({
        title: "Like first! 💝", 
        description: "You need to like each other to start a conversation."
      })
    }
  }

  const isOnline = profile.isOnline || Math.random() > 0.6

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 rounded-xl"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <Card className="rounded-3xl border-2 card-shadow overflow-hidden">
            <div className="relative aspect-[4/5] bg-muted group">
              <img 
                src={profile.images[currentImageIndex]} 
                alt={`${profile.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {profile.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {profile.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Online Status */}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isOnline ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-gray-300'}`} />
                  {isOnline ? 'Online' : profile.lastSeen}
                </div>
              </div>

              {/* Verification Badge */}
              {(profile as any).verified && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    ✓ Verified
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Profile Details */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardContent className="p-6 space-y-6">
              {/* Name and Age */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-display text-3xl font-bold">{profile.name}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span className="font-semibold">{profile.fame}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    🎂 {profile.age} years old
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.distance} km away
                  </span>
                  {(profile as any).mutualFriends > 0 && (
                    <span className="flex items-center gap-1">
                      👥 {(profile as any).mutualFriends} mutual connections
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-3">About Me 📝</h3>
                <p className="text-sm leading-relaxed">{profile.bio}</p>
              </div>

              <Separator />

              {/* Interests */}
              <div>
                <h3 className="font-semibold mb-3">Interests 🎯</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div>
                <h3 className="font-semibold mb-3">Location 📍</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardContent className="p-6 space-y-4">
              {/* Like/Unlike */}
              <BrutalButton 
                onClick={handleLike}
                variant={isLiked ? "outline" : "hero"}
                className="w-full"
              >
                {isLiked ? (
                  <>
                    <Heart className="w-5 h-5 mr-2 fill-current" />
                    Liked 💖
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Like Profile
                  </>
                )}
              </BrutalButton>

              {/* Message */}
              <Button 
                onClick={handleMessage}
                variant="outline" 
                className="w-full rounded-xl border-2"
                disabled={!isLiked}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {isLiked ? "Send Message" : "Match to Message"}
              </Button>

              {/* Pass */}
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-2"
                onClick={() => navigate("/discover")}
              >
                <X className="w-5 h-5 mr-2" />
                Pass
              </Button>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Profile Stats 📊</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    Profile Views
                  </span>
                  <span className="font-medium">{Math.floor(Math.random() * 200) + 50}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4" />
                    Likes Received
                  </span>
                  <span className="font-medium">{Math.floor(Math.random() * 150) + 30}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    Response Rate
                  </span>
                  <span className="font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Actions */}
          <Card className="rounded-3xl border-2 card-shadow">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Safety & Privacy 🛡️</h3>
              
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl text-muted-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-xl text-orange-600 hover:text-orange-700"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Profile
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report this profile?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will send a report to our moderation team. The user will not be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReport}>
                      Report
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start rounded-xl text-red-600 hover:text-red-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Block User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Block this user?</AlertDialogTitle>
                    <AlertDialogDescription>
                      They won't be able to see your profile or contact you. This action can be undone in your settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBlock} className="bg-red-600 hover:bg-red-700">
                      Block User
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}