import Navbar from "../Components/Navbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { BASE_URL } from "../../config/axios";
import { get } from "lodash/object";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";

const baseUrl = `${BASE_URL}/partidas`;

const ListaPartidas = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [opposingTeams, setOpposingTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setMatches(response.data);
    });

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
        setCampeonatos((prev) => ({
          ...prev,
          [item.id]: { ...item },
        }));
      });
    });

    await axios.get(`${BASE_URL}/times-adversarios`).then((response) => {
      const data = get(response, "data", []);

      data.forEach((item) => {
        setOpposingTeams((prev) => ({
          ...prev,
          [item.id]: item.nome,
        }));
      });
    });

    await axios.get(`${BASE_URL}/estadios`).then((response) => {
      const data = get(response, "data", []);

      data.forEach((item) => {
        setStadiums((prev) => ({
          ...prev,
          [item.id]: item.nome,
        }));
      });
    });
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

  const getSeason = (campeonatoId) => {
    const campeonato = get(campeonatos, campeonatoId, "");
    const seasonId = get(campeonato, "temporadaId", "");
    return get(seasons, seasonId, "");
  };
  const getChampionship = (id) => {
    return get(championships, id, "");
  };

  const add = () => {
    navigate("/cadastro-partida");
  };

  const edit = (id) => {
    navigate(`/cadastro-partida/${id}`);
  };

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
      <Navbar title="Lista de Partidas" />
      <div className="flex justify-end px-12 pt-10">
        <button onClick={add} className="bg-blue-600 text-white p-2 rounded-lg">
          Adicionar
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
                {/* <TableCell align={"center"}>Temporada</TableCell> */}
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
                  {/* <TableCell align={"center"}>
                    {getSeason(match.campeonatoId)}
                  </TableCell> */}
                  <TableCell align={"center"}>
                    {getChampionship(match.campeonatoId)}
                  </TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(match.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(match.id)}
                        className="bg-red-600 text-white p-2 rounded-lg"
                      >
                        Remover
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListaPartidas;
