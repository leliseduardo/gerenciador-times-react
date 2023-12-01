import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { mensagemErro } from "./Components/toastr";
// import { mensagemErro, mensagemSucesso } from "../Components/toastr";

const baseUrl = `http://localhost:8081/usuarios/login`;

export default function Login() {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const { username, password } = login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let navigate = useNavigate();

  const visaoAdm = () => {
    navigate("/visao-adm");
  };
  const signup = () => {
    navigate("/signup");
  };
  const visaoMedico = () => {
    navigate("/visao-medico");
  };
  const visaoTecnico = () => {
    navigate("/visao-tecnico");
  };

  const loginUsuario = async () => {
    await axios
      .post(`${baseUrl}`, login)
      .then((response) => {
        const role = response.data[0];
        if (role === "ROLE_ADMIN") visaoAdm();
        else if (role === "ROLE_MEDICO") visaoMedico();
        else visaoTecnico();
      })
      .catch((response) => {
        mensagemErro("Usuário ou senha incorretos");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUsuario();
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-sm p-8 rounded-xl">
      <div className="bg-gray-600 w-28 h-28 rounded-full"></div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextField
            sx={{
              width: 250,
            }}
            type="text"
            label="Usuário"
            variant="outlined"
            name="username"
            value={username}
            onChange={handleChange}
          />
          <TextField
            sx={{
              width: 250,
            }}
            type="password"
            label="Password"
            variant="outlined"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row ">
          <Button
            type="submit"
            sx={{
              height: 56,
              width: 250,
            }}
            variant="contained"
          >
            Login
          </Button>
        </div>
      </form>
      <div className="flex flex-col w-60 items-center">
        <span>Ainda sem conta ?</span>
        <span
          onClick={signup}
          className="text-blue-800 font-bold cursor-pointer"
        >
          Cadastre-se
        </span>
      </div>
    </div>
  );
}
