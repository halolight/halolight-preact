import { useState, useEffect, useMemo } from 'preact/hooks'
import {
  ChevronRight,
  Clock,
  Download,
  Edit,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileVideo,
  FolderOpen,
  FolderPlus,
  Grid,
  HardDrive,
  Home,
  Info,
  List,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  Upload,
  X,
} from 'lucide-preact'
import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Separator } from '../components/ui/Separator'
import { cn } from '../lib/utils'

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'image' | 'video' | 'audio' | 'archive' | 'document'
  size: number | null
  items?: number | null
  path: string
  mimeType?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

interface StorageInfo {
  used: number
  total: number
  breakdown: {
    images: number
    videos: number
    audio: number
    archives: number
    others: number
  }
}

const typeIcons = {
  folder: FolderOpen,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  archive: FileArchive,
  document: File,
}

const typeColors: Record<string, string> = {
  folder: 'bg-yellow-500/10 text-yellow-600',
  image: 'bg-green-500/10 text-green-600',
  video: 'bg-purple-500/10 text-purple-600',
  audio: 'bg-pink-500/10 text-pink-600',
  archive: 'bg-orange-500/10 text-orange-600',
  document: 'bg-gray-500/10 text-gray-600',
}

const typeLabels: Record<string, string> = {
  folder: '文件夹',
  image: '图片',
  video: '视频',
  audio: '音频',
  archive: '压缩包',
  document: '文档',
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return '-'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatStorageSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024)
  return gb.toFixed(1) + ' GB'
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

