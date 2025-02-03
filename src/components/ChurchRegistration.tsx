import { useState } from "react";
import { Camera, MapPin, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Kid {
  avatar?: File;
  name: string;
  gender: string;
  birthDate: string;
}

interface RegistrationFormData {
  avatar?: File;
  churchName: string;
  fullName: string;
  gender: string;
  birthDate: string;
  cep: string;
  hasKids: boolean;
  kids: Kid[];
}

const ChurchRegistration = () => {
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
  const [kidsAvatarPreviews, setKidsAvatarPreviews] = useState<string[]>([]);
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

  const handleKidFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedKids = [...formData.kids];
      updatedKids[index] = { ...updatedKids[index], avatar: file };
      setFormData({ ...formData, kids: updatedKids });

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...kidsAvatarPreviews];
        newPreviews[index] = reader.result as string;
        setKidsAvatarPreviews(newPreviews);
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

  const addKid = () => {
    setFormData({
      ...formData,
      kids: [...formData.kids, { name: "", gender: "", birthDate: "" }],
    });
    setKidsAvatarPreviews([...kidsAvatarPreviews, ""]);
  };

  const removeKid = (index: number) => {
    const updatedKids = formData.kids.filter((_, i) => i !== index);
    const updatedPreviews = kidsAvatarPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, kids: updatedKids });
    setKidsAvatarPreviews(updatedPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Cadastro realizado",
      description: "Seus dados foram enviados com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
          <div className="text-center mb-8">
            <img
              src="/lovable-uploads/cb79d8a4-be1d-4746-a3a7-8b7330d4f55b.png"
              alt="Church Logo"
              className="w-24 h-24 mx-auto mb-4 rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-800">{formData.churchName}</h1>
            <p className="text-gray-600 mt-2">Cadastro de Membros</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="border-t pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasKids}
                  onChange={(e) => {
                    setFormData({ ...formData, hasKids: e.target.checked });
                    if (!e.target.checked) {
                      setFormData({ ...formData, hasKids: false, kids: [] });
                      setKidsAvatarPreviews([]);
                    }
                  }}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Possui filhos?</span>
              </label>
            </div>

            {formData.hasKids && (
              <div className="space-y-6 border-t pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">Filhos</h3>
                  <button
                    type="button"
                    onClick={addKid}
                    className="flex items-center space-x-2 text-primary hover:text-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Filho</span>
                  </button>
                </div>

                {formData.kids.map((kid, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="text-center">
                        <div className="relative w-20 h-20">
                          <div
                            className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden ${
                              !kidsAvatarPreviews[index] && "bg-gray-50"
                            }`}
                          >
                            {kidsAvatarPreviews[index] ? (
                              <img
                                src={kidsAvatarPreviews[index]}
                                alt="Kid Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Camera className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleKidFileChange(index, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeKid(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={kid.name}
                        onChange={(e) => {
                          const updatedKids = [...formData.kids];
                          updatedKids[index] = { ...kid, name: e.target.value };
                          setFormData({ ...formData, kids: updatedKids });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo
                      </label>
                      <select
                        required
                        value={kid.gender}
                        onChange={(e) => {
                          const updatedKids = [...formData.kids];
                          updatedKids[index] = { ...kid, gender: e.target.value };
                          setFormData({ ...formData, kids: updatedKids });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        required
                        value={kid.birthDate}
                        onChange={(e) => {
                          const updatedKids = [...formData.kids];
                          updatedKids[index] = { ...kid, birthDate: e.target.value };
                          setFormData({ ...formData, kids: updatedKids });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <span>Finalizar Cadastro</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChurchRegistration;