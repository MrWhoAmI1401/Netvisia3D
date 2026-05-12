import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Laptop, Monitor, CheckCircle2, XCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const IPConfig = () => {
  const [deviceA, setDeviceA] = useState({
    ip: "",
    subnet: "",
  });
  const [deviceB, setDeviceB] = useState({
    ip: "",
    subnet: "",
  });
  const [result, setResult] = useState<"success" | "error" | "warning" | null>(
    null
  );

  const validateIP = (ip: string) => {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(ip);
  };

  const handleTestConnection = () => {
    if (!validateIP(deviceA.ip) || !validateIP(deviceB.ip)) {
      toast.error("Format IP tidak valid!");
      setResult("error");
      return;
    }

    if (deviceA.ip === deviceB.ip) {
      toast.error("Alamat IP kedua perangkat tidak boleh sama!");
      setResult("error");
      return;
    }

    if (deviceA.subnet !== deviceB.subnet) {
      toast.warning("Perangkat berada di subnet berbeda!");
      setResult("warning");
      return;
    }

    toast.success("Koneksi berhasil! Perangkat saling terhubung.");
    setResult("success");
  };

  return (
    <Layout>
      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Konfigurasi IP Address</h1>
          <p className="text-muted-foreground text-lg">
            Atur IP Address dan Subnet Mask pada dua perangkat, lalu uji
            konektivitasnya.
          </p>
        </div>

        <Card className="p-10 bg-white shadow-sm border rounded-2xl">
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Device A */}
            <div className="text-center">
              <Laptop className="w-14 h-14 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-4">Perangkat A (Laptop)</h3>

              <div className="space-y-3">
                <div>
                  <Label>IP Address</Label>
                  <Input
                    placeholder="192.168.1.10"
                    value={deviceA.ip}
                    onChange={(e) =>
                      setDeviceA({ ...deviceA, ip: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Subnet Mask</Label>
                  <Input
                    placeholder="255.255.255.0"
                    value={deviceA.subnet}
                    onChange={(e) =>
                      setDeviceA({ ...deviceA, subnet: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Device B */}
            <div className="text-center">
              <Monitor className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-4">Perangkat B (Komputer)</h3>

              <div className="space-y-3">
                <div>
                  <Label>IP Address</Label>
                  <Input
                    placeholder="192.168.1.11"
                    value={deviceB.ip}
                    onChange={(e) =>
                      setDeviceB({ ...deviceB, ip: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Subnet Mask</Label>
                  <Input
                    placeholder="255.255.255.0"
                    value={deviceB.subnet}
                    onChange={(e) =>
                      setDeviceB({ ...deviceB, subnet: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hasil Uji */}
          <div className="text-center mt-6">
            <Button
              onClick={handleTestConnection}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Uji Koneksi
            </Button>

            {result && (
              <div className="mt-6 flex flex-col items-center">
                {result === "success" && (
                  <>
                    <CheckCircle2 className="text-green-500 w-10 h-10 mb-2" />
                    <p className="text-green-600 font-semibold">
                      ✅ Perangkat terhubung dalam satu jaringan
                    </p>
                  </>
                )}
                {result === "error" && (
                  <>
                    <XCircle className="text-red-500 w-10 h-10 mb-2" />
                    <p className="text-red-600 font-semibold">
                      ❌ Konfigurasi IP salah! Cek kembali alamat IP
                    </p>
                  </>
                )}
                {result === "warning" && (
                  <>
                    <XCircle className="text-yellow-500 w-10 h-10 mb-2" />
                    <p className="text-yellow-600 font-semibold">
                      ⚠️ Subnet tidak cocok, koneksi gagal
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        <footer className="text-center text-sm text-muted-foreground mt-12">
          © 2025 NetLearn3D — Modul Konfigurasi IP Address
        </footer>
      </section>
    </Layout>
  );
};

export default IPConfig;
