import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import { useNavigate } from "react-router-dom";

export default function PesquisarPartida() {
  let navigate = useNavigate();

  const estatisticasTime = () => {
    navigate("/estatisticas-time");
  };
  const jogadoresRelacionados = () => {
    navigate("/jogadores-relacionados");
  };
  const timeAdversario = () => {
    navigate("/cadastro-partida");
  };

  const [inputValue, setInputValue] = useState({
    match: "",
    season: "",
    championship: "",
  });

  const { match, season, championship } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Pesquisar Partida" />

        <div className="flex flex-col justify-center items-center mb-10 gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <div className="flex w-full gap-2 items-center mb-10">
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={{
                  2022: "2022",
                  2021: "2021",
                  2020: "2020",
                }}
                label="Temporada"
                value={season}
                name="season"
                onChange={handleChange}
              />
              <SelectInput
                items={{
                  0: "Brasileiro Série A",
                  1: "Libertadores",
                  2: "Copa do Brasil",
                }}
                label="Campeonato"
                value={championship}
                name="championship"
                onChange={handleChange}
              />
              <SelectInput
                items={{
                  0: "10/12",
                  1: "06/12",
                  2: "02/12",
                  3: "28/12",
                  4: "24/12",
                  5: "20/12",
                }}
                label="Partida"
                value={match}
                name="match"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-between md:w-full">
            <div className="flex flex-col gap-4 mb-10 md:mb-0">
              <Typography variant="h5">Resumo da partida:</Typography>
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
                onClick={estatisticasTime}
              >
                Estatísticas do time
              </Button>
              <Button
                sx={{
                  height: 56,
                }}
                variant="contained"
                onClick={jogadoresRelacionados}
              >
                Jogadores relacionados
              </Button>
              <Button
                sx={{
                  height: 56,
                }}
                variant="contained"
                onClick={timeAdversario}
              >
                Time adversário
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
