import { useState } from "react";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegistrationFormData } from "@/types/data";
import { INITIAL_FORM_STATE } from "@/consts/INITIAL_FORM_STATE";

const ChurchRegistration = () => {
  const [formData, setFormData] =
    useState<RegistrationFormData>(INITIAL_FORM_STATE);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [kidsAvatarPreviews, setKidsAvatarPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  // Função para lidar com a mudança de arquivo no avatar principal
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

  // Função para lidar com a mudança de arquivo no avatar de um filho
  const handleKidFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  // Função para buscar o endereço pelo CEP usando a API ViaCEP.
  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Por favor, verifique o CEP informado.",
          variant: "destructive",
        });
      } else {
        setFormData({
          ...formData,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        });
        toast({
          title: "CEP encontrado",
          description: "Endereço localizado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o CEP.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com o evento onBlur do campo CEP
  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    } else {
      toast({
        title: "CEP inválido",
        description: "O CEP deve conter 8 dígitos.",
        variant: "destructive",
      });
    }
  };

  // Função para adicionar um novo filho
  const addKid = () => {
    setFormData({
      ...formData,
      kids: [...formData.kids, { name: "", gender: "", birthDate: "" }],
    });
    setKidsAvatarPreviews([...kidsAvatarPreviews, ""]);
  };

  // Função para remover um filho
  const removeKid = (index: number) => {
    const updatedKids = formData.kids.filter((_, i) => i !== index);
    const updatedPreviews = kidsAvatarPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, kids: updatedKids });
    setKidsAvatarPreviews(updatedPreviews);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
    toast({
      title: "Cadastro realizado",
      description: "Seus dados foram enviados com sucesso!",
    });
    // Reseta formulario pro estado inicial.
    setFormData({
      churchName: "Igreja Embaixada da Rocha Viva",
      fullName: "",
      gender: "",
      birthDate: "",
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      hasKids: false,
      kids: [],
    });

    // Reseta avatares.
    setAvatarPreview("");
    setKidsAvatarPreviews([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-6">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
      </div>
      <h1 className="text-2xl text-center font-bold mb-4">
        {formData.churchName}
      </h1>
      <h3 className="text-2xl text-center  mb-4">Cadastro de Membros</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <label
              htmlFor="avatar"
              className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50"
            >
              <Camera className="w-8 h-8 text-gray-500" />
            </label>
          )}
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-gray-600">Adicionar foto</span>
        </div>

        {/* Nome Completo */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Sexo */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Sexo
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </div>

        {/* Data de Nascimento */}
        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium text-gray-700"
          >
            Data de Nascimento
          </label>
          <input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* CEP */}
        <div>
          <label
            htmlFor="cep"
            className="block text-sm font-medium text-gray-700"
          >
            CEP
          </label>
          <input
            id="cep"
            type="text"
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
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {/* Logradouro */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Logradouro
          </label>
          <input
            id="street"
            type="text"
            value={formData.street}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Bairro */}
        <div>
          <label
            htmlFor="neighborhood"
            className="block text-sm font-medium text-gray-700"
          >
            Bairro
          </label>
          <input
            id="neighborhood"
            type="text"
            value={formData.neighborhood}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Cidade */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Cidade
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <input
            id="state"
            type="text"
            value={formData.state}
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Possui Filhos? */}
        <div>
          <label className="flex items-center space-x-2">
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
            <span className="text-sm font-medium text-gray-700">
              Possui filhos?
            </span>
          </label>
        </div>

        {/* Filhos */}
        {formData.hasKids && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Filhos</h2>
            <button
              type="button"
              onClick={addKid}
              className="flex items-center space-x-2 text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Filho</span>
            </button>
            {formData.kids.map((kid, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-4">
                <div className="flex items-center space-x-4">
                  {kidsAvatarPreviews[index] ? (
                    <img
                      src={kidsAvatarPreviews[index]}
                      alt={`Avatar do filho ${index + 1}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <label
                      htmlFor={`kid-avatar-${index}`}
                      className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50"
                    >
                      <Camera className="w-6 h-6 text-gray-500" />
                    </label>
                  )}
                  <input
                    id={`kid-avatar-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleKidFileChange(index, e)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => removeKid(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label
                    htmlFor={`kid-name-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome Completo
                  </label>
                  <input
                    id={`kid-name-${index}`}
                    type="text"
                    value={kid.name}
                    onChange={(e) => {
                      const updatedKids = [...formData.kids];
                      updatedKids[index] = { ...kid, name: e.target.value };
                      setFormData({ ...formData, kids: updatedKids });
                    }}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor={`kid-gender-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sexo
                  </label>
                  <select
                    id={`kid-gender-${index}`}
                    value={kid.gender}
                    onChange={(e) => {
                      const updatedKids = [...formData.kids];
                      updatedKids[index] = { ...kid, gender: e.target.value };
                      setFormData({ ...formData, kids: updatedKids });
                    }}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`kid-birthDate-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Data de Nascimento
                  </label>
                  <input
                    id={`kid-birthDate-${index}`}
                    type="date"
                    value={kid.birthDate}
                    onChange={(e) => {
                      const updatedKids = [...formData.kids];
                      updatedKids[index] = {
                        ...kid,
                        birthDate: e.target.value,
                      };
                      setFormData({ ...formData, kids: updatedKids });
                    }}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
};

export default ChurchRegistration;
