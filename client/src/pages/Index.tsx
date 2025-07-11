import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download, Star, Users, Clock, CheckCircle, LogOut, Menu, X } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const courseModules = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    description: "Understand the fundamentals of AI, its history, and real-world applications",
    duration: "45 mins",
    lessons: 6,
    type: "video"
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    description: "Dive into supervised and unsupervised learning algorithms",
    duration: "60 mins",
    lessons: 8,
    type: "video"
  },
  {
    id: 3,
    title: "Neural Networks & Deep Learning",
    description: "Explore the building blocks of modern AI systems",
    duration: "75 mins",
    lessons: 10,
    type: "video"
  },
  {
    id: 4,
    title: "Natural Language Processing",
    description: "Learn how AI understands and processes human language",
    duration: "50 mins",
    lessons: 7,
    type: "video"
  },
  {
    id: 5,
    title: "Computer Vision Fundamentals",
    description: "Discover how machines see and interpret visual data",
    duration: "55 mins",
    lessons: 8,
    type: "video"
  },
  {
    id: 6,
    title: "AI Ethics & Future Trends",
    description: "Understand responsible AI development and emerging technologies",
    duration: "40 mins",
    lessons: 5,
    type: "video"
  }
];

const features = [
  { icon: BookOpen, text: "6 Comprehensive Modules" },
  { icon: Play, text: "44+ Video Lessons" },
  { icon: Download, text: "Downloadable Resources" },
  { icon: CheckCircle, text: "Lifetime Access" }
];

const testimonials = [
  {
    name: "Arjun Kumar",
    role: "Computer Science Student",
    content: "Best AI course for beginners! The explanations are crystal clear and the price is unbeatable.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    content: "Finally understood machine learning concepts. Worth every rupee!",
    rating: 5
  },
  {
    name: "Rohit Patel",
    role: "Engineering Graduate",
    content: "Perfect stepping stone into AI field. Highly recommended for students.",
    rating: 5
  }
];

const Index = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleEnrollClick = () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in the course.",
      });
      return;
    }
    // This will be connected to payment integration later
    console.log("Enrolling in course...");
    toast({
      title: "Redirecting to payment",
      description: "You'll be redirected to complete your enrollment.",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AI 99 Course</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#modules" className="text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {currentUser.displayName || currentUser.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <AuthModal>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </AuthModal>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a 
                href="#modules" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Modules
              </a>
              <a 
                href="#testimonials" 
                className="block text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </a>
              {currentUser ? (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Welcome, {currentUser.displayName || currentUser.email}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <AuthModal>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </AuthModal>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-gradient-primary text-primary-foreground font-medium px-4 py-2">
            Limited Time Offer
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">Master AI in Just </span>
            <span className="text-primary font-extrabold"> ₹99</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Comprehensive AI course designed for students. Learn machine learning, neural networks, 
            and cutting-edge AI technologies with hands-on projects and real-world applications.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="w-5 h-5 text-primary" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              variant="hero" 
              size="lg"
              onClick={handleEnrollClick}
              className="min-w-[200px]"
            >
              Enroll Now for ₹99
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>2,500+ students enrolled</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            💳 Secure payment • 📚 Instant access • 🎓 Certificate included
          </p>
        </div>
      </section>

      {/* Course Modules */}
      <section id="modules" className="py-20 px-4 bg-gradient-glow">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Course Modules</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six comprehensive modules covering everything from AI basics to advanced concepts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModules.map((module) => (
              <Card key={module.id} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Module {module.id}
                    </Badge>
                    <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.lessons} lessons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who've transformed their AI knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-glow">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students learning AI at the most affordable price
          </p>
          
          <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-card">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">₹99</div>
              <div className="text-muted-foreground mb-4">One-time payment • Lifetime access</div>
              
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleEnrollClick}
                className="mb-6"
              >
                Enroll Now
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ 6 comprehensive modules</p>
                <p>✅ 44+ video lessons</p>
                <p>✅ Downloadable resources</p>
                <p>✅ Certificate of completion</p>
                <p>✅ Lifetime access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold">AI 99 Course</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Affordable AI education for every student
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 AI 99 Course. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;
