export interface Kid {
  avatar?: File;
  name: string;
  gender: string;
  birthDate: string;
}

export interface RegistrationFormData {
  avatar?: File;
  churchName: string;
  fullName: string;
  gender: string;
  birthDate: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  hasKids: boolean;
  kids: Kid[];
}
