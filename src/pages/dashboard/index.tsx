import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, Switch } from "@heroui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface FormData {
  name: string;
  nationality: string;
  birthYear: string;
  isActive: boolean;
}

const Dashboard = () => {
  const router = useRouter();

  // Uso del Hook (useState) para manejar el estado del formulario y los errores
  // Estado del formulario en el componente
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nationality: "",
    birthYear: "",
    isActive: false,
  });

  // Estado para manejar los errores
  const [errores, setErrores] = useState<string[]>([]);

  const handleClick = () => {
    router.back();
  };

  // Actualizar dinámicamente
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en switch
  const handleSwitchChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const erroresFormulario = validarFormulario();

    if (erroresFormulario.length > 0) {
      setErrores(erroresFormulario);
      return;
    }

    setErrores([]);
    alert("Formulario enviado correctamente");
  };

  // Derivar el mensaje de error por campo (para description)
  const nameError = errores.find((err) => err.toLowerCase().includes("name"));
  const nationalityError = errores.find((err) =>
    err.toLowerCase().includes("nationality")
  );
  const birthYearError = errores.find((err) =>
    err.toLowerCase().includes("birth")
  );
  const isActiveError = errores.find((err) =>
    err.toLowerCase().includes("active")
  );

  // Valida los datos antes de enviarlos
  const validarFormulario = (): string[] => {
    const errores: string[] = [];

    if (!formData.name.trim()) errores.push("Name is required");
    if (!formData.nationality.trim()) errores.push("Nationality is required");
    if (!formData.birthYear) errores.push("Birth year is required");
    // isActive no necesita validación ya que siempre tendrá un valor (true o false)

    return errores;
  };

  return (
    <div className="dash-container">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-container mt-7">
          <label></label>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Enter author's name"
            value={formData.name}
            onChange={handleChange}
            description={nameError || ""}
          />

          <label></label>
          <Input
            type="text"
            name="nationality"
            label="Nationality"
            placeholder="Enter author's nationality"
            value={formData.nationality}
            onChange={handleChange}
            description={nationalityError || ""}
          />

          <label></label>
          <Input
            type="date"
            name="birthYear"
            label="Birth Year"
            placeholder=""
            value={formData.birthYear}
            onChange={handleChange}
            description={birthYearError || ""}
          />

          <div className="active-container mt-8 text-gray-500">
            <label>Is the author active?</label>
            <Switch
              defaultSelected
              color="success"
              endContent={<XCircleIcon />}
              size="lg"
              startContent={<CheckCircleIcon />}
              >
            </Switch>
          </div>

          <Button className="mt-6" type="submit" variant="bordered">
            Submit
          </Button>
        </div>
      </form>

      <Button
        onPress={handleClick}
        className="mt-8 bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
