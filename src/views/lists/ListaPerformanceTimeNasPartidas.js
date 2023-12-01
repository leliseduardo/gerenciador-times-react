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

const baseUrl = `${BASE_URL}/scouts-partida`;

const ListaPerformanceTimeNasPartidas = () => {
  const navigate = useNavigate();
  const [performance, setPerformance] = useState([]);
  const [partidas, setPartidas] = useState({});

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setPerformance(response.data);
    });

    await axios.get(`${BASE_URL}/partidas`).then((response) => {
      const data = get(response, "data", []);

      data.forEach((item) => {
        setPartidas((prev) => ({
          ...prev,
          [item.id]: item.data,
        }));
      });
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const add = () => {
    navigate("/cadastro-performance-time-partida");
  };

  const edit = (id) => {
    navigate(`/cadastro-performance-time-partida/${id}`);
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

  const getPartida = (id) => {
    return get(partidas, id, "");
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Performance das Partidas" />
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
                <TableCell align={"center"}>Partida</TableCell>
                <TableCell align={"center"}>Gols</TableCell>
                <TableCell align={"center"}>Gols time adversários</TableCell>
                <TableCell align={"center"}>Posse de bola</TableCell>
                <TableCell align={"center"}>Impedimentos</TableCell>
                <TableCell align={"center"}>Cruzamentos</TableCell>
                <TableCell align={"center"}>Escanteios</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.map((performance) => (
                <TableRow
                  key={performance.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align={"center"}>
                    {getPartida(performance.partidaId)}
                  </TableCell>
                  <TableCell align={"center"}>{performance.gols}</TableCell>
                  <TableCell align={"center"}>
                    {performance.golsTimeAdversario}
                  </TableCell>
                  <TableCell align={"center"}>
                    {performance.posseDeBola}
                  </TableCell>
                  <TableCell align={"center"}>
                    {performance.impedimentos}
                  </TableCell>
                  <TableCell align={"center"}>
                    {performance.cruzamentos}
                  </TableCell>
                  <TableCell align={"center"}>
                    {performance.escanteios}
                  </TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(performance.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(performance.id)}
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

export default ListaPerformanceTimeNasPartidas;
