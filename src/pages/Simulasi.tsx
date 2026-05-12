import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, Plug, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Simulasi = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Konfigurasi IP",
      description:
        "Latih kemampuanmu dalam mengatur IP Address antar perangkat dan pahami logika jaringan dasar.",
      icon: <Laptop className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 hover:bg-blue-100",
      route: "/ip-config",
    },
    {
      title: "Perakitan Kabel",
      description:
        "Susun urutan kabel straight atau cross sesuai standar internasional.",
      icon: <Plug className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50 hover:bg-purple-100",
      route: "/kabel",
    },
    {
      title: "Simulasi Topologi",
      description:
        "Buat berbagai bentuk topologi jaringan dari rumah hingga kantor.",
      icon: <Network className="w-6 h-6 text-green-500" />,
      color: "bg-green-50 hover:bg-green-100",
      route: "/topologi",
    },
  ];

  return (
    <Layout>
      <section className="py-12 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Simulasi 3D Interaktif</h1>
          <p className="text-muted-foreground text-lg">
            Eksplorasi dan praktik langsung dengan komponen jaringan komputer 3D
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((mod, i) => (
            <Card
              key={i}
              onClick={() => navigate(mod.route)}
              className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md ${mod.color}`}
            >
              <CardContent className="p-6 text-left flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {mod.icon}
                  <h3 className="text-xl font-semibold">{mod.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {mod.description}
                </p>
                <Button
                  variant="outline"
                  className="mt-auto w-fit text-sm font-medium"
                >
                  Buka Modul →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="text-center text-sm text-muted-foreground mt-16">
          © 2025 NetLearn3D — Media Pembelajaran Jaringan Komputer
        </footer>
      </section>
    </Layout>
  );
};

export default Simulasi;
