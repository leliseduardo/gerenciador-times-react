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
import { mensagemSucesso } from "../Components/toastr";

const baseUrl = `${BASE_URL}/jogadores`;
const baseUrl2 = `${BASE_URL}/posicoes`;

const ListaJogadores = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [posicoes, setPosicoes] = useState([]);

  const mount = async () => {
    console.log("Mount!!");
    await axios.get(baseUrl).then((response) => {
      setPlayers(response.data);
      // console.log(response.data);
    });
    await axios.get(baseUrl2).then((response) => {
      setPosicoes(response.data);
      // console.log(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const antigos = () => {
    navigate("/jogadores-antigos");
  };

  const add = () => {
    navigate("/cadastro-jogador");
  };

  const edit = (id) => {
    navigate(`/cadastro-jogador/${id}`);
  };

  // const deleteItem = async (id) => {
  //   await axios.delete(`${baseUrl}/${id}`).then((response) => {
  //     if (response.data != null)
  //       mensagemSucesso(`Jogador ${id} excluido com sucesso`);
  //     mount();
  //   });
  // };
  const deleteItem = async (id) => {
    await axios.get(`${baseUrl}/${id}`).then((response) => {
      axios
        .put(`${baseUrl}/${id}`, { ...response.data, ativo: false })
        .then(() => {
          mount();
          console.log({ ...response.data, ativo: false });
          mensagemSucesso(
            `Jogador ${response.data.nome} foi movido para jogadores desativados`
          );
        });
    });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Jogadores" />
      <div className="flex justify-end px-12 pt-10 gap-10">
        <button
          onClick={antigos}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          Antigos
        </button>
        <button onClick={add} className="bg-blue-600 text-white p-2 rounded-lg">
          Adicionar
        </button>
      </div>

      <div className="flex justify-center w-full h-full px-12 pt-10 pb-24">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Nome</TableCell>
                <TableCell align={"center"}>Posições</TableCell>
                {/* <TableCell align={"center"}>Email</TableCell>
                <TableCell align={"center"}>CPF</TableCell> */}
                <TableCell align={"center"}>Data de Nascimento</TableCell>
                {/* <TableCell align={"center"}>Telefone</TableCell>
                <TableCell align={"center"}>Logradouro</TableCell>
                <TableCell align={"center"}>Número</TableCell>
                <TableCell align={"center"}>Bairro</TableCell>
                <TableCell align={"center"}>Cidade</TableCell>
                <TableCell align={"center"}>Estado</TableCell>
                <TableCell align={"center"}>CEP</TableCell> */}
                <TableCell align={"center"}>Nacionalidade</TableCell>
                <TableCell align={"center"}>Altura</TableCell>
                <TableCell align={"center"}>Peso</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => {
                if (player.ativo) {
                  return (
                    <TableRow
                      key={player.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={"center"}>{player.nome}</TableCell>
                      <TableCell align={"center"}>
                        <ul>
                          {player.ids_posicoes.map((posicaoId) => {
                            const posicao = posicoes.find(
                              (posicao) => posicao.id === posicaoId
                            );
                            return posicao ? (
                              <li>{posicao.nome}</li>
                            ) : (
                              <li></li>
                            );
                          })}
                        </ul>
                      </TableCell>
                      {/* <TableCell align={"center"}>{player.email}</TableCell>
                      <TableCell align={"center"}>{player.cpf}</TableCell> */}
                      <TableCell align={"center"}>
                        {player.dataNascimento}
                      </TableCell>
                      {/* <TableCell align={"center"}>{player.telefone}</TableCell>
                      <TableCell align={"center"}>
                        {player.logradouro}
                      </TableCell>
                      <TableCell align={"center"}>{player.numero}</TableCell>
                      <TableCell align={"center"}>{player.bairro}</TableCell>
                      <TableCell align={"center"}>{player.cidade}</TableCell>
                      <TableCell align={"center"}>{player.estado}</TableCell>
                      <TableCell align={"center"}>{player.cep}</TableCell> */}
                      <TableCell align={"center"}>
                        {player.nacionalidade}
                      </TableCell>
                      <TableCell align={"center"}>{player.altura}</TableCell>
                      <TableCell align={"center"}>{player.peso}</TableCell>
                      <TableCell align={"center"}>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => edit(player.id)}
                            className="bg-gray-600 text-white p-2 rounded-lg"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteItem(player.id)}
                            className="bg-red-600 text-white p-2 rounded-lg"
                          >
                            Remover
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListaJogadores;
