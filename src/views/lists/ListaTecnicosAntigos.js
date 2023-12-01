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

const baseUrl = `${BASE_URL}/tecnicos`;

const ListaTecnicosAntigos = () => {
  const navigate = useNavigate();
  const [tecnicos, setTecnicos] = useState([]);

  const mount = async () => {
    await axios.get(baseUrl).then((response) => {
      setTecnicos(response.data);
      console.log(response.data);
    });
  };

  useEffect(() => {
    mount();
  }, []);

  const voltar = () => {
    navigate("/tecnicos");
  };

  const ativar = async (id) => {
    await axios.get(`${baseUrl}/${id}`).then((response) => {
      axios
        .put(`${baseUrl}/${id}`, { ...response.data, ativo: true })
        .then((response) => {
          mount();
          mensagemSucesso(`O técnico ${response.data.nome} foi reativado`);
          console.log({ ...response.data, ativo: true });
        });
    });
  };

  return (
    <div className="w-full h-full">
      <Navbar title="Lista de Técnicos Antigos" />
      <div className="flex justify-end px-12 pt-10">
        <button
          onClick={voltar}
          className="bg-blue-600 text-white p-2 rounded-lg"
        >
          Voltar
        </button>
      </div>

      <div className="flex justify-center w-full h-full px-12 pt-10 pb-24">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align={"center"}>Nome</TableCell>
                <TableCell align={"center"}>Email</TableCell>
                <TableCell align={"center"}>CPF</TableCell>
                <TableCell align={"center"}>Data de Nascimento</TableCell>
                <TableCell align={"center"}>Telefone</TableCell>
                <TableCell align={"center"}>Logradouro</TableCell>
                <TableCell align={"center"}>Número</TableCell>
                <TableCell align={"center"}>Bairro</TableCell>
                <TableCell align={"center"}>Cidade</TableCell>
                <TableCell align={"center"}>Estado</TableCell>
                <TableCell align={"center"}>CEP</TableCell>
                <TableCell align={"center"}>Nacionalidade</TableCell>
                <TableCell align={"center"}>Contratação</TableCell>
                <TableCell align={"center"}>Demissão</TableCell>
                <TableCell align={"center"}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tecnicos.map((tecnico) => {
                if (!tecnico.ativo) {
                  return (
                    <TableRow
                      key={tecnico.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={"center"}>{tecnico.nome}</TableCell>
                      <TableCell align={"center"}>{tecnico.email}</TableCell>
                      <TableCell align={"center"}>{tecnico.cpf}</TableCell>
                      <TableCell align={"center"}>
                        {tecnico.dataNascimento}
                      </TableCell>
                      <TableCell align={"center"}>{tecnico.telefone}</TableCell>
                      <TableCell align={"center"}>
                        {tecnico.logradouro}
                      </TableCell>
                      <TableCell align={"center"}>{tecnico.numero}</TableCell>
                      <TableCell align={"center"}>{tecnico.bairro}</TableCell>
                      <TableCell align={"center"}>{tecnico.cidade}</TableCell>
                      <TableCell align={"center"}>{tecnico.estado}</TableCell>
                      <TableCell align={"center"}>{tecnico.cep}</TableCell>
                      <TableCell align={"center"}>
                        {tecnico.nacionalidade}
                      </TableCell>
                      <TableCell align={"center"}>
                        {tecnico.dataDeContratacao}
                      </TableCell>
                      <TableCell align={"center"}>
                        {tecnico.dataDeDemissao}
                      </TableCell>
                      <TableCell align={"center"}>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => ativar(tecnico.id)}
                            className="bg-gray-600 text-white p-2 rounded-lg"
                          >
                            Ativar
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

export default ListaTecnicosAntigos;
