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

const baseUrl = `${BASE_URL}/posicoes`;

const ListaPosicoes = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);

  const areas = {
    0: "Superior",
    1: "Central",
    2: "Inferior",
  };

  const sides = {
    0: "Esquerda",
    1: "Direita",
    2: "Centro",
  };

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setPositions(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const add = () => {
    navigate("/cadastro-posicao");
  };

  const edit = (id) => {
    navigate(`/cadastro-posicao/${id}`);
  };

  const deleteItem = async (id) => {
    await axios
      .delete(`${baseUrl}/${id}`)
      .then((response) => {
        if (response.data != null)
          mensagemSucesso(`Posição ${id} excluida com sucesso`);
        mount();
      })
      .catch(() => {
        mensagemErro(
          "Não foi possível excluir posição. Ela encontra-se vinculada a outro cadastro no sistema."
        );
      });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Posições" />
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
                {/* <TableCell align={"center"}>ID</TableCell> */}
                <TableCell align={"center"}>Nome</TableCell>
                <TableCell align={"center"}>Área</TableCell>
                <TableCell align={"center"}>Lado</TableCell>
                <TableCell align={"center"}>Sigla</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((posicao) => (
                <TableRow
                  key={posicao.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell align={"center"}>{posicao.id}</TableCell> */}
                  <TableCell align={"center"}>{posicao.nome}</TableCell>
                  <TableCell align={"center"}>{posicao.areaCampo}</TableCell>
                  <TableCell align={"center"}>{posicao.ladoCampo}</TableCell>
                  <TableCell align={"center"}>{posicao.sigla}</TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(posicao.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(posicao.id)}
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

export default ListaPosicoes;
