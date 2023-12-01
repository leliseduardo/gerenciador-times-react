import React , {useEffect , useState} from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Navbar from "./Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../config/axios";
import {get} from "lodash/object";
import {mensagemErro , mensagemSucesso} from "./Components/toastr";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {fetchData} from "../utils/healpers";

const baseUrl = `${BASE_URL}/partidas`;

export default function VisaoTecnico() {

  // const performanceJogadores = () => {
  //   navigate("/performance-jogadores");
  // };
  // const performanceTimePartidas = () => {
  //   navigate("/performance-time-partidas");
  // };
  // const relacionarJogadores = () => {
  //   navigate("/jogadores-relacionados");
  // };
  // const pesquisarJogador = () => {
  //   navigate("/pesquisar-jogador");
  // };
  // const pesquisarPartida = () => {
  //   navigate("/pesquisar-partida");
  // };
  // const estatisticasGerais = () => {
  //   navigate("/estatisticas-gerais");
  // };

  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [opposingTeams, setOpposingTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [championships, setChampionships] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setMatches(response.data);
    });

    await fetchData(`${BASE_URL}/temporadas`, "descricao", setSeasons)
    await fetchData(`${BASE_URL}/campeonatos`, "nome", setChampionships)
    await fetchData(`${BASE_URL}/times-adversarios`, "nome", setOpposingTeams)
    await fetchData(`${BASE_URL}/estadios`, "nome", setStadiums)
  };

  useEffect(() => {
    mount();
  }, []);

  const getOpposingTeam = (id) => {
    return get(opposingTeams, id, "");
  };

  const getStadium = (id) => {
    return get(stadiums, id, "");
  };

  const getChampionship = (id) => {
    return get(championships, id, "");
  };

  const show = (id) => {
    navigate(`/relacionados/${id}`);
  };

  const showPerformanceTime = () => {
    navigate('/performance-time-partidas');
  }

  const showPerformanceJogadores = () => {
    navigate('/performance-jogadores');
  }

  const deleteItem = async (id) => {
    await axios
      .delete(`${baseUrl}/${id}`)
      .then((response) => {
        if (response.data != null)
          mensagemSucesso(`Partida ${id} excluida com sucesso`);
        mount();
      })
      .catch(() => {
        mensagemErro(
          "Não foi possível excluir a partida. Ela encontra-se vinculada a outro cadastro no sistema."
        );
      });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Técnico" />

      <div className="flex justify-end items-center mt-4 gap-4 px-12 ">
        <button onClick={showPerformanceTime} className="bg-blue-600 text-white p-2 rounded-lg">
          Performances do time nas partidas
        </button>

        <button onClick={showPerformanceJogadores} className="bg-blue-600 text-white p-2 rounded-lg">
          Performances dos jogadores nas partidas
        </button>
      </div>

      <div className="flex justify-center w-full h-full px-12 pt-10 pb-24">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Time Adversario</TableCell>
                <TableCell align={"center"}>Data</TableCell>
                <TableCell align={"center"}>Hora</TableCell>
                <TableCell align={"center"}>Estádio</TableCell>
                <TableCell align={"center"}>Campeonato</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow
                  key={match.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align={"center"}>
                    {getOpposingTeam(match.timeAdversarioId)}
                  </TableCell>
                  <TableCell align={"center"}>{match.data}</TableCell>
                  <TableCell align={"center"}>{match.horario}</TableCell>
                  <TableCell align={"center"}>
                    {getStadium(match.estadioId)}
                  </TableCell>
                  <TableCell align={"center"}>
                    {getChampionship(match.campeonatoId)}
                  </TableCell>
                  <TableCell align={"center"}>
                    <button
                      onClick={() => show(match.id)}
                      className="bg-gray-600 text-white p-2 rounded-lg"
                    >
                      Relacionar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
