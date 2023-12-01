import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";

export default function VisaoAdministrador() {
  let navigate = useNavigate();

  const medicos = () => {
    navigate("/medicos");
  };
  const tecnicos = () => {
    navigate("/tecnicos");
  };
  const jogadores = () => {
    navigate("/jogadores");
  };
  const estadios = () => {
    navigate("/estadios");
  };
  const partidas = () => {
    navigate("/partidas");
  };
  const temporadas = () => {
    navigate("/temporadas");
  };
  const posicoes = () => {
    navigate("/posicoes");
  };
  const campeonatos = () => {
    navigate("/campeonatos");
  };
  const adversarios = () => {
    navigate("/adversarios");
  };

  return (
    <div>
      <Navbar title="Administrador" />

      <div className="flex flex-col mt-5 justify-between items-center">
        <div></div>
        <div className="m-5">
          <Stack
            spacing={{ xs: 5, sm: 1, md: 10 }}
            direction={{ xs: "column", sm: "row" }}
          >
            <Button
              className="stack-buttons"
              variant="contained"
              onClick={medicos}
              style={{ 
              fontSize: "15px",
              padding: "6px 12px", 
              width: "200px",
              height: "150px"
            }}
            >
              Médicos
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={tecnicos}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Técnicos
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={jogadores}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Jogadores
            </Button>
          </Stack>
        </div>

        <div className="m-5">
          <Stack
            spacing={{ xs: 5, sm: 1, md: 10 }}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <Button
              className="stack-buttons"
              variant="contained"
              onClick={campeonatos}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Campeonatos
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={estadios}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Estádios
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={adversarios}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Times adversários
            </Button>
          </Stack>
        </div>

        <div className="mt-5">
          <Stack
            className="stack-visao"
            spacing={{ xs: 5, sm: 1, md: 10 }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Button
              className="stack-buttons"
              variant="contained"
              onClick={posicoes}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Posições
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={partidas}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Partidas
            </Button>

            <Button
              className="stack-buttons"
              variant="contained"
              onClick={temporadas}
              style={{ 
                fontSize: "15px",
                padding: "6px 12px", 
                width: "200px",
                height: "150px"
              }}
            >
              Temporadas
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
