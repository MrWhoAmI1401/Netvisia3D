import { useEffect, useMemo, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Layout from "@/components/Layout";
import "../styles/kabel.css";

type TabType = "materi" | "simulasi";
type ModeType = "straight" | "cross";

type Cable = {
  id: string;
  className: string;
};

const T568A = [
  "putih-hijau",
  "hijau",
  "putih-oranye",
  "biru",
  "putih-biru",
  "oranye",
  "putih-coklat",
  "coklat",
];

const T568B = [
  "putih-oranye",
  "oranye",
  "putih-hijau",
  "biru",
  "putih-biru",
  "hijau",
  "putih-coklat",
  "coklat",
];

const semuaKabel: Cable[] = [
  { id: "putih-oranye", className: "kabel-putih-oranye" },
  { id: "oranye", className: "kabel-oranye" },
  { id: "putih-hijau", className: "kabel-putih-hijau" },
  { id: "biru", className: "kabel-biru" },
  { id: "putih-biru", className: "kabel-putih-biru" },
  { id: "hijau", className: "kabel-hijau" },
  { id: "putih-coklat", className: "kabel-putih-coklat" },
  { id: "coklat", className: "kabel-coklat" },
];

const shuffleArray = (array: Cable[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Kabel() {
  const [activeTab, setActiveTab] = useState<TabType>("materi");
  const [mode, setMode] = useState<ModeType>("straight");

  const [cables1, setCables1] = useState<Cable[]>([]);
  const [cables2, setCables2] = useState<Cable[]>([]);

  const [status1, setStatus1] = useState("");
  const [status2, setStatus2] = useState("");
  const [status1Valid, setStatus1Valid] = useState<boolean | null>(null);
  const [status2Valid, setStatus2Valid] = useState<boolean | null>(null);

  const [mainMessage, setMainMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const targetUjung1 = useMemo(() => {
    return mode === "straight" ? T568B : T568A;
  }, [mode]);

  const targetUjung2 = useMemo(() => {
    return T568B;
  }, []);

  const resetSimulasi = () => {
    setCables1(shuffleArray(semuaKabel));
    setCables2(shuffleArray(semuaKabel));

    setStatus1("");
    setStatus2("");
    setStatus1Valid(null);
    setStatus2Valid(null);

    setMainMessage("");
    setIsConnected(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    resetSimulasi();
  }, [mode]);

  const validateConnection = () => {
    const urutanUser1 = cables1.map((item) => item.id);
    const urutanUser2 = cables2.map((item) => item.id);

    const isUjung1Benar = targetUjung1.every(
      (value, index) => value === urutanUser1[index]
    );

    const isUjung2Benar = targetUjung2.every(
      (value, index) => value === urutanUser2[index]
    );

    setStatus1(isUjung1Benar ? "✅ Susunan Benar" : "❌ Susunan Masih Salah");
    setStatus2(isUjung2Benar ? "✅ Susunan Benar" : "❌ Susunan Masih Salah");

    setStatus1Valid(isUjung1Benar);
    setStatus2Valid(isUjung2Benar);

    if (isUjung1Benar && isUjung2Benar) {
      setIsProcessing(true);
      setMainMessage("⏳ Memasang ke konektor...");
      setIsConnected(true);

      setTimeout(() => {
        setMainMessage("🎉 BERHASIL! Kabel LAN siap digunakan.");
        setIsProcessing(false);
      }, 800);
    } else {
      setIsConnected(false);
      setMainMessage(
        "⚠️ Gagal! Silakan perbaiki ujung kabel yang ditandai silang."
      );
    }
  };

  const labelUjung1 =
    mode === "straight"
      ? {
          text: "Standar T568B",
          className:
            "text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200",
        }
      : {
          text: "Standar T568A",
          className:
            "text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200",
        };

  const labelUjung2 = {
    text: "Standar T568B",
    className:
      "text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200",
  };

  return (
    <Layout>
      <div className="bg-slate-100 py-8 px-4 md:px-8 min-h-full">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab("materi")}
              className={`flex-1 py-4 px-6 text-center font-bold text-lg transition ${
                activeTab === "materi"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              📚 Materi Belajar
            </button>

            <button
              onClick={() => setActiveTab("simulasi")}
              className={`flex-1 py-4 px-6 text-center font-bold text-lg transition ${
                activeTab === "simulasi"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              🔌 Simulasi Praktik
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "materi" && (
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-800">
                    Panduan Perakitan Kabel LAN
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Pelajari perbedaan jenis kabel sebelum memulai simulasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">
                      Kabel Straight-Through
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Digunakan untuk perangkat <strong>berbeda jenis</strong>.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-blue-200 text-center font-semibold">
                      Ujung 1: <span className="text-blue-600">T568B</span>
                      <br />
                      Ujung 2: <span className="text-blue-600">T568B</span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      Kabel Crossover
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Digunakan untuk perangkat <strong>sejenis</strong>.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-green-200 text-center font-semibold">
                      Ujung 1: <span className="text-green-600">T568A</span>
                      <br />
                      Ujung 2: <span className="text-blue-600">T568B</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "simulasi" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-100 p-4 rounded-lg mb-8 border border-slate-200 gap-4">
                  <label className="font-bold text-slate-700">
                    Pilih Mode Perakitan:
                  </label>

                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as ModeType)}
                    className="p-2 w-full md:w-auto border border-slate-300 rounded-md font-bold text-blue-700 bg-white shadow-sm outline-none cursor-pointer"
                  >
                    <option value="straight">
                      Kabel Straight (T568B - T568B)
                    </option>
                    <option value="cross">
                      Kabel Crossover (T568A - T568B)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2].map((ujung) => {
                    const currentCables = ujung === 1 ? cables1 : cables2;
                    const setCurrentCables =
                      ujung === 1 ? setCables1 : setCables2;
                    const currentStatus = ujung === 1 ? status1 : status2;
                    const currentValid =
                      ujung === 1 ? status1Valid : status2Valid;
                    const label = ujung === 1 ? labelUjung1 : labelUjung2;

                    return (
                      <div
                        key={ujung}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                      >
                        <h3 className="text-lg font-bold text-slate-700 mb-3 flex justify-between items-center">
                          <span>Konektor Ujung {ujung}</span>
                          <span className={label.className}>{label.text}</span>
                        </h3>

                        <div className="rj45-container">
                          <div className="konektor-rj45">
                            <div className="pin-emas">
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="pin"></div>
                              ))}
                            </div>
                          </div>

                          <ReactSortable
                            list={currentCables}
                            setList={setCurrentCables}
                            animation={150}
                            className={`area-kabel flex gap-1 h-[120px] px-2 pt-2 cursor-grab ${
                              isConnected ? "colok-masuk" : ""
                            }`}
                          >
                            {currentCables.map((kabel) => (
                              <div
                                key={kabel.id}
                                className={`flex-1 rounded-sm border-x border-slate-300 shadow-sm hover:scale-105 transition-transform ${kabel.className}`}
                              />
                            ))}
                          </ReactSortable>
                        </div>

                        <p
                          className={`text-sm font-bold mt-3 h-5 text-center ${
                            currentValid === null
                              ? ""
                              : currentValid
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {currentStatus}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={validateConnection}
                    disabled={isProcessing}
                    className={`px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all ${
                      isProcessing
                        ? "bg-blue-400 cursor-not-allowed opacity-50"
                        : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                    }`}
                  >
                    Crimp & Validasi Koneksi
                  </button>

                  <div
                    className={`mt-6 min-h-[32px] font-bold ${
                      mainMessage.includes("BERHASIL")
                        ? "text-2xl text-green-600"
                        : mainMessage.includes("Gagal")
                        ? "text-xl text-red-500"
                        : "text-xl text-blue-600 animate-pulse"
                    }`}
                  >
                    {mainMessage}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}