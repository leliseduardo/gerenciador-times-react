import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import uf from "../../config/uf";
import SelectInput from "../Components/inputs/SelectInput";
import axios from "axios";
import { BASE_URL } from "../../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get, set } from "lodash/object";
import { join, split } from "lodash";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputMask from 'react-input-mask';

const baseUrl = `${BASE_URL}/jogadores`;
let proximoId = 0;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CadastroJogador(callback, deps) {
  const [posicoes, setPosicoes] = useState([]);
  const [posicoesId, setPosicoesId] = useState([]);
  const [inputValue, setInputValue] = useState({
    id: "",
    ativo: true,
    nome: "",
    peso: "",
    altura: "",
    email: "",
    dataNascimento: "",
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
    ids_posicoes: [],
  });
  const {
    id,
    ativo,
    nome,
    peso,
    altura,
    email,
    dataNascimento,
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
    ids_posicoes,
  } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSelect = (e) => {
    const { value } = e.target;
    setPosicoesId(typeof value === "string" ? value.split(",") : value);
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  async function cadastrar() {
    let item = { ...inputValue };
    set(item, "peso", parseFloat(get(item, "peso")));
    set(item, "altura", parseFloat(get(item, "altura")));
    set(item, "numero", parseFloat(get(item, "numero")));
    set(item, "ids_posicoes", posicoesId);

    console.log(item);

    if (idParam == null) {
      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Jogador ${nome} salvo com sucesso`);
          navigate(`/jogadores`);
        })
        .catch(() => {
          mensagemErro(`Preencha todos os campos corretamente`);
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(`Jogador ${nome} atualizado com sucesso`);
          navigate(`/jogadores`);
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
      await axios.get(`${BASE_URL}/posicoes`).then((response) => {
        setPosicoes(response.data);
      });

      if (idParam == null) {
      } else {
        let localData = {};
        await axios.get(`${baseUrl}/${idParam}`).then((response) => {
          localData = response.data;
          handleChange({ target: { name: "data", value: localData } });
          setPosicoesId(response.data.ids_posicoes);
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
        <Navbar title="Cadastro de Jogador" />

        <div className="flex flex-col p-4 justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <TextField
            fullWidth
            type="text"
            label="Nome"
            name="nome"
            value={nome}
            variant="outlined"
            onChange={handleChange}
          />
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel id="demo-multiple-name-label" className="w-full">
                Posição
              </InputLabel>
              <Select
                fullWidth
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={posicoesId}
                onChange={handleChangeSelect}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {posicoes.map((posicao) => (
                  <MenuItem key={posicao.nome} value={posicao.id}>
                    {posicao.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            fullWidth
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            name="email"
            onChange={handleChange}
          />

          <div className="flex flex-wrap w-full gap-2 items-center sm:flex-nowrap">
          <InputMask
        mask="999 kg"
        value={peso}
        onChange={handleChange}
      >
        {(inputProps) => (
             <TextField
             fullWidth
             type="peso"
             label="Peso"
             variant="outlined"
             name="peso"
          
           {...inputProps}
           />
         )}
       </InputMask>
            
            <InputMask
        mask="9.99 metro(s)"
        placeholder="Ex: 1.72 metro(s)"
        value={altura}
        onChange={handleChange}
      >
        {(inputProps) => (
             <TextField
             fullWidth
             type="text"
             label="Altura"
             variant="outlined"
             name="altura"
           {...inputProps}
           />
         )}
       </InputMask>
          </div>
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
                onChange={handleChange}
                variant="outlined"
                name="cidade"
                value={cidade}
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
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={uf}
                value={estado}
                name="estado"
                label="Estado"
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
          <div className="flex flex-wrap w-full justify-center sm:justify-end gap-4 ">
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
