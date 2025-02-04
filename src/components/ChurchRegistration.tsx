import { useState } from "react";
import { Camera, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegistrationFormData } from "@/types/data";
import { INITIAL_FORM_STATE } from "@/consts/INITIAL_FORM_STATE";
import { Link } from "react-router-dom";

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
    setFormData(INITIAL_FORM_STATE);

    // Reseta avatares.
    setAvatarPreview("");
    setKidsAvatarPreviews([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center mb-8 space-y-4">
        <img
          src="/logo.jpg"
          alt="Logo"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          {formData.churchName}
        </h1>
        <h3 className="text-xl text-gray-600">Cadastro de Membros</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Avatar */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <label
                htmlFor="avatar"
                className="w-24 h-24 flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-full cursor-pointer transition-colors hover:border-primary hover:bg-gray-50"
              >
                <Camera className="w-8 h-8 text-gray-400" />
              </label>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">
              Foto do membro
            </span>
            <p className="text-xs text-gray-400">
              Formatos: JPG, PNG (max 5MB)
            </p>
          </div>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Campos do Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome Completo */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Nome Completo *
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          {/* Sexo */}
          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-gray-700"
            >
              Sexo *
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-select-arrow bg-no-repeat bg-[right_1rem_center]"
              required
            >
              <option value="">Selecione seu sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <label
              htmlFor="birthDate"
              className="text-sm font-medium text-gray-700"
            >
              Data de Nascimento *
            </label>
            <input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent [&::-webkit-calendar-picker-indicator]:"
              required
            />
          </div>

          {/* CEP */}
          <div className="space-y-2">
            <label htmlFor="cep" className="text-sm font-medium text-gray-700">
              CEP *
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Campos de Endereço */}
          {(["street", "neighborhood", "city", "state"] as const).map(
            (field) => (
              <div key={field} className="space-y-2">
                <label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700"
                >
                  {
                    {
                      street: "Logradouro",
                      neighborhood: "Bairro",
                      city: "Cidade",
                      state: "Estado",
                    }[field]
                  }
                </label>
                <input
                  id={field}
                  type="text"
                  value={formData[field]}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            )
          )}
        </div>

        {/* Seção Filhos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">Filhos</h3>
              <p className="text-sm text-gray-500">
                Adicione informações sobre seus dependentes
              </p>
            </div>
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
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Possui filhos?
              </span>
            </label>
          </div>

          {formData.hasKids && (
            <div className="space-y-6">
              {formData.kids.map((kid, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white border border-gray-200 rounded-xl space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => removeKid(index)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {kidsAvatarPreviews[index] ? (
                        <img
                          src={kidsAvatarPreviews[index]}
                          alt={`Avatar do filho ${index + 1}`}
                          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <label
                          htmlFor={`kid-avatar-${index}`}
                          className="w-20 h-20 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-full cursor-pointer transition-colors hover:border-primary"
                        >
                          <Camera className="w-6 h-6 text-gray-400" />
                        </label>
                      )}
                      <input
                        id={`kid-avatar-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleKidFileChange(index, e)}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">
                        Filho {index + 1}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Adicione os dados do dependente
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={kid.name}
                        onChange={(e) => {
                          const updatedKids = [...formData.kids];
                          updatedKids[index] = { ...kid, name: e.target.value };
                          setFormData({ ...formData, kids: updatedKids });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Nome do dependente"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Sexo *
                      </label>
                      <select
                        value={kid.gender}
                        onChange={(e) => {
                          const updatedKids = [...formData.kids];
                          updatedKids[index] = {
                            ...kid,
                            gender: e.target.value,
                          };
                          setFormData({ ...formData, kids: updatedKids });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Data de Nascimento *
                      </label>
                      <input
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
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addKid}
                className="w-full p-4 flex items-center justify-center space-x-2 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-primary hover:text-primary hover:bg-gray-100 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar filho</span>
              </button>
            </div>
          )}
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-black text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Finalizar Cadastro
        </button>
      </form>
      <div className="flex justify-center mt-8">
        <Link
          to={"/alternative"}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Versão Alternativa
        </Link>
      </div>
    </div>
  );
};

export default ChurchRegistration;
