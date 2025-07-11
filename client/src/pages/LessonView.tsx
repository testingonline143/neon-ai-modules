import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  const lessonId = parseInt(id || '0');

  // Fetch lesson details
  const { data: lesson } = useQuery({
    queryKey: ['/api/admin/lessons', lessonId],
    queryFn: async () => {
      const response = await fetch('/api/admin/lessons');
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const allLessons = await response.json();
      return allLessons.find((l: Lesson) => l.id === lessonId);
    },
    enabled: !!lessonId
  });

  const handleBackToModule = () => {
    if (lesson) {
      navigate(`/module/${lesson.moduleId}`);
    }
  };

  const handleDownloadPDF = () => {
    if (lesson?.pdfUrl) {
      window.open(lesson.pdfUrl, '_blank');
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Loading lesson...</h2>
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
                onClick={handleBackToModule}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Module
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#00FFD1] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-bold text-white">AI 99 Course</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
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
          
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-400 text-lg mb-4">{lesson.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Duration: {lesson.duration}</span>
          </div>
        </div>

        {/* Video Content */}
        {lesson.youtubeUrl && lesson.youtubeVideoId && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Video Lesson
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}`}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Content */}
        {lesson.pdfUrl && (
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  PDF Resource
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <CardDescription>
                {lesson.pdfFileName || 'Lesson material'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p className="text-gray-400 mb-4">
                  PDF document: {lesson.pdfFileName || 'Lesson material'}
                </p>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Open PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Content Message */}
        {!lesson.youtubeUrl && !lesson.pdfUrl && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-gray-400">No content available for this lesson yet</p>
              <p className="text-sm text-gray-500">Check back later for updates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}