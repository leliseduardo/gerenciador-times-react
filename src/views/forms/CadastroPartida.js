import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import Button from "@mui/material/Button";
import { BASE_URL } from "../../config/axios";
import { get, set } from "lodash/object";
import {
  cadastrarOuAtualizar ,
  fetchData ,
  formatArrayForSelect ,
  getDataBasedOnId ,
  groupAndSet , setItemsBySelectRelation
} from "../../utils/healpers";
import InputMask from 'react-input-mask';

const baseUrl = `${BASE_URL}/partidas`;

export default function CadastroPartida() {
  let navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    id: "",
    tecnicoId: "",
    temporada: "",
    campeonatoId: "",
    timeAdversarioId: "",
    estadioId: "",
    horario: "",
    data: {},
  });

  const {
    id,
    tecnicoId,
    temporada,
    campeonatoId,
    timeAdversarioId,
    estadioId,
    horario,
    data,
  } = inputValue;

  const [coaches, setCoaches] = useState({});
  const [seasons, setSeasons] = useState({});
  const [championshipsBySeasons, setChampionshipsBySeasons] = useState({});
  const [championships, setChampionships] = useState({});
  const [opposingTeams, setOpposingTeams] = useState({});
  const [stadiums, setStadiums] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "temporada") {
      const championshipBySeason = get(championshipsBySeasons, value, [])
      setChampionships(() => formatArrayForSelect(championshipBySeason, "id", "nome"))
    }

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();

  async function cadastrarPartida() {
    let item = { ...inputValue };
    const localDate = get(item, "data", "");
    const localHorario = get(item, "horario", "");

    set(item, "data", localDate);
    set(item, "horario", `${localDate}T${localHorario}:00.000`);

    cadastrarOuAtualizar(item, baseUrl, idParam, `Partida contra ${timeAdversarioId}`, "/partidas", navigate)
  }

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach((key) => {
      let value = "";

      handleChange({ target: { name: key, value } });
    });
  }, [inputValue]);

  useEffect(() => {
    const mount = async () => {
      await fetchData(`${BASE_URL}/tecnicos`, "nome", setCoaches)

      const localChampionships = await fetchData(`${BASE_URL}/campeonatos`, "nome", setChampionships)
      const championshipsGroupBySeason = groupAndSet(localChampionships, "temporadaId", setChampionshipsBySeasons)
      await fetchData(`${BASE_URL}/temporadas`, "descricao", setSeasons)
      await fetchData(`${BASE_URL}/times-adversarios`, "nome", setOpposingTeams)
      await fetchData(`${BASE_URL}/estadios`, "nome", setStadiums)

      if (idParam !== null && idParam !== undefined) {
        const localData = await getDataBasedOnId(baseUrl, idParam, inputValue,handleChange, ["temporada"])

        setItemsBySelectRelation(localData, "temporada", localChampionships, "campeonatoId", "nome", championshipsGroupBySeason, setChampionships, setInputValue)
      }
    };

    mount();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro de Partida" />

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <SelectInput
            items={coaches}
            label="Técnicos"
            value={tecnicoId}
            name="tecnicoId"
            onChange={handleChange}
          />
          <SelectInput
            items={seasons}
            label="Temporada"
            value={temporada}
            name="temporada"
            onChange={handleChange}
          />
          <SelectInput
            items={championships}
            label="Campeonato"
            value={campeonatoId}
            name="campeonatoId"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col p-4 justify-center items-center gap-4 md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-evenly w-full gap-4 mb-5">
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-col items-center gap-2 w-full sm:w-64">
                <Avatar
                  sx={{ width: 140, height: 140 }}
                  src="/vasco-logo-1.png"
                />

                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    disabled
                    id="demo-simple-select"
                    label="Time Usuário"
                  ></TextField>
                </FormControl>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex flex-col items-center gap-2 w-full sm:w-64">
                <Avatar sx={{ width: 140, height: 140 }} />

                <SelectInput
                  items={opposingTeams}
                  label="Time adversário"
                  value={timeAdversarioId}
                  name="timeAdversarioId"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
            <TextField
              fullWidth
              type="date"
              label="Data"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              name="data"
              value={data}
              onChange={handleChange}
            />
            <InputMask
              mask="99:99"
              placeholder="00:00"
              value={horario}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                fullWidth
                type="text"
                label="Hora"
                name="horario"
                variant="outlined"
                {...inputProps}
                />
              )}
            </InputMask>
            <SelectInput
              items={stadiums}
              label="Estádio"
              value={estadioId}
              name="estadioId"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 p-4 mb-5">
          <Button
            sx={{
              height: 56,
            }}
            variant="contained"
            onClick={cadastrarPartida}
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
