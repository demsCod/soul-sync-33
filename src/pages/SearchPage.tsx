import { useState } from "react"
import { Search, Filter, MapPin, Star, Users, Sliders } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BrutalButton } from "@/components/ui/brutal-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ProfileCard } from "@/components/ui/profile-card"
import { getRandomProfiles, type MockProfile } from "@/data/mockProfiles"

const availableTags = [
  "Art 🎨", "Coffee ☕", "Hiking 🥾", "Foodie 🍕", "Photography 📸", 
  "Tech 💻", "Music 🎵", "Guitar 🎸", "Travel ✈️", "Yoga 🧘‍♀️", 
  "Mindfulness 🧠", "Nature 🌲", "Cooking 👨‍🍳", "Dogs 🐕", "Design 🎯"
]

interface SearchFilters {
  ageRange: [number, number]
  distance: number
  fameRange: [number, number] 
  tags: string[]
  location: string
  sortBy: string
}

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<MockProfile[]>(getRandomProfiles(12))
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: [18, 50],
    distance: 100,
    fameRange: [0, 5],
    tags: [],
    location: "",
    sortBy: "distance"
  })

  const handleSearch = () => {
    // In a real app, this would query the backend
    setResults(getRandomProfiles(Math.floor(Math.random() * 15) + 5))
  }

  const handleApplyFilters = () => {
    setResults(getRandomProfiles(Math.floor(Math.random() * 20) + 8))
    setShowFilters(false)
  }

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const clearFilters = () => {
    setFilters({
      ageRange: [18, 50],
      distance: 100,
      fameRange: [0, 5],
      tags: [],
      location: "",
      sortBy: "distance"
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-6">Advanced Search 🔍</h1>
        
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by name, location, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-2xl border-2 text-lg"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <BrutalButton onClick={handleSearch} size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search
          </BrutalButton>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-2xl border-2"
          >
            <Sliders className="w-5 h-5 mr-2" />
            Filters
            {(filters.tags.length > 0 || filters.location) && (
              <Badge variant="destructive" className="ml-2 px-2 py-1">
                {filters.tags.length + (filters.location ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <Card className="lg:col-span-1 rounded-3xl border-2 card-shadow h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filters 🎛️</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Age Range */}
              <div className="space-y-3">
                <Label className="font-semibold">Age Range</Label>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value as [number, number] }))}
                  max={80}
                  min={18}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.ageRange[0]} years</span>
                  <span>{filters.ageRange[1]} years</span>
                </div>
              </div>

              <Separator />

              {/* Distance */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4" />
                  Distance: {filters.distance} km
                </Label>
                <Slider
                  value={[filters.distance]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                  max={500}
                  min={1}
                  step={5}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Fame Rating */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 font-semibold">
                  <Star className="w-4 h-4" />
                  Fame Rating
                </Label>
                <Slider
                  value={filters.fameRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, fameRange: value as [number, number] }))}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{filters.fameRange[0]} ⭐</span>
                  <span>{filters.fameRange[1]} ⭐</span>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-3">
                <Label className="font-semibold">Location</Label>
                <Input
                  placeholder="City, country..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              <Separator />

              {/* Sort By */}
              <div className="space-y-3">
                <Label className="font-semibold">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="fame">Fame Rating</SelectItem>
                    <SelectItem value="activity">Last Active</SelectItem>
                    <SelectItem value="compatibility">Compatibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <Label className="font-semibold">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-smooth rounded-full text-xs"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <BrutalButton onClick={handleApplyFilters} className="w-full">
                Apply Filters
              </BrutalButton>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">{results.length} profiles found</span>
            </div>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Sort by Distance</SelectItem>
                <SelectItem value="age">Sort by Age</SelectItem>
                <SelectItem value="fame">Sort by Fame</SelectItem>
                <SelectItem value="activity">Sort by Activity</SelectItem>
                <SelectItem value="compatibility">Sort by Match %</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  user={profile}
                  variant="grid"
                  className="animate-fade-in"
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-3xl border-2 card-shadow">
              <CardContent className="py-16 text-center">
                <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">No Results Found 🤔</h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search criteria or filters to find more profiles.
                </p>
                <BrutalButton onClick={clearFilters}>
                  Clear All Filters
                </BrutalButton>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}