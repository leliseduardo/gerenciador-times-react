import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get } from "lodash/object";
import {cadastrarOuAtualizar , getDataBasedOnId} from "../../utils/healpers";

const baseUrl = `${BASE_URL}/lesoes`;

export default function CadastroLesao() {
  const [inputValue, setInputValue] = useState({
    id: "",
    nome: "",
    gravidade: "",
    tipo: "",
    tempoMedioDeTratamento: "",
    data: "",
  });

  const { nome, gravidade, tipo, tempoMedioDeTratamento } = inputValue;

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
        <Navbar title="Cadastro Lesão" />

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
          <TextField
            fullWidth
            type="text"
            label="Gravidade Lesão"
            variant="outlined"
            name="gravidade"
            value={gravidade}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="text"
            label="Tipo de lesão"
            variant="outlined"
            name="tipo"
            value={tipo}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="number"
            label="Tempo medio de recuperação"
            variant="outlined"
            name="tempoMedioDeTratamento"
            value={tempoMedioDeTratamento}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <div className="flex gap-2 flex-wrap w-full justify-center sm:justify-end">
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={() => cadastrarOuAtualizar(inputValue, baseUrl, idParam, 'Lesão', "/lesoes", navigate)}
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
