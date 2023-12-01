import React , {useEffect , useState} from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import axios from "axios";
import {BASE_URL} from "../../config/axios";
import {get} from "lodash/object";

const PesquisarJogador = () => {
  let navigate = useNavigate();

  const estatisticasJogador = () => {
    navigate("/estatisticas-jogador");
  };
  const dadosMedicos = () => {
    navigate(`/dados-medicos`);
  };

  const [inputValue, setInputValue] = useState({
    player: "",
    season: "",
    championship: "",
  });

  const { player, season, championship } = inputValue;

  const [seasons, setSeasons] = useState({})
  const [championships, setChampionships] = useState({})
  const [players, setPlayers] = useState({})
  const [summaries, setSummaries] = useState([])

  useEffect(() => {
    const mount = async () => {
      await axios.get(`${BASE_URL}/jogadores`).then((response) => {
        const data = get(response, "data", [])

        data.forEach(item => {
          setPlayers((prev) => ({
            ...prev,
            [item.id]: item.name,
          }))
        })
      });

      await axios.get(`${BASE_URL}/temporadas`).then((response) => {
        const data = get(response, "data", [])

        data.forEach(item => {
          setSeasons((prev) => ({
            ...prev,
            [item.id]: item.name,
          }))
        })
      });

      await axios.get(`${BASE_URL}/campeonatos`).then((response) => {
        const data = get(response, "data", [])

        data.forEach(item => {
          setChampionships((prev) => ({
            ...prev,
            [item.id]: item.name,
          }))
        })
      });
    }

    mount()
  }, [inputValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const search = async () => {
    await axios.get(`${BASE_URL}/resumo-jogadores`).then((response) => {
      const data = get(response, "data", [])

      data.forEach(item => {
        setSummaries((prev) => ({
          ...prev,
          [item.id]: item.name,
        }))
      })
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Pesquisar Jogador" />

        <div className="flex flex-col justify-center items-center mb-10 gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <div className="flex w-full gap-2 items-center mb-10">
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={players}
                label="Jogador"
                value={player}
                name="player"
                onChange={handleChange}
              />
              <SelectInput
                items={seasons}
                label="Temporada"
                value={season}
                name="season"
                onChange={handleChange}
              />
              <SelectInput
                items={championships}
                label="Campeonato"
                value={championship}
                name="championship"
                onChange={handleChange}
              />
              <Button
                sx={{
                  height: 56,
                }}
                fullWidth
                variant="contained"
                onClick={search}
              >
                Pesquisar
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-between md:w-full">
            <div className="flex flex-col gap-4 mb-10 md:mb-0">
              <Typography variant="h5">Resumo do jogador:</Typography>
              {/*{ summaries.map(summary => <Typography variant="subtitle1">{summary.description}</Typography>)}*/}
              <Typography variant="subtitle1">Resumo 1</Typography>
              <Typography variant="subtitle1">Resumo 2</Typography>
              <Typography variant="subtitle1">Resumo 3</Typography>
              <Typography variant="subtitle1">Resumo 4</Typography>
            </div>

            <div className="flex flex-col gap-6 justify-center sm:justify-start">
              <Button
                sx={{
                  height: 56,
                }}
                variant="contained"
                onClick={estatisticasJogador}
              >
                Estatísticas do jogador
              </Button>
              <Button
                onClick={dadosMedicos}
                sx={{
                  height: 56,
                }}
                variant="contained"
              >
                Dados médicos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesquisarJogador;
