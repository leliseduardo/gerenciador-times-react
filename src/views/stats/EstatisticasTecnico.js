import React, { useState } from "react";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";

export default function EstatisticasTecnico() {
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
      <Navbar title="Estatísticas do Técnico" />

      <div className="flex flex-wrap md:flex-nowrap items-center gap-2 mt-10 px-10">
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
        <Button
          fullWidth
          sx={{
            height: 56,
          }}
          variant="contained"
          onClick={() => console.log(inputValue)}
        >
          Gerar Relatório
        </Button>
      </div>
      <div className="flex flex-wrap justify-center text-center md:text-start md:grid md:grid-cols-2 gap-10 mt-10">
        <div className="flex flex-col px-10 gap-10">
          <span className="text-4xl">Estatísticas do técnico</span>
          <span className="text-3xl text-gray-600">Nota do último jogo</span>
          <span className="text-3xl text-gray-600">
            Número de substituições
          </span>
          <span className="text-3xl text-gray-600">Cartões</span>
        </div>
        <div className="grid grid-rows-2 gap-2 md:border-l-2">
          <div className="flex flex-col px-10 gap-10">
            <span className="text-4xl">Melhores scouts</span>
            <span className="text-3xl text-gray-600">Cartões vermelhos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
