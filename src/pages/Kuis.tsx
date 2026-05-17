import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, ChevronRight, ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

// Interface tipe data untuk soal
interface Question {
  question: string;
  options: string[];
  correct: number;
}

const Kuis = () => {
  const navigate = useNavigate();

  // Data kuis disesuaikan 100% dengan materi Buku Informatika SMA Kelas XI Bab 4
  const questions: Question[] = [
    {
      question: "Topologi jaringan di mana setiap node terkoneksi melalui node konektor pusat (tengah) dan sangat mudah dimodifikasi tanpa mematikan jaringan lain disebut...",
      options: [
        "Topologi Bus",
        "Topologi Star (Bintang)",
        "Topologi Ring (Cincin)",
        "Topologi Mesh"
      ],
      correct: 1
    },
    {
      question: "Pada topologi Ring (Cincin), pengiriman data diatur dengan sebuah prinsip spesifik. Prinsip apakah yang digunakan untuk menunjukkan node mana yang dapat mengirim data?",
      options: [
        "Packet Switching",
        "Error Checking",
        "Token Passing",
        "Circuit Switching"
      ],
      correct: 2
    },
    {
      question: "Dalam Model Jaringan OSI (Open System Interconnection), lapisan yang bertanggung jawab untuk pengalamatan host pengirim dan penerima secara unik pada jaringan (seperti IP Address) adalah...",
      options: [
        "Data Link Layer",
        "Application Layer",
        "Transport Layer",
        "Network Layer"
      ],
      correct: 3
    },
    {
      question: "Protokol HTTP, FTP, dan DNS berinteraksi langsung dengan pengguna aplikasi. Protokol-protokol ini berada pada layer OSI yang mana?",
      options: [
        "Session Layer",
        "Application Layer",
        "Presentation Layer",
        "Physical Layer"
      ],
      correct: 1
    },
    {
      question: "Struktur dari sebuah paket data terdiri dari tiga bagian penting. Bagian manakah yang bertugas memuat alamat IP pengirim dan IP penerima?",
      options: [
        "Packet Header",
        "Packet Payload",
        "Packet Trailer",
        "Packet Switch"
      ],
      correct: 0
    },
    {
      question: "Manakah pernyataan yang TIDAK TEPAT mengenai metode pengiriman data menggunakan Packet Switching?",
      options: [
        "Paket data dapat dikirim tanpa jalur khusus (dedicated channel).",
        "Sangat ideal dan bebas jeda (delay) untuk pengiriman data berkualitas tinggi seperti voice call.",
        "Router dapat melakukan pengiriman ulang (rerouting) jika ada jalur yang sibuk.",
        "Setiap paket bisa melewati jalur independen yang berbeda-beda."
      ],
      correct: 1
    },
    {
      question: "Salah satu metode pendeteksian kesalahan data (error checking) menggunakan perhitungan bit tambahan di ujung paling kiri untuk memastikan jumlah bit 1 selalu genap atau ganjil. Metode ini disebut...",
      options: [
        "Checksum",
        "Forward Error Correction",
        "Parity Check",
        "Modulasi PCM"
      ],
      correct: 2
    },
    {
      question: "Dalam mekanisme pengecekan kesalahan menggunakan Checksum, kesimpulan apa yang didapat jika hasil perhitungan 'Komplemen Sum' tidak sama dengan 0 (nol)?",
      options: [
        "Tidak ada error pada pengiriman data",
        "Sinyal analog berubah menjadi digital",
        "Terdapat error atau data corrupted pada proses pengiriman",
        "Proses transmisi selesai dengan sempurna"
      ],
      correct: 2
    },
    {
      question: "Pada Transmisi Digital (Line Coding), metode pengkodean yang merepresentasikan bilangan biner menggunakan tiga tingkat tegangan (positif, nol, dan negatif) adalah...",
      options: [
        "Unipolar Encoding",
        "Bipolar Encoding",
        "Polar NRZ-L Encoding",
        "Manchester Encoding"
      ],
      correct: 1
    },
    {
      question: "Konversi data analog menjadi sinyal analog dapat dimodifikasi menggunakan beberapa teknik. Teknik modulasi yang menghasilkan kualitas sinyal lebih baik dan derau (noise) yang lebih rendah adalah...",
      options: [
        "Amplitude Modulation (AM)",
        "Frequency Modulation (FM)",
        "Phase Modulation (PM)",
        "Pulse Code Modulation (PCM)"
      ],
      correct: 1
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
      // Reset pilihan atau gunakan jawaban yang sudah tersimpan jika user kembali ke soal ini
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      saveCurrentAnswer(); // Simpan jawaban saat ini sebelum mundur
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

    const allAnswered = finalAnswers.every((answer) => answer !== null);

    if (!allAnswered) {
      toast.error("Jawab semua pertanyaan terlebih dahulu!");
      return;
    }

    const score = finalAnswers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correct ? 10 : 0);
    }, 0);

    localStorage.setItem("quizScore", score.toString());

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
              Kuis Evaluasi Jaringan Komputer
            </h1>
            <p className="text-muted-foreground text-lg">
              Uji pemahamanmu berdasarkan materi Bab Jaringan Komputer & Internet Kelas XI.
            </p>
          </div>

          <Card className="p-6 mb-6 shadow-medium border-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  Pertanyaan {currentQuestion + 1} dari {questions.length}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Progress: {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
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
              value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
              onValueChange={handleAnswerSelect}
            >
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="group">
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-smooth cursor-pointer hover:border-primary hover:bg-primary/5 ${
                        selectedAnswer === index
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-base leading-relaxed"
                      >
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
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

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext} className="flex-1 shadow-medium">
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