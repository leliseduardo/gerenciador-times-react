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
import { join, set } from "lodash";

const baseUrl = `${BASE_URL}/campeonatos`;

const ListaCampeonatos = () => {
  const navigate = useNavigate();
  const [championships, setChampionships] = useState([]);
  const [temporadas, setTemporada] = useState({});

  const mount = async () => {
    await axios.get(`${BASE_URL}/temporadas`).then((response) => {
      let localTemporadas = {};

      response.data.forEach((localTemporada) => {
        set(localTemporadas, localTemporada.id, localTemporada.descricao);
      });
      setTemporada((prev) => localTemporadas);
    });

    await axios.get(baseUrl).then((response) => {
      console.log(response.data);
      setChampionships(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const add = () => {
    navigate("/cadastro-campeonato");
  };

  const edit = (id) => {
    navigate(`/cadastro-campeonato/${id}`);
  };

  const deleteItem = async (id) => {
    await axios
      .delete(`${baseUrl}/${id}`)
      .then((response) => {
        if (response.data != null)
          mensagemSucesso(`Campeonato ${id} excluido com sucesso`);
        mount();
      })
      .catch(() => {
        mensagemErro(
          "Não foi possível excluir campeonato. Ele encontra-se vinculado a outros cadastros do sistema."
        );
      });
  };

  console.log(temporadas);

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Campeonatos" />
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
                <TableCell align={"center"}>Temporada</TableCell>
                <TableCell align={"center"}>Nome</TableCell>
                <TableCell align={"center"}>Data de início</TableCell>
                <TableCell align={"center"}>Data de término</TableCell>
                <TableCell align={"center"}>Campeão</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {championships.map((championship) => (
                <TableRow
                  key={championship.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align={"center"}>
                    {temporadas[championship.temporadaId]}
                  </TableCell>
                  <TableCell align={"center"}>{championship.nome}</TableCell>
                  <TableCell align={"center"}>
                    {championship.dataInicio}
                  </TableCell>
                  <TableCell align={"center"}>{championship.dataFim}</TableCell>
                  <TableCell align={"center"}>{championship.campeao}</TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(championship.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(championship.id)}
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

export default ListaCampeonatos;
