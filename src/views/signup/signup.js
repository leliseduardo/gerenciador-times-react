import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { BASE_URL } from "../../config/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const baseUrl = `http://localhost:8081/usuarios`;

export default function Signup() {
  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
    roleNames: [],
  });

  const { username, password, roleNames } = inputValue;

  const [isCheckedAdm, setIsCheckedAdm] = useState(false);
  const [isCheckedMedico, setIsCheckedMedico] = useState(false);
  const [isCheckedTecnico, setIsCheckedTecnico] = useState(false);

  const handleCheckboxChangeAdm = (e) => {
    setIsCheckedAdm(e.target.checked);
    if (!isCheckedAdm) {
      roleNames.push(e.target.name);
      setInputValue({ ...inputValue, roleNames: roleNames });
    } else roleNames.pop();
  };
  const handleCheckboxChangeMedico = (e) => {
    setIsCheckedMedico(e.target.checked);
    if (!isCheckedMedico) {
      roleNames.push(e.target.name);
      setInputValue({ ...inputValue, roleNames: roleNames });
    } else roleNames.pop();
  };
  const handleCheckboxChangeTecnico = (e) => {
    setIsCheckedTecnico(e.target.checked);
    if (!isCheckedTecnico) {
      roleNames.push(e.target.name);
      setInputValue({ ...inputValue, roleNames: roleNames });
    } else roleNames.pop();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const signup = async () => {
    await axios
      .post(`${baseUrl}`, inputValue)
      .then((response) => {
        mensagemSucesso(`Usuário cadastrado`);
        navigate("/");
      })
      .catch(() => {
        mensagemErro(`Preencha os campos corretamente`);
      });
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-gray-100"
      style={{ height: "100vh" }}
    >
      <div className="flex flex-col items-center gap-4 mt-10 bg-white p-10 rounded-lg">
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
          label="Senha"
          variant="outlined"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <FormControl component="fieldset" className="flex items-center">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="bottom"
              name="ROLE_ADMIN"
              control={<Checkbox />}
              label="Administrador"
              labelPlacement="bottom"
              checked={isCheckedAdm}
              onChange={handleCheckboxChangeAdm}
            />
            <FormControlLabel
              value="bottom"
              name="ROLE_MEDICO"
              control={<Checkbox />}
              label="Médico"
              labelPlacement="bottom"
              checked={isCheckedMedico}
              onChange={handleCheckboxChangeMedico}
            />
            <FormControlLabel
              value="bottom"
              name="ROLE_TECNICO"
              control={<Checkbox />}
              label="Técnico"
              labelPlacement="bottom"
              checked={isCheckedTecnico}
              onChange={handleCheckboxChangeTecnico}
            />
          </FormGroup>
        </FormControl>
        <Button
          sx={{
            height: 56,
            width: 250,
          }}
          variant="contained"
          onClick={signup}
        >
          Criar minha conta
        </Button>
      </div>
    </div>
  );
}
