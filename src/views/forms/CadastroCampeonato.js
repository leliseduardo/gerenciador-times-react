import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get, set } from "lodash/object";
import SelectInput from "../Components/inputs/SelectInput";

const baseUrl = `${BASE_URL}/campeonatos`;
let proximoId = 0;

export default function CadastroCampeonato() {
  const [inputValue, setInputValue] = useState({
    id: "",
    nome: "",
    dataInicio: "",
    dataFim: "",
    campeao: "",
    temporadaId: "",
    data: "",
  });

  const [temporadas, setTemporada] = useState({});

  const { id, nome, dataInicio, dataFim, campeao, temporadaId, data } =
    inputValue;

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
    let item = { ...inputValue };

    if (idParam == null) {
      console.log(item);
      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Campeonato ${nome} salvo com sucesso`);
          navigate(`/campeonatos`);
        })
        .catch(() => {
          mensagemErro("Preencha os campos corretamente");
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(`Campeonato ${nome} atualizado com sucesso`);
          navigate(`/campeonatos`);
        })
        .catch(() => {
          mensagemErro("Preencha os campos corretamente");
        });
      limpar();
    }
  }

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach((key) => {
      let value = "";

      if (key === "id") {
        value = proximoId;
      }
      handleChange({ target: { name: key, value } });
    });
  }, [inputValue]);

  useEffect(() => {
    const mount = async () => {
      await axios.get(`${BASE_URL}/temporadas`).then((response) => {
        let localTemporadas = {};

        response.data.forEach((localTemporada) => {
          set(localTemporadas, localTemporada.id, localTemporada.descricao);
        });

        setTemporada((prev) => localTemporadas);
      });
      if (idParam == null) {
        limpar();
      } else {
        let localData = {};
        await axios.get(`${baseUrl}/${idParam}`).then((response) => {
          localData = response.data;
          handleChange({ target: { name: "data", value: localData } });
        });

        Object.keys(inputValue).forEach((key) => {
          let value = get(localData, key, "");

          handleChange({ target: { name: key, value: value } });
        });
      }
    };

    mount();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro de Campeonato" />

        <div className="flex flex-col justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <TextField
            fullWidth
            type="text"
            label="Nome do Campeonato"
            variant="outlined"
            value={nome}
            name="nome"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Data de ínicio"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={dataInicio}
            name="dataInicio"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="date"
            label="Data de Término"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={dataFim}
            name="dataFim"
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="text"
            label="Campeão"
            variant="outlined"
            value={campeao}
            name="campeao"
            onChange={handleChange}
          />
          <SelectInput
            items={temporadas}
            value={temporadaId}
            name="temporadaId"
            label="Temporada"
            onChange={handleChange}
          />
          <div className="flex gap-2 w-full justify-center sm:justify-end">
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
