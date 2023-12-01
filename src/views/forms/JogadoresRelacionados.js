import React, { useCallback, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ListColumn from "../Components/ListColumn";
import { get, set } from "lodash/object";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import { merge } from "lodash";
import { BASE_URL } from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchData ,
  formatArrayForSelect ,
  getDataBasedOnId ,
  groupAndSet ,
} from "../../utils/healpers";
import {mensagemSucesso, mensagemErro} from "../Components/toastr";
import axios from "axios";

const baseUrl = `${BASE_URL}/relacionados`;

export default function JogadoresRelacionados() {
  const [data, setData] = useState({
    temporada: "",
    campeonato: "",
    partida: "",
  });

  const { temporada, campeonato, partida } = data;

  const [seasons, setSeasons] = useState({});
  const [championships, setChampionships] = useState({});
  const [championshipsBySeasons, setChampionshipsBySeasons] = useState({});
  const [matchesByChampionships, setMatchesByChampionships] = useState({});
  const [matches, setMatches] = useState({});
  const [method, setMethod] = useState("store");
  const [lists, setLists] = useState({
    jogadores: {},
    titulares: {},
    reservas: {},
  });
  const { jogadores, titulares, reservas } = lists;

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

    if (name === "campeonato") {
      const matchesByChampionship = get(matchesByChampionships, value, [])
      setMatches(() => formatArrayForSelect(matchesByChampionship, "id", "data"))
      handleChange({ target: { name: "partida", value: "" } })
    }

    if (name === "temporada") {
      const championshipBySeason = get(championshipsBySeasons, value, [])
      setChampionships(() => formatArrayForSelect(championshipBySeason, "id", "nome"))
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  const showPerformance = () => {
    navigate(`/relacionados/${idParam}/performance`);
  };

  async function cadastrar() {
    let item = { ...data };

    set(item, "titulares", Object.keys(titulares))
    set(item, "reservas", Object.keys(reservas))
    set(item, "partidaId", partida)
    delete item.partida

    if (method === "store"){
      await axios.post(`${baseUrl}/partida`, item).then((response) => {
        mensagemSucesso(`Jogadores relacionados com sucesso`);
        navigate(`/visao-tecnico`);
      }).catch(e => {
        mensagemErro(e.request.response)
      });
    }else {
      await axios.put(`${baseUrl}/partida/${idParam}`, item).then((response) => {
        mensagemSucesso(`Jogadores atualizados com sucesso`);
        navigate(`/visao-tecnico`);
      }).catch(e => {
        mensagemErro(e.request.response)
      });
    }
    limpar();
  }

  const limpar = useCallback(() => {
    Object.keys(data).forEach((key) => {
      let value = "";

      handleChange({ target: { name: key, value } });
    });
  }, [data]);

  const mount = async () => {
    const localChampionships = await fetchData(`${BASE_URL}/campeonatos`, "nome", setChampionships)
    const championshipsGroupBySeason = groupAndSet(localChampionships, "temporadaId", setChampionshipsBySeasons)
    setChampionshipsBySeasons(() => championshipsGroupBySeason)
    await fetchData(`${BASE_URL}/temporadas`, "descricao", setSeasons)
    const localMatches = await fetchData(`${BASE_URL}/partidas`, "data", setMatches)
    groupAndSet(localMatches, "campeonatoId", setMatchesByChampionships)
    const localPlayers = await fetchData(`${BASE_URL}/jogadores`, "data", () => {})

    const listPlayers = {}
    localPlayers.forEach(jogador => {
      set(listPlayers, jogador.id, {label: jogador.nome, checked: false})
    })

    setLists((prev) => ({
      ...prev,
      ["jogadores"]: listPlayers,
    }));

    if (idParam !== null && idParam !== undefined) {
      try {
        const localData = await getDataBasedOnId(`${baseUrl}/partida`, idParam, data, handleChange, ["temporada", "campeonato", "partida", "jogadores", "reservas", "titulares"])

        setData((prev) => ({
          ...prev,
          'temporada' : get(localData, "temporada", 0)
        }))
        setData((prev) => ({
          ...prev,
          'campeonato' : get(localData, "campeonato", 0)
        }))
        setData((prev) => ({
          ...prev,
          'partida' : get(localData, "partida", 0)
        }))

        const jogadores = get(localData, "jogadores", {})
        setLists((prev) => ({
          ...prev,
          ["jogadores"]: jogadores,
        }));

        const reservas = get(localData, "reservas", {})
        setLists((prev) => ({
          ...prev,
          ["reservas"]: reservas,
        }));

        const titulares = get(localData, "titulares", {})
        setLists((prev) => ({
          ...prev,
          ["titulares"]: titulares,
        }));

        setMethod(() => "update")
      }catch (error){
        setMethod(() => "store")
      }
    }
  };

  useEffect(() => {
    mount();
  }, []);

  return (
    <div>
      <Navbar title="Jogadores Relacionados" />

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
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
          value={campeonato}
          name="campeonato"
          onChange={handleChange}
        />
        <SelectInput
          items={matches}
          label="Partida"
          value={partida}
          name="partida"
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 mt-10 p-4 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-2">
          <span>Jogadores</span>
          <ListColumn
            name="jogadores"
            handleToggle={handleToggle}
            items={jogadores}
          />
        </div>
        <div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("jogadores", "reservas")}
              disabled={Object.keys(jogadores).length === 0}
              aria-label="move all right"
            >
              Escalar jogador como reserva ≫
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("jogadores", "titulares")}
              disabled={Object.keys(jogadores).length === 0}
              aria-label="move selected right"
            >
              Escalar jogador como titular &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("titulares", "jogadores")}
              disabled={Object.keys(titulares).length === 0}
              aria-label="move selected left"
            >
              Não relacionar titular &lt;
            </Button>
          </div>
          <div className="flex lg:hidden flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("jogadores", "reservas")}
              disabled={Object.keys(jogadores).length === 0}
              aria-label="move all right"
            >
              &dArr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("jogadores", "titulares")}
              disabled={Object.keys(jogadores).length === 0}
              aria-label="move selected right"
            >
              &darr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("titulares", "jogadores")}
              disabled={Object.keys(titulares).length === 0}
              aria-label="move selected left"
            >
              &uarr;
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span>Titulares</span>
          <ListColumn
            name="titulares"
            handleToggle={handleToggle}
            items={titulares}
          />
        </div>
        <div>
          <div className="hidden lg:flex flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservas", "jogadores")}
              disabled={Object.keys(reservas).length === 0}
              aria-label="move all left"
            >
              Não relacionar reserva ≪
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservas", "titulares")}
              disabled={Object.keys(reservas).length === 0}
              aria-label="move selected left"
            >
              Relacionar reserva como titular &lt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("titulares", "reservas")}
              disabled={Object.keys(titulares).length === 0}
              aria-label="move selected right"
            >
              Relacionar titular como reserva &gt;
            </Button>
          </div>
          <div className="flex lg:hidden flex-col items-center justify-center gap-2 h-full">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "players")}
              disabled={Object.keys(reservas).length === 0}
              aria-label="move all left"
            >
              &uArr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("reservePlayers", "startingPlayers")}
              disabled={Object.keys(reservas).length === 0}
              aria-label="move selected left"
            >
              &uarr;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={() => handleChecked("startingPlayers", "reservePlayers")}
              disabled={Object.keys(titulares).length === 0}
              aria-label="move selected right"
            >
              &darr;
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span>Reservas</span>
          <ListColumn
            name="reservas"
            handleToggle={handleToggle}
            items={reservas}
          />
        </div>
      </div>
      <div className="flex flex-wrap w-full justify-center sm:justify-end gap-4 py-4 px-10 sm:px-20 xl:px-48">
        <Button
          sx={{
            height: 56,
          }}
          variant="contained"
          onClick={showPerformance}
        >
          Cadastrar Perfomance do Jogador
        </Button>
        <Button
          sx={{
            height: 56,
          }}
          variant="contained"
          onClick={cadastrar}
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
  );
}
