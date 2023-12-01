import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  cadastrarOuAtualizar ,
  fetchData , formatArrayForSelect ,
  getDataBasedOnId ,
  groupAndSet , setItemsBySelectRelation
} from "../../utils/healpers";
import {get} from "lodash/object";

const baseUrl = `${BASE_URL}/scouts-partida`;
let proximoId = 0;

export default function CadastroPerfomanceTimePardida() {
  const [temporadas, setTempordas] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [campeonatosPorTemporadas, setCampeonatosPorTemporadas] = useState([]);
  const [partidasPorCampeonatos, setPartidasPorCampeonatos] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [inputValue, setInputValue] = useState({
    posseDeBola: "",
    impedimentos: "",
    cruzamentos: "",
    escanteios: "",
    gols: "",
    golsTimeAdversario: "",
    partidaId: "",
    campeonato: "",
    temporada: "",
  });

  const {
    posseDeBola,
    impedimentos,
    cruzamentos,
    escanteios,
    gols,
    golsTimeAdversario,
    temporada,
    campeonato,
    partidaId,
  } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name === "campeonato"){
      const partidasPorCampeonato = get(partidasPorCampeonatos, value, [])
      setPartidas(() => formatArrayForSelect(partidasPorCampeonato, "id", "data"))
      handleChange({ target: { name: "partidaId", value: "" } })
    }

    if (name === "temporada") {
      const campeonatosPorTemporada = get(campeonatosPorTemporadas, value, [])
      setCampeonatos(() => formatArrayForSelect(campeonatosPorTemporada, "id", "nome"))
      handleChange({ target: { name: "campeonato", value: "" } })
    }

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

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
      const localCampeonatos = await fetchData(`${BASE_URL}/campeonatos`, "nome", setCampeonatos)
      const campeonatosAgrupadoPorTemporda = groupAndSet(localCampeonatos, "temporadaId", setCampeonatosPorTemporadas)
      await fetchData(`${BASE_URL}/temporadas`, "descricao", setTempordas)
      const localPartidas = await fetchData(`${BASE_URL}/partidas`, "data", setPartidas)
      const partidasAgrupadasPorCampeonato = groupAndSet(localPartidas, "campeonatoId", setPartidasPorCampeonatos)

      if (idParam !== null && idParam !== undefined) {
        const localData = await getDataBasedOnId(baseUrl, idParam, inputValue, handleChange, ["temporada", "campeonato"])

        const partida = setItemsBySelectRelation(localData, "campeonato", localPartidas, "partidaId", "data", partidasAgrupadasPorCampeonato, setPartidas, setInputValue)
        setItemsBySelectRelation(partida, "temporada", localCampeonatos, "campeonatoId", "nome", campeonatosAgrupadoPorTemporda, setCampeonatos, setInputValue)
      }
    };

    mount();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro Performance Time na Partida" />

        <div className=" flex flex-col justify-center items-center gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <SelectInput
            items={temporadas}
            label="Temporada"
            value={temporada}
            name="temporada"
            onChange={handleChange}
          />
          <SelectInput
            items={campeonatos}
            label="Campeonato"
            value={campeonato}
            name="campeonato"
            onChange={handleChange}
          />
          <SelectInput
            items={partidas}
            label="Partida"
            value={partidaId}
            name="partidaId"
            onChange={handleChange}
          />
          <div className="flex flex-col gap-2 w-full justify-end">
            <h1 className="mt-10 mb-5 text-2xl font-bold self-center sm:self-start">
              Scouts
            </h1>
            <TextField
              fullWidth
              type="number"
              label="Gols"
              variant="outlined"
              value={gols}
              name="gols"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Gols do Time Adversário"
              variant="outlined"
              value={golsTimeAdversario}
              name="golsTimeAdversario"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Posse de bola"
              variant="outlined"
              value={posseDeBola}
              name="posseDeBola"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Impedimentos"
              variant="outlined"
              value={impedimentos}
              name="impedimentos"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Cruzamentos"
              variant="outlined"
              value={cruzamentos}
              name="cruzamentos"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Escanteios"
              variant="outlined"
              value={escanteios}
              name="escanteios"
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-end">
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={() => cadastrarOuAtualizar(inputValue, baseUrl, idParam, 'Performance do time na partida', "/performance-time-partidas", navigate)}
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
