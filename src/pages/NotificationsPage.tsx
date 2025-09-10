import { useState } from "react"
import { Bell, Heart, Eye, MessageCircle, Star, UserCheck, Settings, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrutalButton } from "@/components/ui/brutal-button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  type: 'like' | 'view' | 'message' | 'match' | 'unlike' | 'superlike'
  title: string
  description: string
  time: string
  avatar: string
  username: string
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'match',
    title: 'New Match! 💕',
    description: 'You and Emma both liked each other',
    time: '2 minutes ago',
    avatar: '/placeholder.svg',
    username: 'Emma',
    read: false,
    actionUrl: '/chat/emma'
  },
  {
    id: '2',
    type: 'like',
    title: 'Someone liked you! 💖',
    description: 'Alex liked your profile',
    time: '15 minutes ago',
    avatar: '/placeholder.svg',
    username: 'Alex',
    read: false,
    actionUrl: '/profile/alex'
  },
  {
    id: '3',
    type: 'message',
    title: 'New message 💬',
    description: 'Sarah: "Hey! How was your weekend?"',
    time: '1 hour ago',
    avatar: '/placeholder.svg',
    username: 'Sarah',
    read: true,
    actionUrl: '/chat/sarah'
  },
  {
    id: '4',
    type: 'view',
    title: 'Profile view 👀',
    description: 'Someone viewed your profile',
    time: '2 hours ago',
    avatar: '/placeholder.svg',
    username: 'Anonymous',
    read: true
  },
  {
    id: '5',
    type: 'superlike',
    title: 'Super Like! ⭐',
    description: 'Maya super liked you!',
    time: '3 hours ago',
    avatar: '/placeholder.svg',
    username: 'Maya',
    read: true,
    actionUrl: '/profile/maya'
  },
  {
    id: '6',
    type: 'unlike',
    title: 'Someone unmatched 💔',
    description: 'A match has been removed',
    time: '1 day ago',
    avatar: '/placeholder.svg',
    username: 'Someone',
    read: true
  }
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [settings, setSettings] = useState({
    likes: true,
    matches: true,
    messages: true,
    views: false,
    marketing: false,
    push: true,
    email: true,
    sms: false
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'match':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'view':
        return <Eye className="w-5 h-5 text-green-500" />
      case 'superlike':
        return <Star className="w-5 h-5 text-purple-500 fill-current" />
      case 'unlike':
        return <X className="w-5 h-5 text-gray-500" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'You\'re all caught up! 🎉'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <BrutalButton onClick={markAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </BrutalButton>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">
            All 
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-2 py-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-xl">Activity</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl">Settings</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`rounded-2xl border-2 transition-all cursor-pointer ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  markAsRead(notification.id)
                  if (notification.actionUrl) {
                    // In a real app, navigate to the URL
                    console.log('Navigate to:', notification.actionUrl)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.username[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notification.type)}
                          <h3 className="font-semibold truncate">{notification.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="rounded-xl">
                            View
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="rounded-3xl border-2 card-shadow">
              <CardContent className="py-16 text-center">
                <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">No notifications yet 📭</h3>
                <p className="text-muted-foreground">
                  When people interact with your profile, you'll see notifications here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Summary */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-bold text-2xl">24</h3>
                <p className="text-sm text-muted-foreground">Likes today</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-2xl">87</h3>
                <p className="text-sm text-muted-foreground">Profile views</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold text-2xl">12</h3>
                <p className="text-sm text-muted-foreground">New messages</p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <UserCheck className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold text-2xl">3</h3>
                <p className="text-sm text-muted-foreground">New matches</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle>Recent Activity 📊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="rounded-3xl border-2 card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activity Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold">Activity Notifications 🔔</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="likes" className="font-medium">Likes & Super Likes</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone likes your profile</p>
                  </div>
                  <Switch 
                    id="likes"
                    checked={settings.likes}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, likes: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="matches" className="font-medium">Matches</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new matches</p>
                  </div>
                  <Switch 
                    id="matches"
                    checked={settings.matches}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, matches: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="messages" className="font-medium">Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                  </div>
                  <Switch 
                    id="messages"
                    checked={settings.messages}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, messages: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="views" className="font-medium">Profile Views</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone views your profile</p>
                  </div>
                  <Switch 
                    id="views"
                    checked={settings.views}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, views: checked }))}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Delivery Methods */}
              <div className="space-y-4">
                <h3 className="font-semibold">Delivery Methods 📱</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push" className="font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                  </div>
                  <Switch 
                    id="push"
                    checked={settings.push}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email"
                    checked={settings.email}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms" className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                  </div>
                  <Switch 
                    id="sms"
                    checked={settings.sms}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Marketing */}
              <div className="space-y-4">
                <h3 className="font-semibold">Marketing & Updates 📢</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing" className="font-medium">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                  </div>
                  <Switch 
                    id="marketing"
                    checked={settings.marketing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </div>

              <BrutalButton className="w-full">
                Save Preferences
              </BrutalButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}