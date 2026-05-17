import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Cable,
  Layers3,
  ShieldCheck,
  Radio,
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

// ==========================================
// 1. DATA MATERI (JS TERPISAH DARI KOMPONEN)
// ==========================================
const materialsData = [
  {
    id: "topology",
    icon: Network,
    title: "Topologi Jaringan",
    category: "Dasar",
    description: "Pengaturan koneksi logis atau fisik antar node dalam jaringan komputer.",
    details: "Topologi jaringan mengatur koneksi antar komputer. Tidak ada topologi yang paling baik untuk semua kondisi, pemilihannya bergantung pada biaya instalasi dan skalabilitas.\n\nMacam-macam topologi:\n• Bus: Semua node terkoneksi melalui kabel utama/backbone. Efisien untuk jaringan kecil.\n• Star (Bintang): Semua node terkoneksi melalui node pusat. Jika dimodifikasi, tidak mematikan jaringan lain.\n• Ring (Cincin): Hubungan satu node dengan tetangganya membentuk konfigurasi lingkaran, diatur dengan prinsip pengiriman token.\n• Tree (Pohon): Hubungan antar node seperti cabang pohon, biasa untuk hierarki institusi.\n• Hybrid: Menggabungkan dua atau lebih topologi seperti bintang dan cincin.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "osi",
    icon: Layers3,
    title: "Model Jaringan OSI",
    category: "Konsep",
    description: "Kerangka standar komunikasi jaringan yang dibagi ke dalam 7 lapisan (layer).",
    details: "Model Open System Interconnection (OSI) menyediakan kerangka standar komunikasi melalui 7 lapisan:\n\n1. Physical Layer: Mendefinisikan transmisi perangkat keras dan bit.\n2. Data Link Layer: Mengelompokkan data dalam frame dan pengalamatan perangkat keras (MAC).\n3. Network Layer: Pengalamatan host dengan IP Address.\n4. Transport Layer: Pengiriman end-to-end, memastikan data andal.\n5. Session Layer: Mendefinisikan koneksi (memulai dan mengakhiri sesi).\n6. Presentation Layer: Mentranslasikan format data.\n7. Application Layer: Antarmuka ke pengguna seperti HTTP, FTP, dan DNS.",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "tcpip",
    icon: Layers3,
    title: "Model TCP/IP",
    category: "Konsep",
    description: "Standar protokol dan komunikasi data dominan yang digunakan pada jaringan internet global.",
    details: "TCP/IP (Transmission Control Protocol/Internet Protocol) adalah protokol terbuka independen yang sangat ideal untuk menyatukan beragam sistem yang heterogen (Windows, Linux, dll).\n\nCara kerjanya:\n• TCP membagi data menjadi paket-paket kecil dan menambahkan informasi error checking.\n• IP menambahkan label yang berisi informasi alamat tujuan.\n• Router berfungsi sebagai perantara yang mencari jalur tercepat dan membagi beban lalu lintas jaringan.\n• Saat paket sampai, TCP menyusun ulang sesuai urutan dan meminta kirim ulang jika ada data yang terkorupsi (corrupted).",
    color: "from-indigo-500 to-blue-600"
  },
  {
    id: "transmisi",
    icon: Cable,
    title: "Transmisi & Paket Data",
    category: "Transmisi",
    description: "Bagaimana proses berbagi data dilakukan antar sistem menggunakan paket berukuran kecil.",
    details: "Transmisi data memiliki bagian penting: Pengirim, Penerima, dan Medium (kanal transmisi).\nUntuk keandalan, data tidak dikirim dalam ukuran besar, tetapi dalam sekumpulan paket kecil (Packet Data atau Datagram) biasanya 64 KiB.\n\nStruktur sebuah Paket Data:\n• Packet Header: Menyimpan alamat IP pengirim, penerima, dan urutan paket untuk penyusunan kembali.\n• Packet Payload: Data aktual yang ditransmisikan.\n• Packet Trailer: Tanda akhir paket yang memuat mekanisme pengecekan kesalahan pengiriman (seperti CRC atau Checksum).",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "packet-switching",
    icon: Network,
    title: "Packet Switching",
    category: "Transmisi",
    description: "Cara memecah data dan mengirim paket secara independen melalui rute router.",
    details: "Packet switching memecah data lalu dikirim independen melintasi router sebelum disusun kembali sesuai urutan header-nya.\n\nKelebihan:\n• Tidak perlu jalur khusus antar node pengirim dan tujuan.\n• Tahan kegagalan karena router dapat melakukan pengiriman ulang (rerouting) paket.\n• Banyak user bisa memakai jaringan bersamaan.\n\nKekurangan:\n• Rentan jeda (delay) dan bouncing data.\n• Butuh waktu untuk proses reassemble/menyusun ulang paket.\n\n*Catatan: Paket yang hilang di perjalanan dibatasi menggunakan mekanisme time to leave (TTL) atau hop number.*",
    color: "from-cyan-500 to-sky-500"
  },
  {
    id: "error-detection",
    icon: ShieldCheck,
    title: "Deteksi Kesalahan",
    category: "Keamanan Data",
    description: "Metode melacak dan memperbaiki data yang rusak/corrupt selama transmisi.",
    details: "Data dalam transmisi rentan terhadap: Single Bit Error, Multiple Bit Error, dan Burst Error.\n\nCara Pendeteksian (Error Checking):\n• Parity Check: Menambah bit agar total bit '1' menjadi genap (parity genap) atau ganjil (parity ganjil). Kekurangannya, tidak bisa mendeteksi kerusakan pada dua bit sekaligus.\n• Checksum: Algoritma yang ditambahkan di blok akhir data. Jika divalidasi dan nilai 'komplemen Sum' tidak nol, berarti terdapat error.\n\nCara Perbaikan:\n• Backward Error Correction: Meminta pengiriman data ulang (efektif di serat optik, kurang di nirkabel).\n• Forward Error Correction: Memperbaiki data corrupted menggunakan algoritma perbaikan.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "digital",
    icon: Radio,
    title: "Transmisi Digital",
    category: "Sinyal",
    description: "Pengiriman data menggunakan sinyal diskrit berbasis konversi Line Coding.",
    details: "Sinyal digital bersifat diskrit (0 dan 1) dan tahan terhadap gangguan/noise.\n\nLine Coding dipakai untuk konversi data digital ke sinyal digital:\n• Unipolar Encoding: Menggunakan tegangan tunggal (tinggi = 1, tanpa tegangan = 0).\n• Polar Encoding: Menggunakan banyak tingkat (Non Return to Zero / NRZ, Return to Zero / RZ, Manchester).\n• Bipolar Encoding: Memakai 3 tingkat tegangan: positif, nol, dan negatif.\n\nKonversi suara Analog ke Digital disebut modulasi PCM yang melalui 3 tahap: Sampling, Kuantisasi, dan Pengkodean.",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "analog",
    icon: Radio,
    title: "Transmisi Analog & Derau",
    category: "Sinyal",
    description: "Pengiriman sinyal gelombang kontinu beserta potensi penurunannya.",
    details: "Sinyal analog bersifat kontinu (seperti gelombang elektromagnetik dan suara mekanik/udara).\nModulasi Analog berfungsi untuk memodifikasi sinyal, terdiri dari:\n• Amplitude Modulation (AM): Amplitudo diubah sesuai data.\n• Frequency Modulation (FM): Frekuensi diubah sesuai data, lebih rendah derau/noise.\n• Phase Modulation (PM): Fase gelombang diubah.\n\nKelemahan pengiriman sinyal adalah rentan kualitas menurun akibat:\n• Delay Distortion: Ketidakcocokan frekuensi.\n• Attenuation: Kekuatan sinyal (arus listrik) melemah di jalur panjang.\n• Noise/Derau: Gangguan acak akibat suhu (Thermal), sinyal asing (Crosstalk), gangguan cuaca/petir (Impulse).",
    color: "from-pink-500 to-rose-500"
  }
];


