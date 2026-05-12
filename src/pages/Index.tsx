import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Box, ClipboardList, Award } from "lucide-react";
import Layout from "@/components/Layout";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Materi Pembelajaran",
      description: "Pelajari konsep dasar jaringan komputer dengan visualisasi 3D yang interaktif dan mudah dipahami",
      path: "/materi",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Box,
      title: "Simulasi 3D",
      description: "Eksplorasi dan praktik langsung dengan objek jaringan komputer dalam lingkungan 3D yang realistis",
      path: "/simulasi",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: ClipboardList,
      title: "Kuis Evaluasi",
      description: "Uji pemahamanmu dengan soal-soal interaktif dan dapatkan feedback langsung",
      path: "/kuis",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in-up">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center animate-float">
                <Box className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Selamat Datang di NetLearn3D
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Media pembelajaran interaktif berbasis 3D untuk memahami Jaringan Komputer dengan cara yang lebih visual, menarik, dan aplikatif
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/materi">
                <Button size="lg" variant="secondary" className="shadow-large hover-lift">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Mulai Belajar
                </Button>
              </Link>
              <Link to="/simulasi">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                  <Box className="w-5 h-5 mr-2" />
                  Coba Simulasi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Pembelajaran</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Jelajahi berbagai fitur interaktif yang dirancang untuk memaksimalkan pengalaman belajarmu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link to={feature.path} key={index}>
                  <Card className="p-6 h-full hover-lift cursor-pointer group shadow-medium border-2">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-12 gradient-card shadow-large border-2">
            <div className="text-center">
              <Award className="w-16 h-16 mx-auto mb-6 text-accent animate-pulse-glow" />
              <h2 className="text-3xl font-bold mb-4">Siap Menguasai Jaringan Komputer?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Mulai perjalanan belajarmu sekarang dan raih pemahaman mendalam tentang teknologi jaringan komputer melalui pengalaman belajar yang interaktif dan menyenangkan
              </p>
              <Link to="/materi">
                <Button size="lg" className="gradient-accent text-accent-foreground shadow-large hover-lift">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
