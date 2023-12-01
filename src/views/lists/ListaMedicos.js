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

const baseUrl = `${BASE_URL}/medicos`;

const ListaMedicos = () => {
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setMedicos(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const antigos = () => {
    navigate("/medicos-antigos");
  };

  const add = () => {
    navigate("/cadastro-medico");
  };

  const edit = (id) => {
    navigate(`/cadastro-medico/${id}`);
  };

  //   const deleteItem = async (id) => {
  //     await axios.delete(`${baseUrl}/${id}`).then((response) => {
  //       if (response.data != null)
  //         mensagemSucesso(`Médico ${id} excluido com sucesso`);
  //       mount();
  //     });
  //   };

  const deleteItem = async (id) => {
    await axios.get(`${baseUrl}/${id}`).then((response) => {
      axios
        .put(`${baseUrl}/${id}`, { ...response.data, ativo: false })
        .then((response) => {
          mount();
          console.log({ ...response.data, ativo: false });
          mensagemSucesso(`Médico ${response.data.nome} excluido com sucesso`);
        });
    });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Médicos" />
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
                <TableCell align={"center"}>Email</TableCell>
                <TableCell align={"center"}>Registro</TableCell>
                {/* <TableCell align={"center"}>CPF</TableCell>
                <TableCell align={"center"}>Data de Nascimento</TableCell>
                <TableCell align={"center"}>Telefone</TableCell>
                <TableCell align={"center"}>Logradouro</TableCell>
                <TableCell align={"center"}>Número</TableCell>
                <TableCell align={"center"}>Bairro</TableCell>
                <TableCell align={"center"}>Cidade</TableCell>
                <TableCell align={"center"}>Estado</TableCell>
                <TableCell align={"center"}>CEP</TableCell>
                <TableCell align={"center"}>Nacionalidade</TableCell> */}
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicos.map((medico) => {
                if (medico.ativo) {
                  return (
                    <TableRow
                      key={medico.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={"center"}>{medico.nome}</TableCell>
                      <TableCell align={"center"}>{medico.email}</TableCell>
                      <TableCell align={"center"}>{medico.registro}</TableCell>
                      {/* <TableCell align={"center"}>{medico.cpf}</TableCell>
                      <TableCell align={"center"}>
                        {medico.dataNascimento}
                      </TableCell>
                      <TableCell align={"center"}>{medico.telefone}</TableCell>
                      <TableCell align={"center"}>
                        {medico.logradouro}
                      </TableCell>
                      <TableCell align={"center"}>{medico.numero}</TableCell>
                      <TableCell align={"center"}>{medico.bairro}</TableCell>
                      <TableCell align={"center"}>{medico.cidade}</TableCell>
                      <TableCell align={"center"}>{medico.estado}</TableCell>
                      <TableCell align={"center"}>{medico.cep}</TableCell>
                      <TableCell align={"center"}>
                        {medico.nacionalidade}
                      </TableCell> */}
                      <TableCell align={"center"}>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => edit(medico.id)}
                            className="bg-gray-600 text-white p-2 rounded-lg"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteItem(medico.id)}
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

export default ListaMedicos;
