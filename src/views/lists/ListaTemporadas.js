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

const baseUrl = `${BASE_URL}/temporadas`;

const ListaTemporadas = () => {
  const navigate = useNavigate();
  const [temporadas, setTemporadas] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
        setTemporadas(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const add = () => {
    navigate("/cadastro-temporada");
  };

  const edit = (id) => {
    navigate(`/cadastro-temporada/${id}`);
  };

  const deleteItem = async (id) => {
    await axios
      .delete(`${baseUrl}/${id}`)
      .then((response) => {
        if (response.data != null)
          mensagemSucesso(`temporada ${id} excluida com sucesso`);
        mount();
      })
      .catch(() => {
        mensagemErro(
          "Não foi possível excluir temporada. Ela encontra-se vinculada a outro cadastro no sistema."
        );
      });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de temporadas" />
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
                <TableCell align={"center"}>Descrição</TableCell>
                <TableCell align={"center"}>Data de Início</TableCell>
                <TableCell align={"center"}>Data de Encerramento</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temporadas.map((temporada) => (
                <TableRow
                  key={temporada.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align={"center"}>{temporada.descricao}</TableCell>
                  <TableCell align={"center"}>{temporada.dataInicio}</TableCell>
                  <TableCell align={"center"}>{temporada.dataFim}</TableCell>
                  <TableCell align={"center"}>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => edit(temporada.id)}
                        className="bg-gray-600 text-white p-2 rounded-lg"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteItem(temporada.id)}
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

export default ListaTemporadas;
