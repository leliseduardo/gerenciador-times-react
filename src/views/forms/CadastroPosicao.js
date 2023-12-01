import React, { useCallback, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get } from "lodash/object";

const baseUrl = `${BASE_URL}/posicoes`;

export default function CadastroPosicao() {
  const [inputValue, setInputValue] = useState({
    nome: "",
    areaCampo: "",
    ladoCampo: "",
    sigla: "",
  });

  const { nome, areaCampo, ladoCampo, sigla } = inputValue;

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

    console.log(item);

    if (idParam == null) {
      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Posição ${nome} salva com sucesso`);
          navigate("/posicoes");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(`Posição ${nome} atualizada com sucesso`);
          navigate("/posicoes");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    }
  }

  const limpar = () => {
    setInputValue({ nome: "", areaCampo: "", ladoCampo: "", sigla: "" });
  };

  useEffect(() => {
    const mount = async () => {
      if (idParam == null) {
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
        <Navbar title="Cadastro da Posição" />

        <div className="flex flex-col p-4 justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <TextField
            fullWidth
            type="text"
            label="Nome da Posição"
            variant="outlined"
            name="nome"
            value={nome}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="text"
            label="Área da posição"
            variant="outlined"
            name="areaCampo"
            value={areaCampo}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="text"
            label="Lado da Posição"
            variant="outlined"
            name="ladoCampo"
            value={ladoCampo}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="text"
            label="Sigla da Posição"
            variant="outlined"
            name="sigla"
            value={sigla}
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
