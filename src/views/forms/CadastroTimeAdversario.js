import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { BASE_URL } from "../../config/axios";
import axios from "axios";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { get } from "lodash/object";

const baseUrl = `${BASE_URL}/times-adversarios`;
let proximoId = 0;
let control = 0;

export default function CadastroTimeAdversario() {
  const [inputValue, setInputValue] = useState({
    id: "",
    nome: "",
    photoPath: "",
    data: {},
  });

  const { nome, photoPath } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();

  async function cadastrar() {
    let item = { ...inputValue };

    if (idParam == null) {
      console.log(item);
      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Cadastro Time Adversario ${nome} salva com sucesso`);
          navigate("/adversarios");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    } else {
      await axios
        .put(`${baseUrl}/${idParam}`, item)
        .then((response) => {
          mensagemSucesso(
            `Cadastro Time Adversario ${nome} atualizada com sucesso`
          );
          navigate("/adversarios");
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

  let navigate = useNavigate();

  const cadastroJogadorAdversario = () => {
    navigate("/cadastro-jogador-adversario");
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro de Time Adversário" />

        <div className="flex flex-col p-4 justify-center items-center gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <TextField
            fullWidth
            type="text"
            label="Nome do Time"
            variant="outlined"
            name="nome"
            value={nome}
            onChange={handleChange}
          />
          <div className="ml-3 sm:ml-6">
            <Button variant="contained" component="label">
              Upload
              <input
                hidden
                accept="image/*"
                type="file"
                name="photoPath"
                onChange={handleChange}
              />
            </Button>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                name="picture"
                onChange={handleChange}
              />
              <PhotoCamera />
            </IconButton>
          </div>

          <div className="flex flex-wrap w-full justify-center gap-4">
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
