import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {cadastrarOuAtualizar, getDataBasedOnId} from "../../utils/healpers";

const baseUrl = `${BASE_URL}/locais`;

export default function CadastroLocal() {
  const [inputValue, setInputValue] = useState({
    id: "",
    nome: "",
    data: "",
  });

  const { nome } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach((key) => {
      handleChange({ target: { name: key, value: "" } });
    });
  }, [inputValue]);

  useEffect(() => {
    const mount = async () => {
      if (idParam !== null  && idParam !== undefined) {
        await getDataBasedOnId(baseUrl, idParam, inputValue, handleChange)
      }
    };

    mount();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro Local" />

        <div className="flex flex-col justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <TextField
            fullWidth
            type="text"
            label="Nome"
            variant="outlined"
            name="nome"
            value={nome}
            onChange={handleChange}
          />

          <div className="flex gap-2 flex-wrap w-full justify-center sm:justify-end">
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={() => cadastrarOuAtualizar(inputValue, baseUrl, idParam, 'Local', "/locais", navigate)}
            >
              Cadastrar
            </Button>
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={limpar}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
