import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import TextField from "@mui/material/TextField";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get, set } from "lodash/object";
import {cadastrarOuAtualizar , fetchData , getDataBasedOnId} from "../../utils/healpers";

const baseUrl = `${BASE_URL}/lesoes-jogador`;

export default function CadastroLesaoJogador() {
  const [inputValue, setInputValue] = useState({
    ativo: true,
    dataLesao: "",
    jogadorId: "",
    lesaoId: "",
    localId: "",
    dataDaAlta: "",
    medicoResponsavelId: "",
  });
  const { ativo, dataLesao, jogadorId, lesaoId, localId, dataDaAlta, medicoResponsavelId } =
    inputValue;
  const [jogadores, setJogadores] = useState([]);
  const [lesoes, setLesoes] = useState([]);
  const [locais, setLocais] = useState([]);
  const [medicos, setMedicos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  async function cadastrar() {
    const item = { ...inputValue };

    set(item, "idJogador", parseInt(get(item, "idJogador")));
    set(item, "idLesao", parseInt(get(item, "idLesao")));
    set(item, "idMedico", parseInt(get(item, "idMedico")));

    cadastrarOuAtualizar(item, baseUrl, idParam, `Lesão de ${jogadores[jogadorId]}`, "/lesoes-jogadores", navigate)
  }

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach((key) => {
      handleChange({ target: { name: key, value: "" } });
    });
  }, [inputValue]);

  useEffect(() => {
    const mount = async () => {
      await fetchData(`${BASE_URL}/jogadores`, "nome", setJogadores)
      await fetchData(`${BASE_URL}/lesoes`, "nome", setLesoes)
      await fetchData(`${BASE_URL}/locais`, "nome", setLocais)
      await fetchData(`${BASE_URL}/medicos`, "nome", setMedicos)

      if (idParam !== null  && idParam !== undefined) {
        await getDataBasedOnId(baseUrl, idParam, inputValue, handleChange)
      }
    };

    mount();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro Lesao no jogador" />

        <div className="flex flex-col justify-center items-center gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <SelectInput
            items={jogadores}
            value={jogadorId}
            label="Jogador"
            name="jogadorId"
            onChange={handleChange}
          />
          <SelectInput
            items={lesoes}
            label="Lesão"
            value={lesaoId}
            name="lesaoId"
            onChange={handleChange}
          />
          <SelectInput
            items={locais}
            label="Local"
            value={localId}
            name="localId"
            onChange={handleChange}
          />
          <SelectInput
            items={medicos}
            label="Médico"
            value={medicoResponsavelId}
            name="medicoResponsavelId"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Data da entrada"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            name="dataLesao"
            value={dataLesao}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Data da Alta"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            name="dataDaAlta"
            value={dataDaAlta}
            onChange={handleChange}
          />

          <div className="flex gap-2 flex-wrap w-full justify-center sm:justify-end">
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={cadastrar}
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
