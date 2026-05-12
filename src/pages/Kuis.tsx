import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const Kuis = () => {
  const navigate = useNavigate();

  const questions: Question[] = [
    {
      question:
        "Topologi jaringan yang semua perangkat terhubung ke satu switch/hub pusat adalah...",
      options: [
        "Topologi Ring",
        "Topologi Star",
        "Topologi Bus",
        "Topologi Mesh"
      ],
      correct: 1
    },
    {
      question:
        "Perangkat yang berfungsi menghubungkan berbagai jaringan dan mengatur lalu lintas data adalah...",
      options: [
        "Hub",
        "Switch",
        "Router",
        "Repeater"
      ],
      correct: 2
    },
    {
      question:
        "Kabel jaringan yang menggunakan cahaya untuk transmisi data adalah...",
      options: [
        "UTP",
        "STP",
        "Fiber Optic",
        "Coaxial"
      ],
      correct: 2
    },
    {
      question: "Format IP Address yang benar adalah...",
      options: [
        "192.168.1",
        "192.168.1.256",
        "192.168.1.100",
        "192.168.1.1.1"
      ],
      correct: 2
    },
    {
      question: "Fungsi dari Subnet Mask adalah...",
      options: [
        "Membagi jaringan menjadi sub-jaringan",
        "Menghubungkan ke internet",
        "Mengenkripsi data",
        "Mempercepat koneksi"
      ],
      correct: 0
    },
    {
      question:
        "Standar pengurutan warna kabel UTP yang paling umum digunakan adalah...",
      options: [
        "T568A",
        "T568B",
        "T568C",
        "T568D"
      ],
      correct: 1
    },
    {
      question:
        "Perangkat yang menghubungkan komputer dalam satu jaringan lokal adalah...",
      options: [
        "Router",
        "Modem",
        "Switch",
        "Gateway"
      ],
      correct: 2
    },
    {
      question:
        "Default Gateway berfungsi sebagai...",
      options: [
        "Alamat server DNS",
        "Pintu gerbang ke jaringan lain/internet",
        "Alamat IP komputer",
        "Nama jaringan"
      ],
      correct: 1
    },
    {
      question:
        "Topologi yang setiap perangkat terhubung ke semua perangkat lainnya disebut...",
      options: [
        "Star",
        "Ring",
        "Mesh",
        "Bus"
      ],
      correct: 2
    },
    {
      question:
        "DNS (Domain Name System) berfungsi untuk...",
      options: [
        "Mengenkripsi data",
        "Menerjemahkan nama domain ke IP address",
        "Mempercepat internet",
        "Memblokir virus"
      ],
      correct: 1
    }
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState<
    (number | null)[]
  >(Array(questions.length).fill(null));

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(parseInt(value));
  };

  const saveCurrentAnswer = () => {
    if (selectedAnswer === null) return answers;

    const updated = [...answers];
    updated[currentQuestion] = selectedAnswer;

    setAnswers(updated);
    return updated;
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Pilih jawaban terlebih dahulu!");
      return;
    }

    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      // reset pilihan biar kosong
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;

      setCurrentQuestion(prevIndex);
      setSelectedAnswer(answers[prevIndex]);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast.error("Pilih jawaban terlebih dahulu!");
      return;
    }

    const finalAnswers = [...answers];
    finalAnswers[currentQuestion] = selectedAnswer;

    const allAnswered = finalAnswers.every(
      (answer) => answer !== null
    );

    if (!allAnswered) {
      toast.error(
        "Jawab semua pertanyaan terlebih dahulu!"
      );
      return;
    }

    const score = finalAnswers.reduce(
      (total, answer, index) => {
        return total +
          (answer === questions[index].correct
            ? 10
            : 0);
      },
      0
    );

    localStorage.setItem(
      "quizScore",
      score.toString()
    );

    toast.success("Kuis selesai! Melihat hasil...");

    setTimeout(() => {
      navigate("/hasil");
    }, 800);
  };

  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Kuis Evaluasi
            </h1>

            <p className="text-muted-foreground text-lg">
              Uji pemahamanmu tentang materi
              Jaringan Komputer
            </p>
          </div>

          <Card className="p-6 mb-6 shadow-medium border-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  Pertanyaan {currentQuestion + 1} dari{" "}
                  {questions.length}
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                Progress: {Math.round(progress)}%
              </span>
            </div>

            <Progress
              value={progress}
              className="h-2"
            />
          </Card>

          <Card className="p-8 shadow-large border-2 animate-scale-in">
            <div className="mb-8">
              <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Pertanyaan {currentQuestion + 1}
              </div>

              <h2 className="text-2xl font-semibold leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
            </div>

            <RadioGroup
              value={
                selectedAnswer !== null
                  ? selectedAnswer.toString()
                  : undefined
              }
              onValueChange={handleAnswerSelect}
            >
              <div className="space-y-4">
                {questions[currentQuestion].options.map(
                  (option, index) => (
                    <div
                      key={index}
                      className="group"
                    >
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-smooth cursor-pointer hover:border-primary hover:bg-primary/5 ${
                          selectedAnswer === index
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                        />

                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-base leading-relaxed"
                        >
                          {option}
                        </Label>
                      </div>
                    </div>
                  )
                )}
              </div>
            </RadioGroup>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>

              {currentQuestion <
              questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 shadow-medium"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 gradient-accent shadow-medium"
                >
                  Selesai & Lihat Hasil
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Kuis;