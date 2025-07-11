import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Clock, CheckCircle, Trophy, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  completed: boolean;
  progress: number;
}

// We'll fetch modules from the API instead of using hardcoded data

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fetch published modules from the database
  const { data: modules = [] } = useQuery({
    queryKey: ['/api/modules'],
    queryFn: async () => {
      const response = await fetch('/api/modules');
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      // Transform the data to match the expected Module interface
      return data.map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        lessons: module.lessons,
        duration: module.duration,
        completed: false, // TODO: Calculate based on user progress
        progress: 0 // TODO: Calculate based on user progress
      }));
    }
  });
  
  const { data: enrollment } = useQuery({
    queryKey: ['/api/enrollments', currentUser?.uid],
    enabled: !!currentUser,
  });

  // Calculate statistics based on fetched modules
  const completedModules = modules.filter(m => m.completed).length;
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons, 0);
  const completedLessons = modules.reduce((sum, m) => sum + (m.completed ? m.lessons : Math.floor(m.lessons * m.progress / 100)), 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleSignOut = async () => {
    await logout();
  };

  const handleStartModule = (moduleId: number) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00FFD1] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-white">AI 99 Course</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-[#00FFD1] text-[#00FFD1]">
                  Modules
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  Reviews
                </Badge>
                <span className="text-sm text-gray-300">
                  Welcome, {currentUser?.displayName || currentUser?.email}
                </span>
              </div>
              
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
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-[#00FFD1] text-[#00FFD1]">
                    Modules
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    Reviews
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-300">
                  Welcome, {currentUser?.displayName || currentUser?.email}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {currentUser?.displayName || 'Student'}!</h1>
                <p className="text-gray-400">Continue your AI learning journey</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-[#00FFD1] text-black px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              AI Student
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#00FFD1]">{overallProgress}%</div>
                <Progress value={overallProgress} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Modules Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{completedModules}/{modules.length}</div>
                <div className="text-sm text-gray-400">modules</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Lessons Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{completedLessons}/{totalLessons}</div>
                <div className="text-sm text-gray-400">lessons</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Time Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0h</div>
                <div className="text-sm text-gray-400">this week</div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Horizontal Scrollable Layout */}
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              <Card className="bg-gray-900 border-gray-800 flex-shrink-0 w-44 snap-start">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#00FFD1]">{overallProgress}%</div>
                  <Progress value={overallProgress} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 flex-shrink-0 w-44 snap-start">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Modules Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{completedModules}/{modules.length}</div>
                  <div className="text-sm text-gray-400">modules</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 flex-shrink-0 w-44 snap-start">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Lessons Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{completedLessons}/{totalLessons}</div>
                  <div className="text-sm text-gray-400">lessons</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 flex-shrink-0 w-44 snap-start">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">Time Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">0h</div>
                  <div className="text-sm text-gray-400">this week</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Course Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="bg-gray-900 border-gray-800 hover:border-[#00FFD1] transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    {module.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription className="text-gray-400">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {module.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-gray-400">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                  
                  <Button 
                    className="w-full bg-[#00FFD1] hover:bg-[#00FFD1]/90 text-black font-medium"
                    onClick={() => handleStartModule(module.id)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {module.progress > 0 ? 'Continue' : 'Start'} Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}