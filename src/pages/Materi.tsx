import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Cable,
  Server,
  Wifi,
  ChevronRight,
  Eye
} from "lucide-react";
import Layout from "@/components/Layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const TopologyViewer = () => {
  const [activeTopology, setActiveTopology] = useState("star");

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Visualisasi Macam Topologi
      </h3>

      <div className="flex flex-wrap gap-2 mb-6">
        {["star", "ring", "bus", "mesh"].map((type) => (
          <Button
            key={type}
            size="sm"
            variant={
              activeTopology === type
                ? "default"
                : "outline"
            }
            onClick={() => setActiveTopology(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border overflow-hidden">
        {activeTopology === "star" && (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-[320px]"
          >
            <g
              stroke="#60a5fa"
              strokeWidth="2"
            >
              <line x1="200" y1="150" x2="80" y2="60" />
              <line x1="200" y1="150" x2="320" y2="60" />
              <line x1="200" y1="150" x2="80" y2="240" />
              <line x1="200" y1="150" x2="320" y2="240" />
              <line x1="200" y1="150" x2="200" y2="40" />
              <line x1="200" y1="150" x2="200" y2="260" />
            </g>

            <circle
              cx="200"
              cy="150"
              r="28"
              fill="#f97316"
            />

            <text
              x="200"
              y="155"
              textAnchor="middle"
              fill="#fff"
              fontSize="11"
              fontWeight="700"
            >
              HUB
            </text>

            <g fill="#3b82f6">
              <circle cx="80" cy="60" r="18" />
              <circle cx="320" cy="60" r="18" />
              <circle cx="80" cy="240" r="18" />
              <circle cx="320" cy="240" r="18" />
              <circle cx="200" cy="40" r="18" />
              <circle cx="200" cy="260" r="18" />
            </g>
          </svg>
        )}

        {activeTopology === "ring" && (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-[320px]"
          >
            <circle
              cx="200"
              cy="150"
              r="110"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
            />

            <g fill="#3b82f6">
              <circle cx="200" cy="40" r="18" />
              <circle cx="305" cy="95" r="18" />
              <circle cx="305" cy="205" r="18" />
              <circle cx="200" cy="260" r="18" />
              <circle cx="95" cy="205" r="18" />
              <circle cx="95" cy="95" r="18" />
            </g>
          </svg>
        )}

        {activeTopology === "bus" && (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-[320px]"
          >
            <line
              x1="40"
              y1="150"
              x2="360"
              y2="150"
              stroke="#60a5fa"
              strokeWidth="4"
            />

            <g
              stroke="#60a5fa"
              strokeWidth="2"
            >
              <line x1="100" y1="150" x2="100" y2="80" />
              <line x1="180" y1="150" x2="180" y2="80" />
              <line x1="260" y1="150" x2="260" y2="80" />
              <line x1="340" y1="150" x2="340" y2="80" />
              <line x1="140" y1="150" x2="140" y2="220" />
              <line x1="220" y1="150" x2="220" y2="220" />
              <line x1="300" y1="150" x2="300" y2="220" />
            </g>

            <g fill="#3b82f6">
              <circle cx="100" cy="70" r="16" />
              <circle cx="180" cy="70" r="16" />
              <circle cx="260" cy="70" r="16" />
              <circle cx="340" cy="70" r="16" />
              <circle cx="140" cy="230" r="16" />
              <circle cx="220" cy="230" r="16" />
              <circle cx="300" cy="230" r="16" />
            </g>
          </svg>
        )}

        {activeTopology === "mesh" && (
          <svg
            viewBox="0 0 400 300"
            className="w-full h-[320px]"
          >
            <g
              stroke="#60a5fa"
              strokeWidth="1.5"
              opacity="0.7"
            >
              <line x1="80" y1="80" x2="320" y2="80" />
              <line x1="80" y1="80" x2="80" y2="220" />
              <line x1="80" y1="80" x2="320" y2="220" />
              <line x1="80" y1="80" x2="200" y2="40" />
              <line x1="320" y1="80" x2="320" y2="220" />
              <line x1="320" y1="80" x2="80" y2="220" />
              <line x1="320" y1="80" x2="200" y2="40" />
              <line x1="80" y1="220" x2="320" y2="220" />
              <line x1="80" y1="220" x2="200" y2="40" />
              <line x1="320" y1="220" x2="200" y2="40" />
            </g>

            <g fill="#3b82f6">
              <circle cx="200" cy="40" r="18" />
              <circle cx="80" cy="80" r="18" />
              <circle cx="320" cy="80" r="18" />
              <circle cx="80" cy="220" r="18" />
              <circle cx="320" cy="220" r="18" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

const Materi = () => {
  const [selectedTopic, setSelectedTopic] =
    useState<number | null>(null);

  const materials = [
    {
      icon: Network,
      title: "Topologi Jaringan",
      category: "Dasar",
      description:
        "Pelajari berbagai jenis topologi jaringan seperti Star, Ring, Bus, dan Mesh.",
      details:
        "Topologi jaringan adalah struktur hubungan antar perangkat.\n\n• Star: Semua perangkat ke switch/hub pusat\n• Ring: Perangkat membentuk cincin\n• Bus: Semua perangkat ke satu kabel utama\n• Mesh: Semua perangkat saling terhubung",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Server,
      title: "Perangkat Keras Jaringan",
      category: "Hardware",
      description:
        "Kenali router, switch, hub, access point, dan perangkat lainnya.",
      details:
        "• Router: Menghubungkan berbagai jaringan\n• Switch: Menghubungkan perangkat LAN\n• Hub: Penghubung sederhana\n• Access Point: Wireless access",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Cable,
      title: "Kabel dan Konektor",
      category: "Praktik",
      description:
        "Memahami jenis kabel jaringan dan konektor RJ45.",
      details:
        "• UTP\n• STP\n• Fiber Optic\n• RJ45",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Wifi,
      title: "Konfigurasi IP Address",
      category: "Konfigurasi",
      description:
        "Belajar IP Address, subnet mask, gateway, dan DNS.",
      details:
        "• IPv4\n• Subnet Mask\n• Gateway\n• DNS",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Materi Pembelajaran
            </h1>
            <p className="text-muted-foreground text-lg">
              Pelajari konsep fundamental jaringan komputer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {materials.map((material, index) => {
              const Icon = material.icon;
              const isTopology = index === 0;

              return (
                <Card
                  key={index}
                  className="p-6 shadow-medium border-2"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${material.color} flex items-center justify-center`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {material.title}
                        </h3>

                        <Badge variant="secondary">
                          {material.category}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {material.description}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            setSelectedTopic(index)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </Button>

                        {isTopology && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedTopic(index)
                            }
                          >
                            <ChevronRight className="w-4 h-4 mr-2" />
                            Lihat Macam Topologi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-12 p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-primary" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">
                  Tips Belajar Efektif
                </h3>

                <p className="text-muted-foreground">
                  Pelajari materi berurutan lalu uji
                  pemahaman lewat kuis.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Dialog
        open={selectedTopic !== null}
        onOpenChange={() => setSelectedTopic(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedTopic !== null &&
                materials[selectedTopic].title}
            </DialogTitle>

            <DialogDescription className="whitespace-pre-line text-base pt-4">
              {selectedTopic !== null &&
                materials[selectedTopic].details}
            </DialogDescription>
          </DialogHeader>

          {selectedTopic === 0 && <TopologyViewer />}

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setSelectedTopic(null)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Materi;