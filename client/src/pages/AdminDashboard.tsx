
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
  Upload, 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  BarChart3,
  LogOut,
  Save
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
  videoUrl?: string;
  pdfUrl?: string;
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
      const method = lessonData.id ? 'PUT' : 'POST';
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
      toast({ title: "Lesson saved successfully" });
    }
  });

  const handleSignOut = async () => {
    await logout();
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

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lessonData = {
      id: selectedLesson?.id,
      moduleId: parseInt(formData.get('moduleId') as string),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      videoUrl: formData.get('videoUrl') as string,
      pdfUrl: formData.get('pdfUrl') as string,
      duration: formData.get('duration') as string,
      order: parseInt(formData.get('order') as string),
      isPublished: formData.get('isPublished') === 'on'
    };
    lessonUpsertMutation.mutate(lessonData);
  };

  const handleFileUpload = async (file: File, type: 'video' | 'pdf') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      toast({ title: `${type} uploaded successfully`, description: data.url });
      return data.url;
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
      throw error;
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
            <TabsTrigger value="content">Content</TabsTrigger>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="videoUrl">Video URL</Label>
                        <Input
                          id="videoUrl"
                          name="videoUrl"
                          type="url"
                          defaultValue={selectedLesson?.videoUrl}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pdfUrl">PDF URL</Label>
                        <Input
                          id="pdfUrl"
                          name="pdfUrl"
                          type="url"
                          defaultValue={selectedLesson?.pdfUrl}
                        />
                      </div>
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
                    <Button type="submit" className="w-full bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black">
                      <Save className="w-4 h-4 mr-2" />
                      Save Lesson
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
                <CardTitle>File Upload</CardTitle>
                <CardDescription>Upload videos and PDFs for your lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="video-upload">Video Upload</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-400 mb-4">
                        Drag and drop your video files here, or click to browse
                      </p>
                      <input
                        type="file"
                        id="video-upload"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'video');
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('video-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="pdf-upload">PDF Upload</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-400 mb-4">
                        Drag and drop your PDF files here, or click to browse
                      </p>
                      <input
                        type="file"
                        id="pdf-upload"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'pdf');
                        }}
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('pdf-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
