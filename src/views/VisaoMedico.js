import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Navbar from "./Components/Navbar";
import { useNavigate } from "react-router-dom";

export default function VisaoMedico() {
  let navigate = useNavigate();

  const lesoes = () => {
    navigate("/lesoes");
  };

  const locais = () => {
    navigate("/locais");
  };

  const lesoesJogadores = () => {
    navigate("/lesoes-jogadores");
  };

  return (
    <div>
      <Navbar title="Médico" />

      <div className="flex flex-col mt-10 justify-between items-center gap-4">
        <div className="m-5">
          <Stack
            spacing={{ xs: 5, sm: 1, md: 10 }}
            direction={{ xs: "column", sm: "row" }}
          >
            <Button
              className="stack-buttons buttons-medico"
              variant="contained"
              onClick={lesoes}
              style={{
                fontSize: "15px",
                padding: "6px 12px",
                width: "200px",
                height: "150px",
              }}
            >
              Lesões
            </Button>

            <Button
              className="stack-buttons buttons-medico"
              variant="contained"
              onClick={locais}
              style={{
                fontSize: "15px",
                padding: "6px 12px",
                width: "200px",
                height: "150px"
              }}
            >
              Locais das lesões
            </Button>

            <Button
              className="stack-buttons buttons-medico"
              variant="contained"
              onClick={lesoesJogadores}
              style={{
                fontSize: "15px",
                padding: "6px 12px",
                width: "200px",
                height: "150px",
              }}
            >
              Jogadores Lesionados
            </Button>
          </Stack>
        </div>
      </div>
    </div>
  );
}
