import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import estados from "../../config/uf";
import SelectInput from "../Components/inputs/SelectInput";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get } from "lodash/object";
import InputMask from 'react-input-mask';

const baseUrl = `${BASE_URL}/estadios`;
let proximoId = 0;
let control = 0;

export default function CadastroEstadio() {
  const [inputValue, setInputValue] = useState({
    id: "",
    nome: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    uf: "",
    cidade: "",
    data: "",
  });
  const { id, nome, cep, logradouro, numero, bairro, uf, cidade, data } =
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
      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Estádio ${nome} salvo com sucesso`);
          navigate("/estadios");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(`Estádio ${nome} atualizado com sucesso`);
          navigate("/estadios");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
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
      if (idParam == null) {
        await axios.get(baseUrl).then((response) => {
          proximoId = response.data.length + 1;
          handleChange({ target: { name: "id", value: proximoId } });
        });

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
      <Navbar title="Cadastro Estádio" />

      <div className="flex flex-col p-4 justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
        <TextField
          fullWidth
          type="text"
          label="Nome do estádio"
          variant="outlined"
          value={nome}
          name="nome"
          onChange={handleChange}
        />
        <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
        <InputMask
              mask="99999-999"
              placeholder="00000-000"
              value={cep}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                fullWidth
                type="text"
                label="CEP"
                variant="outlined"
                name="cep"
              />
              )}
            </InputMask>
        </div>
        <TextField
          fullWidth
          type="text"
          label="Logradouro"
          variant="outlined"
          value={logradouro}
          name="logradouro"
          onChange={handleChange}
        />
        <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
          <TextField
            fullWidth
            type="text"
            label="Cidade"
            name="cidade"
            value={cidade}
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
          <TextField
            fullWidth
            type="text"
            label="Bairro"
            variant="outlined"
            value={bairro}
            name="bairro"
            onChange={handleChange}
          />
          <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
            <SelectInput
              items={estados}
              value={uf}
              name="uf"
              label="UF"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="number"
              label="Número"
              variant="outlined"
              value={numero}
              name="numero"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </div>
        </div>

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
  );
}