// ==========================================
// 2. KOMPONEN VISUALISASI TOPOLOGI
// ==========================================
const TopologyViewer = () => {
  const [activeTopology, setActiveTopology] = useState("star");
  const topologies = ["star", "ring", "bus", "mesh"];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2 mb-6">
        {topologies.map((type) => (
          <Button
            key={type}
            size="sm"
            variant={activeTopology === type ? "default" : "outline"}
            onClick={() => setActiveTopology(type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border overflow-hidden flex justify-center items-center h-[320px]">
        {activeTopology === "star" && (
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
            <g stroke="#60a5fa" strokeWidth="2">
              <line x1="200" y1="150" x2="80" y2="60" />
              <line x1="200" y1="150" x2="320" y2="60" />
              <line x1="200" y1="150" x2="80" y2="240" />
              <line x1="200" y1="150" x2="320" y2="240" />
              <line x1="200" y1="150" x2="200" y2="40" />
              <line x1="200" y1="150" x2="200" y2="260" />
            </g>
            <circle cx="200" cy="150" r="28" fill="#f97316" />
            <text x="200" y="155" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">HUB</text>
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
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
            <circle cx="200" cy="150" r="110" fill="none" stroke="#60a5fa" strokeWidth="2" />
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
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
            <line x1="40" y1="150" x2="360" y2="150" stroke="#60a5fa" strokeWidth="4" />
            <g stroke="#60a5fa" strokeWidth="2">
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
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-sm">
            <g stroke="#60a5fa" strokeWidth="1.5" opacity="0.7">
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


// ==========================================
// 3. KOMPONEN VISUALISASI OSI LAYER
// ==========================================
const OSIViewer = () => {
  const [activeLayer, setActiveLayer] = useState(null);

  const osiLayers = [
    { num: 7, name: "Application", color: "bg-red-500", desc: "Antarmuka ke pengguna aplikasi.", prot: "HTTP, FTP, DNS" },
    { num: 6, name: "Presentation", color: "bg-orange-500", desc: "Mendefinisikan format dan mentranslasikan data.", prot: "SSL, TLS" },
    { num: 5, name: "Session", color: "bg-yellow-500", desc: "Memulai, memelihara, dan mengakhiri sesi koneksi.", prot: "NetBIOS, PPTP" },
    { num: 4, name: "Transport", color: "bg-green-500", desc: "Pengiriman end-to-end, error checking data.", prot: "TCP, UDP" },
    { num: 3, name: "Network", color: "bg-blue-500", desc: "Pengalamatan host pengirim dan penerima (IP).", prot: "IP, ARP, ICMP" },
    { num: 2, name: "Data Link", color: "bg-indigo-500", desc: "Mengelompokkan data dalam frame, MAC Address.", prot: "PPP, Ethernet" },
    { num: 1, name: "Physical", color: "bg-purple-500", desc: "Transmisi bit melalui perangkat keras.", prot: "USB, Bluetooth" }
  ];

  return (
    <div className="mt-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-1">
        {osiLayers.map((layer) => (
          <button
            key={layer.num}
            onClick={() => setActiveLayer(layer)}
            className={`w-full text-left px-4 py-3 rounded text-white font-semibold transition-all duration-200 hover:opacity-80 ${layer.color} ${
              activeLayer?.num === layer.num ? "ring-4 ring-offset-2 ring-primary scale-[1.02]" : ""
            }`}
          >
            Layer {layer.num}: {layer.name}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-slate-50 dark:bg-slate-900 border rounded-xl p-6 flex flex-col justify-center min-h-[250px]">
        {activeLayer ? (
          <div>
            <h4 className="text-xl font-bold mb-2">
              Layer {activeLayer.num} - {activeLayer.name} Layer
            </h4>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{activeLayer.desc}</p>
            <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-lg">
              <span className="font-semibold text-sm text-slate-500 dark:text-slate-400">Contoh Protokol:</span>
              <p className="font-mono font-medium mt-1">{activeLayer.prot}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            <p>Klik salah satu layer di samping untuk melihat detail fungsinya.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 4. KOMPONEN VISUALISASI SINYAL
// ==========================================
const SignalViewer = () => {
  const [signalType, setSignalType] = useState("analog");

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-6">
        <Button
          variant={signalType === "analog" ? "default" : "outline"}
          onClick={() => setSignalType("analog")}
        >
          Sinyal Analog
        </Button>
        <Button
          variant={signalType === "digital" ? "default" : "outline"}
          onClick={() => setSignalType("digital")}
        >
          Sinyal Digital
        </Button>
      </div>

      <div className="bg-slate-950 rounded-xl p-6 border flex flex-col justify-center h-[280px]">
        {signalType === "analog" && (
          <div className="w-full text-center">
            <svg viewBox="0 0 400 150" className="w-full h-full max-h-[200px]">
              <path
                d="M 0 75 Q 50 0, 100 75 T 200 75 T 300 75 T 400 75"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="4"
              />
              <line x1="0" y1="75" x2="400" y2="75" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <p className="text-slate-300 mt-4 text-sm">Sinyal kontinu yang merepresentasikan gelombang.</p>
          </div>
        )}

        {signalType === "digital" && (
          <div className="w-full text-center">
            <svg viewBox="0 0 400 150" className="w-full h-full max-h-[200px]">
              <path
                d="M 20 120 L 20 30 L 100 30 L 100 120 L 180 120 L 180 30 L 260 30 L 260 120 L 340 120 L 340 30"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
              />
              <line x1="0" y1="120" x2="400" y2="120" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <p className="text-slate-300 mt-4 text-sm">Sinyal diskrit berupa nilai 0 dan 1 (tangga naik turun).</p>
          </div>
        )}
      </div>
    </div>
  );
};


// ==========================================
// 5. KOMPONEN UTAMA (HALAMAN MATERI)
// ==========================================
export default function Materi() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Fungsi pembantu untuk me-render viewer yang sesuai berdasarkan ID materi
  const renderViewer = (topicId) => {
    switch (topicId) {
      case "topology":
        return <TopologyViewer />;
      case "osi":
        return <OSIViewer />;
      case "digital":
      case "analog":
        return <SignalViewer />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Materi Pembelajaran Jaringan Komputer
            </h1>
            <p className="text-muted-foreground text-lg">
              Pelajari konsep jaringan komputer, model jaringan, pengiriman, dan transmisi data secara interaktif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {materialsData.map((material, index) => {
              const Icon = material.icon;
              const hasViewer = ["topology", "osi", "digital", "analog"].includes(material.id);

              return (
                <Card
                  key={material.id}
                  className="p-6 shadow-medium border-2 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${material.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl font-semibold">{material.title}</h3>
                      <Badge variant="secondary">{material.category}</Badge>
                    </div>

                    <p className="text-muted-foreground mb-6 flex-1">
                      {material.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      <Button size="sm" onClick={() => setSelectedTopic(index)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                      
                      {hasViewer && (
                        <Button size="sm" variant="outline" onClick={() => setSelectedTopic(index)}>
                          <ChevronRight className="w-4 h-4 mr-2" />
                          Buka Modul Interaktif
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={selectedTopic !== null} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedTopic !== null && materialsData[selectedTopic].title}
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line text-base pt-4 leading-7 text-slate-800 dark:text-slate-300">
              {selectedTopic !== null && materialsData[selectedTopic].details}
            </DialogDescription>
          </DialogHeader>

          {/* Menampilkan Visualisasi Interaktif Jika Ada */}
          {selectedTopic !== null && renderViewer(materialsData[selectedTopic].id)}

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedTopic(null)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}