import { useState, useEffect, useMemo, useCallback } from 'preact/hooks'
import type { JSX } from 'preact'
import {
  Archive,
  File,
  Forward,
  Inbox,
  Mail,
  MailOpen,
  Plus,
  Reply,
  Search,
  Send,
  Star,
  Trash2,
} from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar'
import { Separator } from '../components/ui/Separator'
import { cn } from '../lib/utils'

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
}

const folders = [
  { id: 'inbox', name: '收件箱', icon: Inbox },
  { id: 'sent', name: '已发送', icon: Send },
  { id: 'draft', name: '草稿箱', icon: File },
  { id: 'archive', name: '归档', icon: Archive },
  { id: 'trash', name: '回收站', icon: Trash2 },
]

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 24) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  if (days < 7) return `${days} 天前`
  return date.toLocaleDateString('zh-CN')
}

export function MessagesView() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedFolder, setSelectedFolder] = useState('inbox')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [starred, setStarred] = useState<Set<string>>(new Set())

  useEffect(() => {
    setTimeout(() => {
      setConversations([
        { id: '1', name: '张三', lastMessage: '好的，我稍后处理', lastMessageTime: '2024-11-28T10:30:00', unreadCount: 2, online: true },
        { id: '2', name: '李四', lastMessage: '项目文档已更新', lastMessageTime: '2024-11-28T09:15:00', unreadCount: 0, online: true },
        { id: '3', name: '王五', lastMessage: '明天开会记得参加', lastMessageTime: '2024-11-27T16:30:00', unreadCount: 0, online: false },
        { id: '4', name: '赵六', lastMessage: '收到，谢谢！', lastMessageTime: '2024-11-27T14:20:00', unreadCount: 0, online: false },
        { id: '5', name: '系统通知', lastMessage: '您有新的系统消息', lastMessageTime: '2024-11-25T10:00:00', unreadCount: 5, online: true },
        { id: '6', name: '钱七', lastMessage: '周末一起吃饭吗？', lastMessageTime: '2024-11-24T18:30:00', unreadCount: 1, online: false },
        { id: '7', name: '孙八', lastMessage: '代码已经提交了', lastMessageTime: '2024-11-23T11:00:00', unreadCount: 0, online: true },
        { id: '8', name: '周九', lastMessage: '请查收附件', lastMessageTime: '2024-11-22T09:45:00', unreadCount: 0, online: false },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversations, searchQuery])

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    // Load messages for this conversation
    setMessages([
      { id: '1', content: '你好，请问有什么需要帮忙的吗？', sender: { id: conv.id, name: conv.name, avatar: conv.avatar }, createdAt: '2024-11-28T10:00:00' },
      { id: '2', content: '我想了解一下项目进度', sender: { id: 'current-user', name: '我', avatar: undefined }, createdAt: '2024-11-28T10:05:00' },
      { id: '3', content: '项目目前进展顺利，预计下周可以完成第一阶段', sender: { id: conv.id, name: conv.name, avatar: conv.avatar }, createdAt: '2024-11-28T10:10:00' },
      { id: '4', content: '好的，那我们下周开个会议讨论一下', sender: { id: 'current-user', name: '我', avatar: undefined }, createdAt: '2024-11-28T10:15:00' },
      { id: '5', content: conv.lastMessage, sender: { id: conv.id, name: conv.name, avatar: conv.avatar }, createdAt: conv.lastMessageTime },
    ])
    // Mark as read
    if (conv.unreadCount > 0) {
      setConversations(prev => prev.map(c =>
        c.id === conv.id ? { ...c, unreadCount: 0 } : c
      ))
    }
  }

  const handleDeleteConversation = useCallback(() => {
    if (!selectedConversation) return
    setConversations(prev => prev.filter(c => c.id !== selectedConversation.id))
    setSelectedConversation(null)
    setMessages([])
  }, [selectedConversation])

  const toggleStar = (id: string) => {
    setStarred(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    const now = new Date().toISOString()
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      sender: { id: 'current-user', name: '我', avatar: undefined },
      createdAt: now
    }])
    setConversations(prev => prev.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMessage, lastMessageTime: now }
        : c
    ))
    setNewMessage('')
  }

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const folderCounts = {
    inbox: conversations.length,
    sent: 0,
    draft: 0,
    archive: 0,
    trash: 0,
  }

  return (
    <AdminLayout>
      <div class="space-y-6">
        {/* 页面标题 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">消息中心</h1>
          </div>
          <Button>
            <Plus class="mr-2 h-4 w-4" />
            写消息
          </Button>
        </div>

        <div class="grid gap-6 lg:grid-cols-12">
          {/* 文件夹列表 */}
          <div class="lg:col-span-2">
            <Card>
              <CardContent class="p-2">
                <nav class="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      class={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                        selectedFolder === folder.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div class="flex items-center gap-2">
                        <folder.icon class="h-4 w-4" />
                        {folder.name}
                      </div>
                      {folderCounts[folder.id as keyof typeof folderCounts] > 0 && (
                        <Badge
                          variant={selectedFolder === folder.id ? 'secondary' : 'default'}
                          class="h-5 min-w-5 px-1.5"
                        >
                          {folderCounts[folder.id as keyof typeof folderCounts]}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 消息列表 */}
          <div class="lg:col-span-4">
            <Card class="h-[calc(100vh-220px)]">
              <CardHeader class="pb-3">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                  <Input
                    placeholder="搜索消息..."
                    value={searchQuery}
                    onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                    class="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent class="p-0">
                <div class="h-[calc(100vh-320px)] overflow-y-auto">
                  {loading ? (
                    <div class="flex items-center justify-center py-12">
                      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        class={cn(
                          'flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50',
                          conv.unreadCount > 0 && 'bg-muted/30',
                          selectedConversation?.id === conv.id && 'bg-muted'
                        )}
                      >
                        <div class="relative">
                          <Avatar class="h-10 w-10">
                            <AvatarImage src={conv.avatar} />
                            <AvatarFallback>{conv.name[0]}</AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                        </div>
                        <div class="flex-1 overflow-hidden">
                          <div class="flex items-center justify-between">
                            <span class={cn('font-medium', conv.unreadCount > 0 && 'font-semibold')}>
                              {conv.name}
                            </span>
                            <span class="text-xs text-muted-foreground">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          <p class={cn('text-sm truncate', conv.unreadCount > 0 && 'font-medium')}>
                            {conv.lastMessage}
                          </p>
                          <div class="flex items-center gap-2 mt-1">
                            {starred.has(conv.id) && (
                              <Star class="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            )}
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" class="h-4 min-w-4 px-1 text-xs">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {!loading && filteredConversations.length === 0 && (
                    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Mail class="h-12 w-12 mb-4" />
                      <p>暂无消息</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 消息详情 */}
          <div class="lg:col-span-6">
            <Card class="h-[calc(100vh-220px)]">
              {selectedConversation ? (
                <div class="flex flex-col h-full">
                  <CardHeader class="pb-3 shrink-0">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <Avatar class="h-10 w-10">
                          <AvatarImage src={selectedConversation.avatar} />
                          <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle class="text-lg">{selectedConversation.name}</CardTitle>
                          <p class="text-xs text-muted-foreground">
                            {selectedConversation.online ? '在线' : '离线'}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(selectedConversation.id)}
                          title="收藏"
                        >
                          <Star
                            class={cn(
                              'h-4 w-4',
                              starred.has(selectedConversation.id) && 'fill-yellow-500 text-yellow-500'
                            )}
                          />
                        </Button>
                        <Button variant="ghost" size="sm" title="回复">
                          <Reply class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="转发">
                          <Forward class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="归档">
                          <Archive class="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDeleteConversation}
                          title="删除"
                        >
                          <Trash2 class="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator class="shrink-0" />
                  <div class="flex-1 min-h-0 overflow-hidden">
                    <div class="h-full overflow-y-auto">
                      <div class="space-y-4 p-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            class={cn(
                              'flex gap-3',
                              message.sender.id === 'current-user' && 'flex-row-reverse'
                            )}
                          >
                            <Avatar class="h-8 w-8 shrink-0">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                            </Avatar>
                            <div
                              class={cn(
                                'max-w-[70%] rounded-lg p-3',
                                message.sender.id === 'current-user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              )}
                            >
                              <p class="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              <p class="text-xs opacity-70 mt-1">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div class="shrink-0 p-4 pt-2 border-t">
                    <div class="flex gap-2">
                      <Input
                        placeholder="输入消息..."
                        value={newMessage}
                        onInput={(e) => setNewMessage((e.target as HTMLInputElement).value)}
                        onKeyDown={handleKeyDown}
                        class="flex-1"
                      />
                      <Button onClick={sendMessage}>
                        <Send class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MailOpen class="h-16 w-16 mb-4" />
                  <p>选择一条消息查看详情</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default MessagesView