export function FilesView() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [storage, setStorage] = useState<StorageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath] = useState<string[]>(['我的文件'])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFiles([
        { id: '1', name: '项目文档', type: 'folder', size: null, items: 12, path: '/我的文件/项目文档', createdAt: '2024-11-20T10:00:00', updatedAt: '2024-11-28T14:30:00' },
        { id: '2', name: '产品设计', type: 'folder', size: null, items: 8, path: '/我的文件/产品设计', createdAt: '2024-11-18T09:00:00', updatedAt: '2024-11-27T16:00:00' },
        { id: '3', name: '团队照片', type: 'folder', size: null, items: 24, path: '/我的文件/团队照片', createdAt: '2024-11-15T11:00:00', updatedAt: '2024-11-25T12:00:00' },
        { id: '4', name: '需求文档.docx', type: 'document', size: 2411724, path: '/我的文件/需求文档.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', createdAt: '2024-11-20T10:00:00', updatedAt: '2024-11-28T14:30:00' },
        { id: '5', name: '设计稿.png', type: 'image', size: 5347737, path: '/我的文件/设计稿.png', mimeType: 'image/png', thumbnail: 'https://picsum.photos/200/150', createdAt: '2024-11-19T09:00:00', updatedAt: '2024-11-27T16:00:00' },
        { id: '6', name: '演示视频.mp4', type: 'video', size: 134217728, path: '/我的文件/演示视频.mp4', mimeType: 'video/mp4', createdAt: '2024-11-18T08:00:00', updatedAt: '2024-11-26T10:00:00' },
        { id: '7', name: '会议录音.mp3', type: 'audio', size: 47185920, path: '/我的文件/会议录音.mp3', mimeType: 'audio/mpeg', createdAt: '2024-11-17T14:00:00', updatedAt: '2024-11-25T15:00:00' },
        { id: '8', name: '数据报表.xlsx', type: 'document', size: 1258291, path: '/我的文件/数据报表.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', createdAt: '2024-11-16T10:00:00', updatedAt: '2024-11-24T11:00:00' },
        { id: '9', name: '备份文件.zip', type: 'archive', size: 268435456, path: '/我的文件/备份文件.zip', mimeType: 'application/zip', createdAt: '2024-11-15T09:00:00', updatedAt: '2024-11-23T10:00:00' },
      ])
      setStorage({
        used: 15 * 1024 * 1024 * 1024,
        total: 100 * 1024 * 1024 * 1024,
        breakdown: {
          images: 3 * 1024 * 1024 * 1024,
          videos: 8 * 1024 * 1024 * 1024,
          audio: 2 * 1024 * 1024 * 1024,
          archives: 1.5 * 1024 * 1024 * 1024,
          others: 0.5 * 1024 * 1024 * 1024,
        },
      })
      setLoading(false)
    }, 1000)
  }, [])

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [files, searchQuery])

  const storageUsed = storage ? storage.used / (1024 * 1024 * 1024) : 0
  const storageTotal = storage ? storage.total / (1024 * 1024 * 1024) : 100

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file)
    if (window.innerWidth < 1024) {
      setShowMobileDetail(true)
    }
  }

  const handleDeleteFile = (id: string, e?: MouseEvent) => {
    e?.stopPropagation()
    setFiles(files.filter((f) => f.id !== id))
    if (selectedFile?.id === id) {
      setSelectedFile(null)
      setShowMobileDetail(false)
    }
  }

  return (
    <AdminLayout>
      <div class="space-y-6">
        {/* 页面标题 */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">文件存储</h1>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline">
              <FolderPlus class="mr-2 h-4 w-4" />
              新建文件夹
            </Button>
            <Button>
              <Upload class="mr-2 h-4 w-4" />
              上传文件
            </Button>
          </div>
        </div>

        {/* 移动端存储信息卡片 */}
        <div class="lg:hidden">
          <Card class="mb-4">
            <CardContent class="p-4">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 rounded-lg bg-primary/10">
                  <HardDrive class="h-5 w-5 text-primary" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium">{storageUsed.toFixed(1)} GB / {storageTotal.toFixed(0)} GB</p>
                  <div class="h-2 rounded-full bg-muted overflow-hidden mt-1">
                    <div
                      class="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {storage && (
                <div class="flex gap-2 flex-wrap">
                  {[
                    { type: 'image', label: '图片', size: formatStorageSize(storage.breakdown.images), color: 'bg-green-500' },
                    { type: 'video', label: '视频', size: formatStorageSize(storage.breakdown.videos), color: 'bg-purple-500' },
                    { type: 'audio', label: '音频', size: formatStorageSize(storage.breakdown.audio), color: 'bg-pink-500' },
                  ].map((item) => (
                    <div key={item.type} class="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <div class={cn('h-1.5 w-1.5 rounded-full', item.color)} />
                      <span class="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div class="grid gap-6 lg:grid-cols-12">
          {/* 桌面端存储信息 */}
          <div class="hidden lg:block lg:col-span-2 space-y-4">
            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-base">存储空间</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-primary/10">
                    <HardDrive class="h-5 w-5 text-primary" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium">{storageUsed.toFixed(1)} GB</p>
                    <p class="text-xs text-muted-foreground">共 {storageTotal.toFixed(0)} GB</p>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                    />
                  </div>
                  <p class="text-xs text-muted-foreground text-right">
                    {((storageUsed / storageTotal) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader class="pb-2">
                <CardTitle class="text-base">文件类型</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2">
                {storage && [
                  { type: 'image', label: '图片', size: formatStorageSize(storage.breakdown.images), color: 'bg-green-500' },
                  { type: 'video', label: '视频', size: formatStorageSize(storage.breakdown.videos), color: 'bg-purple-500' },
                  { type: 'audio', label: '音频', size: formatStorageSize(storage.breakdown.audio), color: 'bg-pink-500' },
                  { type: 'archive', label: '压缩包', size: formatStorageSize(storage.breakdown.archives), color: 'bg-orange-500' },
                  { type: 'other', label: '其他', size: formatStorageSize(storage.breakdown.others), color: 'bg-gray-500' },
                ].map((item) => (
                  <div key={item.type} class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-2">
                      <div class={cn('h-2 w-2 rounded-full', item.color)} />
                      <span class="text-xs">{item.label}</span>
                    </div>
                    <span class="text-xs text-muted-foreground">{item.size}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 文件列表 */}
          <div
            class={cn(
              'transition-all duration-300 col-span-12',
              selectedFile ? 'lg:col-span-6' : 'lg:col-span-10'
            )}
          >
            <Card class="h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)]">
              <CardHeader class="pb-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* 面包屑导航 */}
                  <div class="flex items-center gap-1 text-sm min-w-0 flex-1">
                    <Button variant="ghost" size="sm" class="h-8 px-2 flex-shrink-0">
                      <Home class="h-4 w-4" />
                    </Button>
                    <div class="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto">
                      {currentPath.map((path, index) => (
                        <div key={index} class="flex items-center">
                          <ChevronRight class="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Button variant="ghost" size="sm" class="h-8 px-2 whitespace-nowrap flex-shrink-0">
                            {path}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="relative">
                      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="搜索文件..."
                        value={searchQuery}
                        onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                        class="pl-10 w-32 sm:w-48"
                      />
                    </div>
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      class="hidden sm:flex"
                    >
                      <Grid class="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      class="hidden sm:flex"
                    >
                      <List class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="p-0">
                <div class="h-[calc(100vh-340px)] overflow-y-auto">
                  {loading ? (
                    <div class="flex items-center justify-center py-12">
                      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredFiles.map((file) => {
                        const Icon = typeIcons[file.type] || File
                        return (
                          <div
                            key={file.id}
                            onClick={() => handleSelectFile(file)}
                            class={cn(
                              'group relative rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer',
                              selectedFile?.id === file.id && 'ring-2 ring-primary'
                            )}
                          >
                            <div class="flex flex-col items-center text-center">
                              <div class={cn('p-3 rounded-xl mb-2', typeColors[file.type] || typeColors.document)}>
                                <Icon class="h-7 w-7" />
                              </div>
                              <p class="font-medium text-sm truncate w-full">{file.name}</p>
                              <p class="text-xs text-muted-foreground mt-1">
                                {file.type === 'folder' ? `${file.items} 项` : formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              class="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal class="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div class="divide-y">
                      {filteredFiles.map((file) => {
                        const Icon = typeIcons[file.type] || File
                        return (
                          <div
                            key={file.id}
                            onClick={() => handleSelectFile(file)}
                            class={cn(
                              'flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer',
                              selectedFile?.id === file.id && 'bg-muted'
                            )}
                          >
                            <div class="flex items-center gap-3 min-w-0 flex-1">
                              <div class={cn('p-2 rounded-lg shrink-0', typeColors[file.type] || typeColors.document)}>
                                <Icon class="h-4 w-4" />
                              </div>
                              <div class="min-w-0 flex-1">
                                <p class="font-medium text-sm truncate">{file.name}</p>
                                <p class="text-xs text-muted-foreground truncate">
                                  {file.updatedAt}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center gap-4 shrink-0 ml-2">
                              <span class="text-sm text-muted-foreground">
                                {file.type === 'folder' ? `${file.items} 项` : formatFileSize(file.size)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-7 w-7"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {!loading && filteredFiles.length === 0 && (
                    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FolderOpen class="h-12 w-12 mb-4" />
                      <p>此文件夹为空</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 桌面端文件详情面板 */}
          {selectedFile && (
            <div class="hidden lg:block lg:col-span-4">
              <Card class="h-[calc(100vh-220px)]">
                <CardHeader class="pb-3">
                  <div class="flex items-center justify-between">
                    <CardTitle class="text-base flex items-center gap-2">
                      <Info class="h-4 w-4" />
                      文件详情
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <div class="h-[calc(100vh-320px)] overflow-y-auto">
                  <CardContent class="pt-4 space-y-6">
                    {/* 文件图标和名称 */}
                    <div class="flex flex-col items-center text-center">
                      {(() => {
                        const Icon = typeIcons[selectedFile.type] || File
                        return (
                          <div class={cn('p-4 rounded-xl mb-3', typeColors[selectedFile.type] || typeColors.document)}>
                            <Icon class="h-12 w-12" />
                          </div>
                        )
                      })()}
                      <h3 class="font-semibold text-lg break-all">{selectedFile.name}</h3>
                      <Badge variant="secondary" class="mt-2">
                        {typeLabels[selectedFile.type] || '文件'}
                      </Badge>
                    </div>

                    {/* 操作按钮 */}
                    <div class="flex justify-center gap-2">
                      {selectedFile.type !== 'folder' && (
                        <Button variant="outline" size="sm">
                          <Download class="mr-2 h-4 w-4" />
                          下载
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Share2 class="mr-2 h-4 w-4" />
                        分享
                      </Button>
                      {selectedFile.type === 'folder' && (
                        <Button variant="outline" size="sm">
                          <FolderOpen class="mr-2 h-4 w-4" />
                          打开
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* 文件信息 */}
                    <div class="space-y-4">
                      <h4 class="text-sm font-medium">文件信息</h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex items-center justify-between">
                          <span class="text-muted-foreground">类型</span>
                          <span>{typeLabels[selectedFile.type] || '未知'}</span>
                        </div>
                        {selectedFile.type !== 'folder' && (
                          <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">大小</span>
                            <span>{formatFileSize(selectedFile.size)}</span>
                          </div>
                        )}
                        {selectedFile.type === 'folder' && selectedFile.items !== null && (
                          <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">包含</span>
                            <span>{selectedFile.items} 项</span>
                          </div>
                        )}
                        <div class="flex items-center justify-between">
                          <span class="text-muted-foreground">位置</span>
                          <span class="truncate max-w-[150px]">{selectedFile.path}</span>
                        </div>
                        {selectedFile.mimeType && selectedFile.mimeType !== 'folder' && (
                          <div class="flex items-center justify-between">
                            <span class="text-muted-foreground">MIME类型</span>
                            <span class="text-xs truncate max-w-[150px]">{selectedFile.mimeType}</span>
                          </div>
                        )}
                        <div class="flex items-center justify-between">
                          <span class="text-muted-foreground">创建时间</span>
                          <span class="flex items-center gap-1 text-xs">
                            <Clock class="h-3 w-3" />
                            {formatDateTime(selectedFile.createdAt)}
                          </span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-muted-foreground">修改时间</span>
                          <span class="text-xs">{formatDateTime(selectedFile.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* 缩略图预览 */}
                    {selectedFile.thumbnail && (
                      <>
                        <Separator />
                        <div class="space-y-3">
                          <h4 class="text-sm font-medium">预览</h4>
                          <div class="relative overflow-hidden rounded-lg border">
                            <img
                              src={selectedFile.thumbnail}
                              alt={selectedFile.name}
                              class="h-auto w-full object-cover"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* 危险操作 */}
                    <div class="space-y-3">
                      <h4 class="text-sm font-medium text-destructive">危险操作</h4>
                      <div class="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit class="mr-2 h-4 w-4" />
                          重命名
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => handleDeleteFile(selectedFile.id, e)}
                        >
                          <Trash2 class="mr-2 h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* 移动端文件详情抽屉 */}
        {showMobileDetail && selectedFile && (
          <>
            {/* 遮罩层 */}
            <div
              class="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileDetail(false)}
            />

            {/* 详情抽屉 */}
            <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-2xl bg-background">
              <div class="flex items-center justify-between p-4 border-b">
                <h3 class="font-semibold">文件详情</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8"
                  onClick={() => setShowMobileDetail(false)}
                >
                  <X class="h-4 w-4" />
                </Button>
              </div>
              <div class="h-[calc(80vh-60px)] overflow-y-auto">
                <div class="p-4 space-y-6">
                  {/* 文件图标和名称 */}
                  <div class="flex flex-col items-center text-center">
                    {(() => {
                      const Icon = typeIcons[selectedFile.type] || File
                      return (
                        <div class={cn('p-4 rounded-xl mb-3', typeColors[selectedFile.type] || typeColors.document)}>
                          <Icon class="h-12 w-12" />
                        </div>
                      )
                    })()}
                    <h3 class="font-semibold text-lg break-all">{selectedFile.name}</h3>
                    <Badge variant="secondary" class="mt-2">
                      {typeLabels[selectedFile.type] || '文件'}
                    </Badge>
                  </div>

                  {/* 操作按钮 */}
                  <div class="flex justify-center gap-2 flex-wrap">
                    {selectedFile.type !== 'folder' && (
                      <Button variant="outline" size="sm">
                        <Download class="mr-2 h-4 w-4" />
                        下载
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Share2 class="mr-2 h-4 w-4" />
                      分享
                    </Button>
                    {selectedFile.type === 'folder' && (
                      <Button variant="outline" size="sm">
                        <FolderOpen class="mr-2 h-4 w-4" />
                        打开
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* 文件信息 */}
                  <div class="space-y-4">
                    <h4 class="text-sm font-medium">文件信息</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div class="space-y-1">
                        <span class="text-muted-foreground">类型</span>
                        <div>{typeLabels[selectedFile.type] || '未知'}</div>
                      </div>
                      {selectedFile.type !== 'folder' && (
                        <div class="space-y-1">
                          <span class="text-muted-foreground">大小</span>
                          <div>{formatFileSize(selectedFile.size)}</div>
                        </div>
                      )}
                      {selectedFile.type === 'folder' && selectedFile.items !== null && (
                        <div class="space-y-1">
                          <span class="text-muted-foreground">包含</span>
                          <div>{selectedFile.items} 项</div>
                        </div>
                      )}
                      <div class="space-y-1 col-span-2">
                        <span class="text-muted-foreground">位置</span>
                        <div class="truncate text-xs">{selectedFile.path}</div>
                      </div>
                      <div class="space-y-1">
                        <span class="text-muted-foreground">创建时间</span>
                        <div class="flex items-center gap-1">
                          <Clock class="h-3 w-3" />
                          <span class="text-xs">{formatDateTime(selectedFile.createdAt)}</span>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <span class="text-muted-foreground">修改时间</span>
                        <div class="text-xs">{formatDateTime(selectedFile.updatedAt)}</div>
                      </div>
                    </div>
                  </div>

                  {/* 缩略图预览 */}
                  {selectedFile.thumbnail && (
                    <>
                      <Separator />
                      <div class="space-y-3">
                        <h4 class="text-sm font-medium">预览</h4>
                        <div class="relative overflow-hidden rounded-lg border">
                          <img
                            src={selectedFile.thumbnail}
                            alt={selectedFile.name}
                            class="h-auto w-full object-cover"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* 危险操作 */}
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-destructive">危险操作</h4>
                    <div class="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit class="mr-2 h-4 w-4" />
                        重命名
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDeleteFile(selectedFile.id, e)}
                      >
                        <Trash2 class="mr-2 h-4 w-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default FilesView
