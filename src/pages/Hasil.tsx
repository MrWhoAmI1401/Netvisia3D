import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, RotateCcw, BookOpen, Home } from "lucide-react";
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";

const Hasil = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const savedScore = localStorage.getItem("quizScore");
    if (!savedScore) {
      navigate("/kuis");
      return;
    }

    const finalScore = parseInt(savedScore);
    setScore(finalScore);

    // Animate score counting
    let current = 0;
    const increment = finalScore / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalScore) {
        setAnimatedScore(finalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [navigate]);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", message: "Luar Biasa!", color: "from-green-500 to-emerald-500" };
    if (score >= 80) return { grade: "B", message: "Sangat Baik!", color: "from-blue-500 to-cyan-500" };
    if (score >= 70) return { grade: "C", message: "Baik!", color: "from-yellow-500 to-orange-500" };
    if (score >= 60) return { grade: "D", message: "Cukup", color: "from-orange-500 to-red-500" };
    return { grade: "E", message: "Perlu Perbaikan", color: "from-red-500 to-pink-500" };
  };

  const isPassed = score >= 70;
  const gradeInfo = getGrade(score);

  const achievements = [
    { icon: Trophy, label: "Kuis Selesai", unlocked: true },
    { icon: Star, label: "Skor 70+", unlocked: score >= 70 },
    { icon: Award, label: "Skor 90+", unlocked: score >= 90 },
  ];

  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Results Card */}
          <Card className={`p-8 md:p-12 mb-8 shadow-large border-2 bg-gradient-to-br ${gradeInfo.color} text-white animate-scale-in`}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-pulse-glow">
                <Trophy className="w-10 h-10" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {gradeInfo.message}
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Kamu telah menyelesaikan kuis evaluasi
              </p>

              {/* Score Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                <div className="text-7xl md:text-8xl font-bold mb-4 animate-pulse">
                  {animatedScore}
                </div>
                <div className="text-2xl font-semibold mb-2">Skor Akhir</div>
                <div className="flex items-center justify-center gap-4 text-white/90">
                  <span>Nilai: {gradeInfo.grade}</span>
                  <span>•</span>
                  <span>{isPassed ? "LULUS ✓" : "Belum Lulus"}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{score}%</span>
                </div>
                <Progress value={score} className="h-3 bg-white/20" />
              </div>

              {/* Motivation Message */}
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                {isPassed 
                  ? "Selamat! Kamu telah menguasai materi Jaringan Komputer dengan baik. Terus tingkatkan pemahamanmu!"
                  : "Jangan menyerah! Pelajari kembali materi dan coba lagi. Kamu pasti bisa!"}
              </p>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 mb-6 shadow-medium border-2 animate-fade-in-up">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              Pencapaian
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 text-center transition-smooth ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent"
                        : "bg-muted/50 border-border opacity-50"
                    }`}
                  >
                    <Icon className={`w-10 h-10 mx-auto mb-2 ${
                      achievement.unlocked ? "text-accent" : "text-muted-foreground"
                    }`} />
                    <p className="font-medium">{achievement.label}</p>
                    <Badge variant={achievement.unlocked ? "default" : "secondary"} className="mt-2">
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Performance Details */}
          <Card className="p-6 mb-6 shadow-medium border-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-2xl font-semibold mb-6">Detail Performa</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">{score / 10}</div>
                <div className="text-sm text-muted-foreground">Jawaban Benar</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="text-3xl font-bold text-destructive mb-2">{10 - score / 10}</div>
                <div className="text-sm text-muted-foreground">Jawaban Salah</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">{gradeInfo.grade}</div>
                <div className="text-sm text-muted-foreground">Nilai Huruf</div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/kuis" className="block">
              <Button variant="outline" className="w-full shadow-soft" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Ulangi Kuis
              </Button>
            </Link>
            <Link to="/materi" className="block">
              <Button variant="outline" className="w-full shadow-soft" size="lg">
                <BookOpen className="w-4 h-4 mr-2" />
                Pelajari Materi
              </Button>
            </Link>
            <Link to="/" className="block">
              <Button className="w-full shadow-medium gradient-accent" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hasil;
