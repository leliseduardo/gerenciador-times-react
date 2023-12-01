import React, { useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";

export default function DadosMedicos() {
  const [inputValue, setInputValue] = useState({
    player: "",
    season: "",
    month: "",
    champion: "",
  });

  const { player, season, month } = inputValue;

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
        <Navbar title="Dados Médicos" />

        <div className=" flex flex-col lg:mt-10 mb-10 justify-center items-center gap-4 p-4 px-10 sm:px-20 xl:px-35">
          <div className="flex w-full gap-2 items-center mb-10">
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={{
                  0: "Yuri Lara",
                  1: "Thiago Rodrigues",
                  2: "Raniel",
                  3: "Andrey Santos",
                  4: "Nenê",
                  5: "Pedro Raul",
                }}
                label="Jogador"
                value={player}
                name="player"
                onChange={handleChange}
              />
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
                  jan: "Janeiro",
                  feb: "Fevereiro",
                  mar: "Março",
                  apr: "Abril",
                  may: "Maio",
                  june: "Junho",
                  july: "Julho",
                  aug: "Agosto",
                  sept: "Setembro",
                  oct: "Outubro",
                  nov: "Novembro",
                  dec: "Dezembro",
                }}
                label="Mês"
                value={month}
                name="month"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row w-full justify-between gap-7">
            <div className="flex flex-col justify-start gap-2">
              <Typography variant="h5">Dados sobre a lesão:</Typography>
              <Typography variant="subtitle1">Dado 1</Typography>
              <Typography variant="subtitle1">Dado 2</Typography>
              <Typography variant="subtitle1">Dado 3</Typography>
              <Typography variant="subtitle1">Dado 4</Typography>
            </div>

            <div className="flex flex-col justify-start gap-2">
              <Typography variant="h5">Características do jogador:</Typography>
              <Typography variant="subtitle1">Característica 1</Typography>
              <Typography variant="subtitle1">Característica 2</Typography>
            </div>
            <div className="flex flex-col justify-start gap-2">
              <Typography variant="h5">Características técnicas:</Typography>
              <Typography variant="subtitle1">
                Característica técnica 1
              </Typography>
              <Typography variant="subtitle1">
                Característica técnica 2
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const optionsSubs = [1, 2, 3, 4, 5];
const optionsYellow = [1, 2];
const optionsRed = [1];
