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
import { get } from "lodash/object";
import axios from "axios";
import { BASE_URL } from "../../config/axios";
import {mensagemErro , mensagemSucesso} from "../Components/toastr";

const baseUrl = `${BASE_URL}/scouts-jogador`;
const baseUrlJogador = `${BASE_URL}/jogadores`;
const baseUrltemporada = `${BASE_URL}/temporadas`;
const baseUrlcampeonato = `${BASE_URL}/campeonatos`;
const baseUrlpartida = `${BASE_URL}/partidas`;
const baseUrlRelacionados = `${BASE_URL}/relacionados`;

const ListaPerformanceJogadores = () => {
  const navigate = useNavigate();
  const [scouts, setScoutJogador] = useState([]);
  const [jogador, setJogador] = useState([]);
  const [temporada, setTemporada] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [partidas, setPartida] = useState([]);
  const [relacionados, setRelacionados] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setScoutJogador(response.data);
      console.log("Scouts Jogadores");
      console.log(response.data);
    });

    await axios.get(baseUrlJogador).then((response) => {
      setJogador(response.data);
      console.log("jogador");
      console.log(response.data);
    });

    await axios.get(`${BASE_URL}/temporadas`).then((response) => {
      const data = get(response, "data", []);

      data.forEach((item) => {
        setTemporada((prev) => ({
          ...prev,
          [item.id]: item.descricao,
        }));
      });
    });

    await axios.get(baseUrlcampeonato).then((response) => {
      setChampionships(response.data);
      console.log("campeonato");
      console.log(response.data);
    });

    /*await axios.get(baseUrlpartida).then((response) => {
      const data = get(response, "data", []);

      setPartida(response.data);
      console.log("partida");
      console.log(response.data);
    });
    data.forEach((item) => {
      setPartida((prev) => ({
        ...prev,
        [item.id]: item.nome,
      }));
  });*/

    await axios.get(baseUrlRelacionados).then((response) => {
      setRelacionados(response.data);
      console.log("partida");
      console.log(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const getChampionship = (id) => {
    return get(championships, id, "");
  };

  const add = () => {
    navigate("/cadastro-performance-jogador");
  };

  const edit = (id) => {
    navigate(`/cadastro-performance-jogador/${id}`);
  };

  const deleteItem = async (id) => {
    await axios
      .delete(`${baseUrl}/${id}`)
      .then(() => {
        mount();
        mensagemSucesso(`Scouts excluidos com sucesso.`);
      })
      .catch(() => {
        mensagemErro(`Não foi possível excluir os scouts.`);
      });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Performance dos Jogadores" />
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
                <TableCell align={"center"}>Jogador</TableCell>
                <TableCell align={"center"}>Gols</TableCell>
                <TableCell align={"center"}>Assistências</TableCell>
                <TableCell align={"center"}>Cartões Amarelos</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {scouts.map((scoutJogador) => (
                <TableRow
                  key={scoutJogador.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    {
                      jogador.find((jogador) => {
                        const relacao = relacionados.find((relacionamento) => {
                          return (
                            relacionamento.id ===
                            scoutJogador.relacaoPartidaJogadorId
                          );
                        });
                        return jogador.id === relacao?.jogadorId;
                      })?.nome
                    }
                  </TableCell>
                  <TableCell align={"center"}>{scoutJogador.gol}</TableCell>
                  <TableCell align={"center"}>
                    {scoutJogador.assistencia}
                  </TableCell>
                  <TableCell align={"center"}>
                    {scoutJogador.cartaoAmarelo}
                  </TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(scoutJogador.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(scoutJogador.id)}
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

export default ListaPerformanceJogadores;
