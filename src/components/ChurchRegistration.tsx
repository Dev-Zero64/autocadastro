import { useState } from "react";
import { Camera, ChevronRight, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormData {
  avatar?: File;
  churchName: string;
  fullName: string;
  gender: string;
  birthDate: string;
  cep: string;
  hasKids: boolean;
  kids?: {
    avatar?: File;
    name: string;
    gender: string;
    birthDate: string;
  }[];
}

const ChurchRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    churchName: "Igreja do Nazareno de Jales",
    fullName: "",
    gender: "",
    birthDate: "",
    cep: "",
    hasKids: false,
    kids: [],
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Por favor, verifique o CEP informado",
          variant: "destructive",
        });
      } else {
        console.log("Address found:", data);
        toast({
          title: "CEP encontrado",
          description: "Endereço localizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Error fetching CEP:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar o CEP",
        variant: "destructive",
      });
    }
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
      toast({
        title: "Cadastro realizado",
        description: "Seus dados foram enviados com sucesso!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          {/* Church Logo and Name */}
          <div className="text-center mb-8">
            <img
              src="/lovable-uploads/cb79d8a4-be1d-4746-a3a7-8b7330d4f55b.png"
              alt="Church Logo"
              className="w-24 h-24 mx-auto mb-4 rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-800">{formData.churchName}</h1>
            <p className="text-gray-600 mt-2">Cadastro de Membros</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1/3 h-2 rounded-full mx-1 transition-colors duration-300 ${
                  i <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Avatar Upload */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto">
                    <div
                      className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden ${
                        !avatarPreview && "bg-gray-50"
                      }`}
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Adicionar foto</p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* CEP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.cep}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cep: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      onBlur={handleCepBlur}
                      maxLength={8}
                      placeholder="00000-000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Kids Toggle */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasKids}
                      onChange={(e) =>
                        setFormData({ ...formData, hasKids: e.target.checked })
                      }
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Possui filhos?</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <span>{step === 3 ? "Finalizar" : "Próximo"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChurchRegistration;