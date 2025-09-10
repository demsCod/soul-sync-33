import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Send, ArrowLeft, Phone, Video, Info, Smile, Image, Mic, MoreVertical, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getRandomProfiles, type MockProfile } from "@/data/mockProfiles"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: 'text' | 'image' | 'audio'
  read: boolean
}

interface Match {
  id: string
  user: MockProfile
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  online: boolean
}

export function ChatPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Current user ID (mock)
  const currentUserId = "current-user"

  useEffect(() => {
    // Generate mock matches
    const mockProfiles = getRandomProfiles(8)
    const mockMatches: Match[] = mockProfiles.map(profile => ({
      id: profile.id,
      user: profile,
      lastMessage: [
        "Hey! How's your day going? 😊",
        "That photo from your trip looks amazing!",
        "Coffee later? ☕",
        "Thanks for the like! 💖",
        "You have great taste in music!",
        "Would love to chat more about photography 📸"
      ][Math.floor(Math.random() * 6)],
      lastMessageTime: new Date(Date.now() - Math.random() * 86400000 * 7),
      unreadCount: Math.floor(Math.random() * 5),
      online: Math.random() > 0.5
    }))
    
    setMatches(mockMatches.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()))
    
    // Select match if matchId provided
    if (matchId) {
      const match = mockMatches.find(m => m.id === matchId)
      if (match) {
        setSelectedMatch(match)
        loadMessages(matchId)
      }
    } else if (mockMatches.length > 0) {
      setSelectedMatch(mockMatches[0])
      loadMessages(mockMatches[0].id)
    }
  }, [matchId])

  const loadMessages = (chatId: string) => {
    // Generate mock messages
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "Hey! I saw we matched, how's it going? 😊",
        senderId: chatId,
        timestamp: new Date(Date.now() - 3600000 * 24),
        type: 'text',
        read: true
      },
      {
        id: "2", 
        content: "Hi! Going great, thanks for asking! Love your photos, are you a photographer?",
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 3600000 * 23),
        type: 'text',
        read: true
      },
      {
        id: "3",
        content: "Not professionally, but it's a huge passion of mine! I love capturing moments and emotions 📸",
        senderId: chatId,
        timestamp: new Date(Date.now() - 3600000 * 22),
        type: 'text',
        read: true
      },
      {
        id: "4",
        content: "That's awesome! I'd love to see more of your work. Maybe we could do a photo walk sometime?",
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 3600000 * 21),
        type: 'text',
        read: true
      },
      {
        id: "5",
        content: "I'd really like that! There are some amazing spots around the city I've been wanting to explore 🌟",
        senderId: chatId,
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        read: false
      }
    ]
    setMessages(mockMessages)
    
    // Mark messages as read
    setTimeout(() => {
      setMatches(prev => prev.map(match => 
        match.id === chatId ? { ...match, unreadCount: 0 } : match
      ))
    }, 1000)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedMatch) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      timestamp: new Date(),
      type: 'text',
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Update match last message
    setMatches(prev => prev.map(match => 
      match.id === selectedMatch.id 
        ? { ...match, lastMessage: newMessage, lastMessageTime: new Date() }
        : match
    ))

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      
      const responses = [
        "That sounds great! 😊",
        "I totally agree!",
        "Haha, you're funny! 😄", 
        "Tell me more about that!",
        "That's so interesting! 🤔",
        "I love your perspective on this! ✨"
      ]
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        senderId: selectedMatch.id,
        timestamp: new Date(),
        type: 'text',
        read: false
      }
      
      setMessages(prev => [...prev, response])
    }, 2000 + Math.random() * 3000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return `${Math.floor(diff / 86400000)}d`
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Matches List */}
        <Card className="rounded-3xl border-2 card-shadow overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Messages 💬</h2>
              <Badge variant="secondary" className="rounded-full">
                {matches.reduce((acc, match) => acc + match.unreadCount, 0)} new
              </Badge>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMatch?.id === match.id ? 'bg-muted' : ''
                }`}
                onClick={() => {
                  setSelectedMatch(match)
                  loadMessages(match.id)
                  navigate(`/chat/${match.id}`)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={match.user.images[0]} />
                      <AvatarFallback>{match.user.name[0]}</AvatarFallback>
                    </Avatar>
                    {match.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{match.user.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatLastMessageTime(match.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{match.lastMessage}</p>
                  </div>
                  
                  {match.unreadCount > 0 && (
                    <Badge variant="destructive" className="rounded-full px-2 py-1 text-xs">
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <Card className="rounded-3xl border-2 card-shadow h-full flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden rounded-xl"
                      onClick={() => navigate('/chat')}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedMatch.user.images[0]} />
                        <AvatarFallback>{selectedMatch.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {selectedMatch.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{selectedMatch.user.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedMatch.online ? 'Online now' : `Active ${formatLastMessageTime(selectedMatch.lastMessageTime)} ago`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl"
                      onClick={() => navigate(`/profile/${selectedMatch.id}`)}
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>🔇 Mute notifications</DropdownMenuItem>
                        <DropdownMenuItem>🚫 Block user</DropdownMenuItem>
                        <DropdownMenuItem>🚩 Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">💔 Unmatch</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    } rounded-2xl px-4 py-2`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === currentUserId
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-2 max-w-[70%]">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="rounded-xl flex-shrink-0">
                    <Image className="w-5 h-5" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="rounded-2xl pr-20 border-2"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="rounded-2xl px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="rounded-3xl border-2 card-shadow h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Start a Conversation 💬</h3>
                <p className="text-muted-foreground">
                  Select a match from the list to start chatting!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}