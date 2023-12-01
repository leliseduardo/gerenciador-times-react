import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import ListColumn from "../Components/ListColumn";
import { get, set } from "lodash/object";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import { merge } from "lodash";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { mensagemSucesso } from "../Components/toastr";

const baseUrl = `${BASE_URL}/jogadores-relacionados`;
let proximoId = 0;
let control = 0;

export default function JogadoresRelacionadosTimeAdversario() {
  const [data, setData] = useState({
    season: "",
    championship: "",
    match: "",
  });

  const { season, championship, match } = data;

  const [seasons, setSeasons] = useState({});
  const [championships, setChampionships] = useState({});
  const [matches, setMatches] = useState({});
  const [lists, setLists] = useState({
    players: {},
    startingPlayers: {},
    reservePlayers: {},
  });
  const { players, startingPlayers, reservePlayers } = lists;

  const not = (a, b) => {
    const entries = Object.entries(a).filter(([key, value]) => {
      return !get(b, key, false);
    });

    return Object.fromEntries(entries);
  };

  const handleToggle = (value, list) => {
    const listObject = get(lists, list, {});
    const isChecked = get(listObject, `${value}.checked`, false);

    if (!isChecked) {
      set(listObject, `${value}.checked`, true);
    } else {
      set(listObject, `${value}.checked`, false);
    }

    setLists((prev) => ({
      ...prev,
      [list]: listObject,
    }));
  };

  const handleChecked = (origem, destino) => {
    let origemState = get(lists, `${origem}`, {});
    let destinoState = get(lists, `${destino}`, {});
    let origemCheckedState = {};
    Object.entries(origemState).map(([key, value]) => {
      const isChecked = get(value, "checked", false);

      if (isChecked) {
        set(value, "checked", false);
        set(origemCheckedState, key, value);
      }
    });

    const newDestino = merge({}, destinoState, origemCheckedState);
    const newOrigem = not(origemState, origemCheckedState);

    setLists((prev) => ({
      ...prev,
      [origem]: newOrigem,
      [destino]: newDestino,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  async function cadastrar() {
    let item = { ...data };

    item = JSON.stringify(item);

    if (idParam == null) {
      await axios.post(baseUrl, item).then((response) => {
        mensagemSucesso(`Jogadores relacionados com sucesso`);
      });
      limpar();
    } else {
      await axios.put(`${baseUrl}/${idParam}`, item).then((response) => {
        mensagemSucesso(`Jogadores relacionados atualizado com sucesso`);
        navigate(`/jogadores-relacionados`);
      });
      limpar();
    }
  }

  const limpar = useCallback(() => {
    Object.keys(data).forEach((key) => {
      let value = "";

      if (key === "id") {
        value = proximoId;
      }
      handleChange({ target: { name: key, value } });
    });
  }, [data]);

  useEffect(() => {
    const mount = async () => {
      if (control === 0) {
        await axios.get(`${BASE_URL}/temporadas`).then((response) => {
          const data = get(response, "data", []);

          data.forEach((item) => {
            setSeasons((prev) => ({
              ...prev,
              [item.id]: item.descricao,
            }));
          });
        });

        await axios.get(`${BASE_URL}/campeonatos`).then((response) => {
          const data = get(response, "data", []);

          data.forEach((item) => {
            setChampionships((prev) => ({
              ...prev,
              [item.id]: item.nome,
            }));
          });
        });

        await axios.get(`${BASE_URL}/partidas`).then((response) => {
          const data = get(response, "data", []);

          data.forEach((item) => {
            setMatches((prev) => ({
              ...prev,
              [item.id]: item.nome,
            }));
          });
        });

        if (idParam == null) {
          await axios.get(baseUrl).then((response) => {
            proximoId = response.data.length + 1;
            handleChange({ target: { name: "id", value: proximoId } });
          });

          await axios.get(`${BASE_URL}/jogadores`).then((response) => {
            const players = get(response, "data", []);
            const listPlayers = {};

            players.forEach((player) => {
              set(listPlayers, player.id, {
                label: player.nome,
                checked: false,
              });
            });

            setLists((prev) => ({
              ...prev,
              ["players"]: listPlayers,
            }));
          });
          limpar();
        } else {
          let localData = {};
          await axios.get(`${baseUrl}/${idParam}`).then((response) => {
            localData = response.data;
          });

          Object.keys(data).forEach((key) => {
            let value = get(localData, key, "");

            handleChange({ target: { name: key, value: value } });
          });

          const listPlayers = {};
          const listStartingPlayers = {};
          const listReservePlayers = {};
          localData.players.forEach((player) => {
            set(listPlayers, player.id, { label: player.nome, checked: false });
          });
          localData.startingPlayers.forEach((player) => {
            set(listStartingPlayers, player.id, {
              label: player.nome,
              checked: false,
            });
          });
          localData.reservePlayers.forEach((player) => {
            set(listReservePlayers, player.id, {
              label: player.nome,
              checked: false,
            });
          });

          setLists((prev) => ({
            ...prev,
            ["players"]: listPlayers,
            ["startingPlayers"]: listStartingPlayers,
            ["reservePlayers"]: listReservePlayers,
          }));
        }
      }
      control++;
    };

    mount();
  }, [idParam, data, limpar]);

  return (
    <div>
      <Navbar title="Jogadores Relacionados" />

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-4 sm:px-10 lg:px-40">
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
        <SelectInput
          items={matches}
          label="Partida"
          value={match}
          name="match"
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-rows-5 lg:grid-cols-5 mt-10  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
        <div className="flex flex-col items-center gap-2">
          <span>Jogadores</span>
          <ListColumn
            name="players"
            handleToggle={handleToggle}
            items={players}
          />
        </div>
        <div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("players", "reservePlayers")}
              disabled={Object.keys(players).length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("players", "startingPlayers")}
              disabled={Object.keys(players).length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("startingPlayers", "players")}
              disabled={Object.keys(startingPlayers).length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </div>
          <div className="lg:hidden flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("players", "reservePlayers")}
              disabled={Object.keys(players).length === 0}
              aria-label="move all right"
            >
              &dArr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("players", "startingPlayers")}
              disabled={Object.keys(players).length === 0}
              aria-label="move selected right"
            >
              &darr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("startingPlayers", "players")}
              disabled={Object.keys(startingPlayers).length === 0}
              aria-label="move selected left"
            >
              &uarr;
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span>Titulares</span>
          <ListColumn
            name="startingPlayers"
            handleToggle={handleToggle}
            items={startingPlayers}
          />
        </div>
        <div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "players")}
              disabled={Object.keys(reservePlayers).length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "startingPlayers")}
              disabled={Object.keys(reservePlayers).length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("startingPlayers", "reservePlayers")}
              disabled={Object.keys(startingPlayers).length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
          </div>
          <div className="lg:hidden flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "players")}
              disabled={Object.keys(reservePlayers).length === 0}
              aria-label="move all left"
            >
              &uArr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "startingPlayers")}
              disabled={Object.keys(reservePlayers).length === 0}
              aria-label="move selected left"
            >
              &uarr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("startingPlayers", "reservePlayers")}
              disabled={Object.keys(startingPlayers).length === 0}
              aria-label="move selected right"
            >
              &darr;
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span>Reservas</span>
          <ListColumn
            name="reservePlayers"
            handleToggle={handleToggle}
            items={reservePlayers}
          />
        </div>
      </div>
    </div>
  );
}
