
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  Video, 
  BarChart3,
  LogOut,
  Save,
  FileText,
  Upload,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  createdAt: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  order: number;
  isPublished: boolean;
}

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  videoThumbnail?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  order: number;
  duration: string;
  isPublished: boolean;
}

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Fetch modules
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/admin/modules'],
    queryFn: async () => {
      const response = await fetch('/api/admin/modules');
      if (!response.ok) throw new Error('Failed to fetch modules');
      return response.json();
    }
  });

  // Fetch lessons
  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ['/api/admin/lessons'],
    queryFn: async () => {
      const response = await fetch('/api/admin/lessons');
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return response.json();
    }
  });



  // Create/Update module mutation
  const moduleUpsertMutation = useMutation({
    mutationFn: async (moduleData: Partial<Module>) => {
      const url = moduleData.id ? `/api/admin/modules/${moduleData.id}` : '/api/admin/modules';
      const method = moduleData.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      });
      if (!response.ok) throw new Error('Failed to save module');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/modules'] });
      setIsModuleDialogOpen(false);
      setSelectedModule(null);
      toast({ title: "Module saved successfully" });
    }
  });

  // Create/Update lesson mutation
  const lessonUpsertMutation = useMutation({
    mutationFn: async (lessonData: Partial<Lesson>) => {
      const url = lessonData.id ? `/api/admin/lessons/${lessonData.id}` : '/api/admin/lessons';
      const method = lessonData.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData)
      });
      if (!response.ok) throw new Error('Failed to save lesson');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/lessons'] });
      setIsLessonDialogOpen(false);
      setSelectedLesson(null);
      setPdfFile(null);
      toast({ title: "Lesson saved successfully" });
    }
  });

  // PDF upload mutation
  const pdfUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload PDF');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: "PDF uploaded successfully" });
      return data;
    }
  });

  // Delete module mutation
  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleId: number) => {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete module');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/modules'] });
      toast({ title: "Module deleted successfully" });
    }
  });

  const handleSignOut = async () => {
    await logout();
  };

  const handleDeleteModule = (moduleId: number) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      deleteModuleMutation.mutate(moduleId);
    }
  };

  const handleModuleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const moduleData = {
      id: selectedModule?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string),
      isPublished: formData.get('isPublished') === 'on'
    };
    moduleUpsertMutation.mutate(moduleData);
  };

  const handleLessonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const youtubeUrl = formData.get('youtubeUrl') as string;
    
    try {
      let videoData = null;
      let pdfData = null;
      
      // Upload PDF if provided
      if (pdfFile) {
        setUploadingPdf(true);
        pdfData = await pdfUploadMutation.mutateAsync(pdfFile);
        setUploadingPdf(false);
      }
      
      // Validate YouTube URL if provided
      if (youtubeUrl) {
        const response = await fetch('/api/admin/validate-youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: youtubeUrl })
        });
        
        if (!response.ok) {
          const error = await response.json();
          toast({ 
            title: "Invalid YouTube URL", 
            description: error.message,
            variant: "destructive" 
          });
          return;
        }
        
        videoData = await response.json();
      }
      
      const lessonData = {
        id: selectedLesson?.id,
        moduleId: parseInt(formData.get('moduleId') as string),
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        youtubeUrl: youtubeUrl || undefined,
        youtubeVideoId: videoData?.videoId || undefined,
        videoThumbnail: videoData?.thumbnailUrl || undefined,
        pdfUrl: pdfData?.pdfUrl || selectedLesson?.pdfUrl || undefined,
        pdfFileName: pdfData?.pdfFileName || selectedLesson?.pdfFileName || undefined,
        duration: formData.get('duration') as string,
        order: parseInt(formData.get('order') as string),
        isPublished: formData.get('isPublished') === 'on'
      };
      
      lessonUpsertMutation.mutate(lessonData);
    } catch (error) {
      setUploadingPdf(false);
      toast({ 
        title: "Validation failed", 
        description: "Please check your inputs",
        variant: "destructive" 
      });
    }
  };



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00FFD1] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-red-500 text-red-500">
                Admin
              </Badge>
              <span className="text-sm text-gray-300">
                {currentUser?.displayName || currentUser?.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="content">YouTube Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#00FFD1]">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Published Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {modules.filter(m => m.isPublished).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{lessons.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">0</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users and their enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-gray-800">
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Course Modules</h2>
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black"
                    onClick={() => setSelectedModule(null)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedModule ? 'Edit Module' : 'Create New Module'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleModuleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          defaultValue={selectedModule?.title}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 2 hours"
                          defaultValue={selectedModule?.duration}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={selectedModule?.description}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="order">Order</Label>
                        <Input
                          id="order"
                          name="order"
                          type="number"
                          defaultValue={selectedModule?.order}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublished"
                          name="isPublished"
                          defaultChecked={selectedModule?.isPublished}
                          className="rounded"
                        />
                        <Label htmlFor="isPublished">Published</Label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black">
                      <Save className="w-4 h-4 mr-2" />
                      Save Module
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {module.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={module.isPublished ? "default" : "secondary"}>
                          {module.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedModule(module);
                            setIsModuleDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteModule(module.id)}
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Order: {module.order}</span>
                      <span>Duration: {module.duration}</span>
                      <span>Lessons: {module.lessons}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Lessons</h2>
              <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black"
                    onClick={() => setSelectedLesson(null)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedLesson ? 'Edit Lesson' : 'Create New Lesson'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLessonSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="moduleId">Module</Label>
                        <Select name="moduleId" defaultValue={selectedLesson?.moduleId?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                          <SelectContent>
                            {modules.map((module) => (
                              <SelectItem key={module.id} value={module.id.toString()}>
                                {module.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="order">Order</Label>
                        <Input
                          id="order"
                          name="order"
                          type="number"
                          defaultValue={selectedLesson?.order}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={selectedLesson?.title}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={selectedLesson?.description}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtubeUrl">YouTube URL</Label>
                      <Input
                        id="youtubeUrl"
                        name="youtubeUrl"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        defaultValue={selectedLesson?.youtubeUrl}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter any valid YouTube URL. The system will automatically extract the video ID and generate thumbnails.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="pdfUpload">PDF Upload</Label>
                      <div className="space-y-2">
                        <Input
                          id="pdfUpload"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          className="file:bg-[#00FFD1] file:text-black file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
                        />
                        {selectedLesson?.pdfFileName && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FileText className="w-4 h-4" />
                            <span>Current: {selectedLesson.pdfFileName}</span>
                            {selectedLesson.pdfUrl && (
                              <a 
                                href={selectedLesson.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#00FFD1] hover:underline"
                              >
                                <Download className="w-4 h-4 inline" />
                              </a>
                            )}
                          </div>
                        )}
                        {pdfFile && (
                          <div className="flex items-center gap-2 text-sm text-[#00FFD1]">
                            <Upload className="w-4 h-4" />
                            <span>Selected: {pdfFile.name}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a PDF file for this lesson. Maximum size: 100MB
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 15 minutes"
                          defaultValue={selectedLesson?.duration}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublished"
                          name="isPublished"
                          defaultChecked={selectedLesson?.isPublished}
                          className="rounded"
                        />
                        <Label htmlFor="isPublished">Published</Label>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black"
                      disabled={uploadingPdf || lessonUpsertMutation.isPending}
                    >
                      {uploadingPdf ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Uploading PDF...
                        </>
                      ) : lessonUpsertMutation.isPending ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Lesson
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead>Title</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => (
                      <TableRow key={lesson.id} className="border-gray-800">
                        <TableCell>{lesson.title}</TableCell>
                        <TableCell>
                          {modules.find(m => m.id === lesson.moduleId)?.title || 'N/A'}
                        </TableCell>
                        <TableCell>{lesson.order}</TableCell>
                        <TableCell>{lesson.duration}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {lesson.youtubeUrl && (
                              <Badge variant="outline" className="text-red-500 border-red-500">
                                <Video className="w-3 h-3 mr-1" />
                                YouTube
                              </Badge>
                            )}
                            {lesson.pdfUrl && (
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-blue-500 border-blue-500">
                                  <FileText className="w-3 h-3 mr-1" />
                                  PDF
                                </Badge>
                                <a 
                                  href={lesson.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#00FFD1] hover:text-[#00FFD1]/80"
                                >
                                  <Eye className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                            {!lesson.youtubeUrl && !lesson.pdfUrl && (
                              <span className="text-gray-500 text-sm">No content</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lesson.isPublished ? "default" : "secondary"}>
                            {lesson.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsLessonDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage YouTube videos and PDF files for your course lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* PDF Management Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">PDF Files</h3>
                  <p className="text-sm text-gray-400">Upload and manage PDF files for your lessons</p>
                  
                  <div className="grid gap-4">
                    {lessons.filter(lesson => lesson.pdfUrl).map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <h4 className="font-medium text-white">{lesson.title}</h4>
                            <p className="text-sm text-gray-400">
                              {lesson.pdfFileName} • {modules.find(m => m.id === lesson.moduleId)?.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={lesson.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#00FFD1] hover:text-[#00FFD1]/80"
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View PDF
                            </Button>
                          </a>
                          <a 
                            href={lesson.pdfUrl} 
                            download={lesson.pdfFileName}
                            className="text-[#00FFD1] hover:text-[#00FFD1]/80"
                          >
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                    {lessons.filter(lesson => lesson.pdfUrl).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No PDF files uploaded yet</p>
                        <p className="text-sm">Upload PDFs when creating or editing lessons</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6"></div>
                {/* YouTube URL Testing Tool */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">YouTube URL Validator</h3>
                  <p className="text-sm text-gray-400">Test YouTube URLs to ensure they work correctly with the platform</p>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        id="test-youtube-url"
                        placeholder="Paste YouTube URL here to validate..."
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <Button 
                      onClick={async () => {
                        const input = document.getElementById('test-youtube-url') as HTMLInputElement;
                        const url = input?.value;
                        if (!url) {
                          toast({ title: "Please enter a YouTube URL", variant: "destructive" });
                          return;
                        }
                        
                        try {
                          const response = await fetch('/api/admin/validate-youtube', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url })
                          });
                          
                          if (response.ok) {
                            const data = await response.json();
                            toast({ 
                              title: "Valid YouTube URL!", 
                              description: `Video ID: ${data.videoId}`
                            });
                          } else {
                            const error = await response.json();
                            toast({ 
                              title: "Invalid YouTube URL", 
                              description: error.message,
                              variant: "destructive" 
                            });
                          }
                        } catch (error) {
                          toast({ 
                            title: "Validation failed", 
                            description: "Please check your URL format",
                            variant: "destructive" 
                          });
                        }
                      }}
                      className="bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black"
                    >
                      Validate URL
                    </Button>
                  </div>
                </div>

                {/* YouTube Lessons Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Current YouTube Lessons</h3>
                  <div className="grid gap-4">
                    {lessons.filter(lesson => lesson.youtubeUrl).map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                        {/* Video Thumbnail */}
                        {lesson.videoThumbnail && (
                          <img 
                            src={lesson.videoThumbnail} 
                            alt={lesson.title}
                            className="w-24 h-18 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        
                        {/* Lesson Info */}
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{lesson.title}</h4>
                          <p className="text-sm text-gray-400">{lesson.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Module: {modules.find(m => m.id === lesson.moduleId)?.title || 'N/A'}</span>
                            <span>Duration: {lesson.duration}</span>
                            <span>Video ID: {lesson.youtubeVideoId}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          {lesson.youtubeUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(lesson.youtubeUrl, '_blank')}
                              className="text-[#00FFD1] border-[#00FFD1] hover:bg-[#00FFD1] hover:text-black"
                            >
                              View on YouTube
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setIsLessonDialogOpen(true);
                            }}
                            className="text-gray-300 border-gray-600 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {lessons.filter(lesson => lesson.youtubeUrl).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No YouTube videos have been added yet.</p>
                        <p className="text-sm">Add YouTube URLs to your lessons to see them here.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* YouTube Guidelines */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-base">YouTube Integration Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-300">
                    <div>
                      <h4 className="font-medium text-white mb-2">Supported URL Formats:</h4>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
                        <li>• https://youtu.be/VIDEO_ID</li>
                        <li>• https://www.youtube.com/embed/VIDEO_ID</li>
                        <li>• https://www.youtube.com/v/VIDEO_ID</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">Best Practices:</h4>
                      <ul className="space-y-1 text-xs text-gray-400">
                        <li>• Use unlisted videos for course content</li>
                        <li>• Ensure videos are accessible to your target audience</li>
                        <li>• Test URLs before publishing lessons</li>
                        <li>• Keep video thumbnails appropriate for your course theme</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
