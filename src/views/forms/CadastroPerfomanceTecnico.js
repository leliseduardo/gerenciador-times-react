import React , {useCallback , useEffect , useState} from "react";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import {BASE_URL} from "../../config/axios";
import {useNavigate , useParams} from "react-router-dom";
import axios from "axios";
import {mensagemSucesso} from "../Components/toastr";
import {get} from "lodash/object";

const baseUrl = `${BASE_URL}/performance-tecnicos`;
let proximoId = 0;
let control = 0;

export default function CadastroPerformanceTecnico() {
  const [inputValue, setInputValue] = useState({
    "id": "",
    "season": "",
    "championship": "",
    "match": "",
    "replacements": "",
    "yellowCards" : "",
    "redCard" : true,
    "data": ""
  });

  const [seasons, setSeasons] = useState({})
  const [championships, setChampionships] = useState({})
  const [matches, setMatches] = useState({})

  const { season, championship, match, replacements, yellowCards, redCard } = inputValue;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { idParam } = useParams();
  const navigate = useNavigate();

  async function cadastrar() {
    let item = {...inputValue};
    delete item.data

    item = JSON.stringify(item);

    if (idParam == null) {
      await axios.post(baseUrl, item).then((response) => {
        mensagemSucesso(`Performance do técnico salva com sucesso`);
      });
      limpar();
    } else {
      await axios.put(`${baseUrl}/${idParam}`, item).then((response) => {
        mensagemSucesso(`Performance do técnico atualizada com sucesso`);
        navigate(`/cadastro-performance-tecnico`);
      });
      limpar();
    }
  }

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach(key => {
      let value = ""

      if (key === "id"){
        value = proximoId
      }
      handleChange({target: {name: key, value}})
    })
  }, [inputValue]);

  useEffect(() => {
    const mount = async () => {
      if (control === 0) {
        await axios.get(`${BASE_URL}/temporadas`).then((response) => {
          const data = get(response, "data", [])

          data.forEach(item => {
            setSeasons((prev) => ({
              ...prev,
              [item.id]: item.name,
            }))
          })
        });

        await axios.get(`${BASE_URL}/campeonatos`).then((response) => {
          const data = get(response, "data", [])

          data.forEach(item => {
            setChampionships((prev) => ({
              ...prev,
              [item.id]: item.name,
            }))
          })
        });

        await axios.get(`${BASE_URL}/partidas`).then((response) => {
          const data = get(response, "data", [])

          data.forEach(item => {
            setMatches((prev) => ({
              ...prev,
              [item.id]: item.name,
            }))
          })
        });

        if (idParam == null) {
          await axios.get(baseUrl).then((response) => {
            proximoId = response.data.length + 1;
            handleChange({target: {name: "id", "value": proximoId}});
          });
          limpar()
        } else {
          let localData = {}
          await axios.get(`${baseUrl}/${idParam}`).then((response) => {
            localData = response.data
            handleChange({target: {name: "data", "value": localData}});
          });

          Object.keys(inputValue).forEach(key => {
            let value = get(localData, key, "")

            handleChange({target: {name: key, value: value}})
          })
        }
      }
      control++;
    }

    mount()
  }, [idParam, inputValue, limpar]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro Performance Técnico" />

        <div className=" flex flex-col p-4 justify-center items-center  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <div className="flex w-full items-center">
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={seasons}
                label="Temporada"
                value={season}
                name="season"
                onChange={handleChange}
              />
              <SelectInput
                items={championships}
                label="Campeonato"
                value={championship}
                name="championship"
                onChange={handleChange}
              />
              <SelectInput
                items={matches}
                label="Partida"
                value={match}
                name="match"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h1 className="mt-10 mb-5 text-2xl font-bold">Scouts</h1>
            <div className="w-full sm:w-1/3">
              <SelectInput
                items={{
                  0: "0",
                  1: "1",
                  2: "2",
                  3: "3",
                  4: "4",
                  5: "5",
                }}
                label="Substituições"
                value={replacements}
                name="replacements"
                onChange={handleChange}
              />
            </div>
            <div className="w-full sm:w-1/3">
              <SelectInput
                items={{
                  0: "0",
                  1: "1",
                  2: "2",
                }}
                label="Cartões Amarelos"
                value={yellowCards}
                name="yellowCards"
                onChange={handleChange}
              />
            </div>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={redCard}
                    onChange={handleChange}
                    name="redCard"
                  />
                }
                label="Cartão vermelho"
              />
            </FormGroup>
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-start">
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={cadastrar}
            >
              Cadastrar
            </Button>
            <Button
              sx={{
                height: 56,
              }}
              variant="contained"
              onClick={limpar}
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
