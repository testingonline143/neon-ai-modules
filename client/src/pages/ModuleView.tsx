import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Clock, FileText, Play, CheckCircle, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  order: number;
  isPublished: boolean;
}

export default function ModuleView() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const moduleId = parseInt(id || '0');

  // Fetch module details
  const { data: module, isLoading: moduleLoading } = useQuery({
    queryKey: ['/api/modules', moduleId],
    queryFn: async () => {
      const response = await fetch(`/api/modules/${moduleId}`);
      if (!response.ok) throw new Error('Failed to fetch module');
      return response.json();
    },
    enabled: !!moduleId
  });

  // Fetch lessons for this module
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['/api/lessons', moduleId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${moduleId}`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const lessonData = await response.json();
      return Array.isArray(lessonData) ? lessonData : [];
    },
    enabled: !!moduleId
  });

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLessonClick = (lessonId: number) => {
    navigate(`/lesson/${lessonId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (moduleLoading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#00FFD1] text-xl">Loading module...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Loading module...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#00FFD1] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-white hidden sm:block">AI 99 Course</h1>
                <h1 className="text-lg font-bold text-white sm:hidden">AI Course</h1>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>

            {/* Desktop Logout */}
            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
              <p className="text-gray-400 text-lg mb-4">{module.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen className="w-5 h-5" />
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{module.duration}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Module Progress</span>
                  <span className="text-sm text-gray-400">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-[#00FFD1] text-black px-4 py-2">
              Module {module.order}
            </Badge>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Lessons</h2>
          
          {lessons.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
                <p className="text-gray-400">No lessons available yet</p>
                <p className="text-sm text-gray-500">Check back later for new content</p>
              </CardContent>
            </Card>
          ) : (
            lessons.map((lesson: Lesson, index: number) => (
              <Card 
                key={lesson.id} 
                className="bg-gray-900 border-gray-800 hover:border-[#00FFD1] transition-colors cursor-pointer"
                onClick={() => handleLessonClick(lesson.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-[#00FFD1]">
                          Lesson {index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {lesson.youtubeUrl && (
                            <Badge variant="outline" className="border-red-500 text-red-500">
                              <Play className="w-3 h-3 mr-1" />
                              Video
                            </Badge>
                          )}
                          {lesson.pdfUrl && (
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
                              <FileText className="w-3 h-3 mr-1" />
                              PDF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {lesson.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </div>
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}