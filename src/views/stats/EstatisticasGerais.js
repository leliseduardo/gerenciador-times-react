import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function EstatisticasGerais() {
  let navigate = useNavigate();

  const estatisticasJogador = () => {
    navigate("/estatisticas-jogador");
  };
  const estatisticasTime = () => {
    navigate("/estatisticas-time");
  };
  const estatisticasTecnico = () => {
    navigate("/estatisticas-tecnico");
  };

  return (
    <div>
      <Navbar title="Estatísticas" />

      <div className="flex flex-col justify-center lg:grid lg:grid-cols-3 p-10">
        <div className="flex flex-col justify-center text-center lg:text-start col-span-2 gap-8 mb-10">
          <span className="text-3xl font-bold">Resumo geral:</span>
          <span className="text-gray-600 text-2xl">Nota do último jogo</span>
          <span className="text-gray-600 text-2xl">
            Nota média da temporada
          </span>
          <span className="text-gray-600 text-2xl">
            Nota média dos jogadores
          </span>
          <span className="text-gray-600 text-2xl">Nota média do técnico</span>
          <span className="text-gray-600 text-2xl">Jogadores machucados</span>
          <span className="text-gray-600 text-2xl">Jogadores suspensos</span>
          <span className="text-gray-600 text-2xl">Gols na temporada</span>
          <span className="text-gray-600 text-2xl">
            Gols sofridos na temporada
          </span>
        </div>
        <div className="flex flex-col items-center lg:pl-12 lg:border-l-2">
          <span className="text-3xl font-bold">Mais opções</span>
          <div className="flex flex-col gap-6 justift-center mt-10">
            <Button
              sx={{
                height: 125,
                width: 250,
              }}
              variant="contained"
              onClick={estatisticasJogador}
            >
              Estatísticas de jogadores
            </Button>

            <Button
              sx={{
                height: 125,
                width: 250,
              }}
              variant="contained"
              onClick={estatisticasTime}
            >
              Estatísticas do time
            </Button>

            <Button
              sx={{
                height: 125,
                width: 250,
              }}
              variant="contained"
              onClick={estatisticasTecnico}
            >
              Estatísticas do técnico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
