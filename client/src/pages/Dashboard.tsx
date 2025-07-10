import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Clock, CheckCircle, Trophy, User, LogOut } from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  completed: boolean;
  progress: number;
}

const modules: Module[] = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Fundamentals of artificial intelligence and machine learning",
    lessons: 8,
    duration: "2 hours",
    completed: false,
    progress: 0
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    description: "Core concepts of supervised and unsupervised learning",
    lessons: 12,
    duration: "3 hours",
    completed: false,
    progress: 0
  },
  {
    id: 3,
    title: "Neural Networks",
    description: "Deep dive into neural network architectures",
    lessons: 10,
    duration: "2.5 hours",
    completed: false,
    progress: 0
  },
  {
    id: 4,
    title: "Deep Learning",
    description: "Advanced deep learning techniques and applications",
    lessons: 15,
    duration: "4 hours",
    completed: false,
    progress: 0
  },
  {
    id: 5,
    title: "Natural Language Processing",
    description: "Text processing and language understanding with AI",
    lessons: 9,
    duration: "2.5 hours",
    completed: false,
    progress: 0
  },
  {
    id: 6,
    title: "AI in Practice",
    description: "Real-world applications and project implementations",
    lessons: 11,
    duration: "3.5 hours",
    completed: false,
    progress: 0
  }
];

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  
  const { data: enrollment } = useQuery({
    queryKey: ['/api/enrollments', currentUser?.uid],
    enabled: !!currentUser,
  });

  const overallProgress = 0; // Calculate from enrollment data
  const completedModules = modules.filter(m => m.completed).length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons, 0);
  const completedLessons = 0; // Calculate from progress

  const handleSignOut = async () => {
    await logout();
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
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-[#00FFD1] text-[#00FFD1]">
                  Modules
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  Reviews
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = "/admin"}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Admin
                </Button>
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
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold text-white">{completedModules}/6</div>
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
                    disabled={module.id > 1 && !modules[module.id - 2].completed}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {module.progress > 0 ? 'Continue' : 'Start'} Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start your first module to see your progress here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No achievements yet</p>
                <p className="text-sm">Complete lessons to earn your first badge</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}