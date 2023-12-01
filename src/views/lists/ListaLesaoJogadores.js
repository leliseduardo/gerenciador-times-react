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
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import { RepeatOneSharp } from "@mui/icons-material";

const baseUrl = `${BASE_URL}/lesoes-jogador`;
const baseUrlJogador = `${BASE_URL}/jogadores`;
const baseUrlLesao = `${BASE_URL}/lesoes`;
const baseUrlLocal = `${BASE_URL}/locais`;
const baseUrlMedico = `${BASE_URL}/medicos`;

const ListaLesoesJogadores = () => {
  const navigate = useNavigate();
  const [lesaoJogador, setLesaoJogador] = useState([]);
  const [jogador, setJogador] = useState([]);
  const [lesao, setLesao] = useState([]);
  const [local, setLocal] = useState([]);
  const [medico, setMedico] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setLesaoJogador(response.data);
    });

    await axios.get(baseUrlJogador).then((response) => {
      setJogador(response.data);
    });
    await axios.get(baseUrlLesao).then((response) => {
      setLesao(response.data);
    });
    await axios.get(baseUrlLocal).then((response) => {
      setLocal(response.data);
    });
    await axios.get(baseUrlMedico).then((response) => {
      setMedico(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const add = () => {
    navigate("/cadastro-lesao-jogador");
  };

  const edit = (id) => {
    navigate(`/cadastro-lesao-jogador/${id}`);
  };

  const deleteItem = async (id) => {
    await axios
      .get(`${baseUrl}/${id}`)
      .then((response) => {
        axios
          .put(`${baseUrl}/${id}`, { ...response.data, ativo: false })
          .then(() => {
            mount();
            const nomeJogador = jogador.find(
              (jogador) => jogador.id === response.data.jogadorId
            )?.nome;
            mensagemSucesso(`Lesão de ${nomeJogador} resolvida.`);
          })
          .catch(() => {
            mensagemErro(`Não foi possível excluir a lesão.`);
          });
      })
      .catch(() => {
        mensagemErro(`Não foi possível excluir a lesão.`);
      });
  };

  const historico = () => {
    navigate("/historico-lesoes");
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Lesões dos jogadores" />
      <div className="flex justify-end px-12 pt-10 gap-10">
        <button
          onClick={historico}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          Histórico
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
                <TableCell align={"center"}>Jogador</TableCell>
                <TableCell align={"center"}>Lesao</TableCell>
                <TableCell align={"center"}>Local</TableCell>
                <TableCell align={"center"}>Médico</TableCell>
                <TableCell align={"center"}>Data lesão</TableCell>
                <TableCell align={"center"}>Data da Alta</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lesaoJogador.map((lesaoJogador) => {
                if (lesaoJogador.ativo) {
                  return (
                    <TableRow
                      key={lesaoJogador.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={"center"}>
                        {
                          jogador.find(
                            (jogador) => jogador.id === lesaoJogador.jogadorId
                          )?.nome
                        }
                      </TableCell>
                      <TableCell align={"center"}>
                        {
                          lesao.find(
                            (lesao) => lesao.id === lesaoJogador.lesaoId
                          )?.nome
                        }
                      </TableCell>
                      <TableCell align={"center"}>
                        {
                          local.find(
                            (local) => local.id === lesaoJogador.localId
                          )?.nome
                        }
                      </TableCell>
                      <TableCell align={"center"}>
                        {
                          medico.find(
                            (medico) =>
                              medico.id === lesaoJogador.medicoResponsavelId
                          )?.nome
                        }
                      </TableCell>
                      <TableCell align={"center"}>
                        {lesaoJogador.dataLesao}
                      </TableCell>
                      <TableCell align={"center"}>
                        {lesaoJogador.dataDaAlta}
                      </TableCell>
                      <TableCell align={"center"}>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => edit(lesaoJogador.id)}
                            className="bg-gray-600 text-white p-2 rounded-lg"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteItem(lesaoJogador.id)}
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

export default ListaLesoesJogadores;
