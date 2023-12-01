import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import SelectInput from "../Components/inputs/SelectInput";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import uf from "../../config/uf";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get } from "lodash/object";
import InputMask from 'react-input-mask';

const baseUrl = `${BASE_URL}/medicos`;
let proximoId = 0;

export default function CadastroMedico() {
  const [inputValue, setInputValue] = useState({
    id: "",
    ativo: true,
    nome: "",
    email: "",
    dataNascimento: "",
    registro: "",
    nacionalidade: "",
    cpf: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    estado: "",
    cidade: "",
    data: {},
  });
  const {
    id,
    ativo,
    nome,
    email,
    dataNascimento,
    registro,
    nacionalidade,
    cpf,
    telefone,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    estado,
    cidade,
    data,
  } = inputValue;

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
          mensagemSucesso(`Médico ${nome} salvo com sucesso`);
          navigate("/medicos");
        })
        .catch(() => {
          mensagemErro(`Preencha todos os campos corretamente`);
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(`Médico ${nome} atualizado com sucesso`);
          navigate(`/cadastro-medico`);
          navigate("/medicos");
        })
        .catch(() => {
          mensagemErro(`Preencha todos os campos corretamente`);
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
      if (idParam != null) {
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
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro de Médico" />

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
            type="email"
            label="Email"
            variant="outlined"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <div className="flex flex-wrap w-full gap-2 items-center sm:flex-nowrap">
            <TextField
              fullWidth
              type="date"
              label="Data de nascimento"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              name="dataNascimento"
              value={dataNascimento}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="text"
              label="Nacionalidade"
              variant="outlined"
              name="nacionalidade"
              value={nacionalidade}
              onChange={handleChange}
            />
            <InputMask
        mask="9999999/aa"
        value={registro}
        onChange={handleChange}
      >
        {(inputProps) => (
            <TextField
            fullWidth
            type="text"
            label="CRM"
            variant="outlined"
            name="registro"
            {...inputProps}
          />
            )}
          </InputMask>
            
            <InputMask
        mask="999.999.999-99"
        placeholder="000.000.000-00"
        value={cpf}
        onChange={handleChange}
      >
        {(inputProps) => (
            <TextField
              fullWidth
              type="text"
              label="CPF"
              variant="outlined"
              name="cpf"
              {...inputProps}
              />
            )}
          </InputMask>

          </div>
          <div className="flex flex-wrap w-full gap-2 items-center sm:flex-nowrap">
          <InputMask
        mask="(99) 99999-9999"
        placeholder="(00) 00000-0000"
        value={telefone}
        onChange={handleChange}
      >
        {(inputProps) => (
          <TextField
            fullWidth
            type="tel"
            label="Telefone"
            variant="outlined"
            name="telefone"
            {...inputProps}
          />
        )}
      </InputMask>

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
          <TextField
            fullWidth
            type="text"
            label="Logradouro"
            variant="outlined"
            name="logradouro"
            value={logradouro}
            onChange={handleChange}
          />
          <div className="flex flex-wrap w-full gap-2 items-center sm:flex-nowrap">
            <TextField
              fullWidth
              type="number"
              label="Número"
              variant="outlined"
              name="numero"
              value={numero}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="text"
              label="Complemento"
              variant="outlined"
              name="complemento"
              value={complemento}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2 items-center sm:flex-nowrap">
            <TextField
              fullWidth
              type="text"
              label="Bairro"
              variant="outlined"
              name="bairro"
              value={bairro}
              onChange={handleChange}
            />
            <div className="flex flex-wrap w-full gap-2 sm:flex-nowrap">
              <SelectInput
                items={uf}
                value={estado}
                name="estado"
                label="UF"
                onChange={handleChange}
              />
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
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-end">
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
