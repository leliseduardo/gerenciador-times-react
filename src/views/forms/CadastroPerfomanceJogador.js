import React , {useCallback , useEffect , useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Navbar from "../Components/Navbar";
import SelectInput from "../Components/inputs/SelectInput";
import {BASE_URL} from "../../config/axios";
import {useNavigate , useParams} from "react-router-dom";
import axios from "axios";
import {get, set} from "lodash/object";
import { mensagemErro, mensagemSucesso } from "../Components/toastr";
import {
  cadastrarOuAtualizar ,
  fetchData ,
  formatArrayForSelect ,
  getDataBasedOnId ,
  groupAndSet , setItemsBySelectRelation
} from "../../utils/healpers";
import {groupBy} from "lodash";

const baseUrl = `${BASE_URL}/scouts-jogador`;

export default function CadastroPerformanceJogador() {
  const [inputValue, setInputValue] = useState({
    id: "",
    temporada: "",
    campeonato: "",
    partida: "",
    jogador: "",
    desarmes: "",
    gol : "",
    faltasCometidas : "",
    faltaSofrida : "",
    assistencia : "",
    passeIncompleto : "",
    finalizacaoTrave : "",
    finalizacaoDefendida : "",
    finalizacaoFora: "",
    penaltiPerdido: "",
    penaltiCometido: "",
    penaltiSofrido: "",
    cartaoAmarelo: "",
    cartaoVermelho: "",
    impedimento: "",
    golContra: "",
    jogosSemSofrerGols: "",
    defesaDificil: "",
    golSofrido: "",
    defesaPenalti : "",
    data: {}
  });

  const {
    temporada, campeonato, partida,
    jogador, desarmes, gol, faltasCometidas,
    faltaSofrida, assistencia, passeIncompleto,
    finalizacaoTrave, finalizacaoDefendida, finalizacaoFora,
    penaltiPerdido, penaltiCometido, impedimento,
    golContra, cartaoVermelho, penaltiSofrido, cartaoAmarelo,
    jogosSemSofrerGols, golSofrido, defesaDificil, defesaPenalti
  } = inputValue;

  const [seasons, setSeasons] = useState({});
  const [championships, setChampionships] = useState({})
  const [championshipsBySeasons, setChampionshipsBySeasons] = useState({});
  const [matches, setMatches] = useState({})
  const [matchesByChampionships, setMatchesByChampionships] = useState({})
  const [related, setRelated] = useState({})
  const [relatedByMatches, setRelatedByMatches] = useState({})
  const [players, setPlayers] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;

    if(name === "campeonato"){
      getFormatAndSet(matchesByChampionships, value, "id", "data", setMatches)
      handleChange({ target: { name: "partidaId", value: "" } })
    }

    if (name === "temporada") {
      getFormatAndSet(championshipsBySeasons, value, "id", "nome", setChampionships)
      handleChange({ target: { name: "campeonato", value: "" } })
    }

    if (name === "partida") {
      const relacionadosPorPartida = get(relatedByMatches, value, {})
      setPlayers(() => relacionadosPorPartida)
      handleChange({ target: { name: "jogador", value: "" } })
    }

    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFormatAndSet = (collection, value, path, labelPath, setState) => {
    const groupedCollection = get(collection, value, [])
    setState(() => formatArrayForSelect(groupedCollection, path, labelPath))
    return groupedCollection
  }


  const { partidaId, performanceId } = useParams();
  const navigate = useNavigate();

  async function cadastrar() {
    let item = { ...inputValue };

    if (performanceId == null) {
      const cartaoVermelho = get(item, "cartaoVermelho", 0)
      const relacionado = get(item, "jogador", 0)
      set(item, "cartaoVermelho", cartaoVermelho > 0)
      set(item, "relacaoPartidaJogadorId", relacionado)

      await axios
        .post(baseUrl, item)
        .then((response) => {
          mensagemSucesso(`Performance do jogador ${jogador} salva com sucesso`);
          navigate("/performance-jogadores");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    } else {
      await axios
        .put(`${baseUrl}/${performanceId}`, item)
        .then((response) => {
          mensagemSucesso(`Performance do jogador ${jogador} atualizada com sucesso`);
          navigate("/performance-jogadores");
        })
        .catch(() => {
          mensagemErro("Preencha todos os campos corretamente.");
        });
    }
  }
  

  const limpar = useCallback(() => {
    Object.keys(inputValue).forEach(key => {
      let value = ""

      handleChange({target: {name: key, value}})
    })
  }, [inputValue]);

  const getPlayersByRelated = async (players) => {
    let localRelated = await fetchData(`${BASE_URL}/relacionados`, "jogadorId", setRelated)
    players = groupBy(players, "id")

    localRelated = localRelated.map(related => {
      const jogadorId = get(related, "jogadorId", false)
      const player = get(players, `${jogadorId}[0]`, false)

      if (jogadorId && player) {
        set(related, "jogador", player)
        return related
      }
    })

    localRelated = groupBy(localRelated, "partidaId")
    const localRelatedByMatch = {}
    Object.entries(localRelated).forEach(([index, related]) => {
      const players = {}
      related.forEach(item => {
        const id = get(item, "id", false)
        const playerName = get(item, "jogador.nome", false)

        if (id && playerName) {
          set(players, id, playerName)
        }
      })
      set(localRelatedByMatch, index, players)
    })

    setRelatedByMatches((prev) => localRelatedByMatch)
    return localRelatedByMatch
  }

  useEffect(() => {

    const mount = async () => {
      const players = await fetchData(`${BASE_URL}/jogadores`, "nome", setPlayers)

      const localCampeonatos = await fetchData(`${BASE_URL}/campeonatos`, "nome", setChampionships)
      const campeonatosAgrupadoPorTemporda = groupAndSet(localCampeonatos, "temporadaId", setChampionshipsBySeasons)
      await fetchData(`${BASE_URL}/temporadas`, "descricao", setSeasons)
      const localPartidas = await fetchData(`${BASE_URL}/partidas`, "data", setMatches)
      const partidasAgrupadasPorCampeonato = groupAndSet(localPartidas, "campeonatoId", setMatchesByChampionships)
      const relacionadosPorPartida = await getPlayersByRelated(players)

      const campeonatosAgrupadosPorId = groupAndSet(localCampeonatos, "id", () => {})

      if (partidaId !== null && partidaId !== undefined){
        const partida = get(groupBy(localPartidas, "id"), `${partidaId}[0]`, false)
        const campeonatoId = get(partida, "campeonatoId", false)
        const campeonato = get(campeonatosAgrupadosPorId, `${campeonatoId}[0]`, false)
        const temporadaId = get(campeonato, "temporadaId", false)

        handleChange({ target: { name: "temporada", value: temporadaId } })
        getFormatAndSet(campeonatosAgrupadoPorTemporda, temporadaId, "id", "nome", setChampionships)
        handleChange({ target: { name: "campeonato", value: campeonatoId } })
        getFormatAndSet(partidasAgrupadasPorCampeonato, campeonatoId, "id", "data", setMatches)
        handleChange({ target: { name: "partida", value: partidaId } })
        setPlayers(() => get(relacionadosPorPartida, partidaId, {}))
      }

      if (performanceId !== null && performanceId !== undefined) {
        const localData = await getDataBasedOnId(baseUrl, performanceId, inputValue, handleChange, ["temporada", "campeonato", "partida", "jogador"])
        const localCartaoVermelho = get(localData, "cartaoVermelho", false)

        handleChange({ target: { name: "cartaoVermelho", value: localCartaoVermelho ? 1 : 0 } })
        const relacionadoId = get(localData, "relacaoPartidaJogadorId", false)
        const relacionado = get(await axios.get(`${BASE_URL}/relacionados/${relacionadoId}`), "data", {})
        set(localData, "partidaId", get(relacionado, "partidaId", false))
        const partida = setItemsBySelectRelation(localData, "campeonato", localPartidas, "partidaId", "data", partidasAgrupadasPorCampeonato, setMatches, setInputValue)
        setItemsBySelectRelation(partida, "temporada", localCampeonatos, "campeonatoId", "nome", campeonatosAgrupadoPorTemporda, setChampionships, setInputValue)
        handleChange({ target: { name: "jogador", value: relacionadoId } })
      }
    };

    mount()
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Navbar title="Cadastro da Perfomance do Jogador" />

        <div className=" flex flex-col justify-center items-center gap-4  md:mt-10 p-4 px-10 sm:px-20 xl:px-48">
          <div className="flex w-full gap-2 items-center">
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2">
              <SelectInput
                items={seasons}
                label="Temporada"
                value={temporada}
                name="temporada"
                onChange={handleChange}
              />
              <SelectInput
                items={championships}
                label="Campeonato"
                value={campeonato}
                name="campeonato"
                onChange={handleChange}
              />
              <SelectInput
                items={matches}
                label="Partida"
                value={partida}
                name="partida"
                onChange={handleChange}
              />
              <SelectInput
                items={players}
                label="Jogador"
                value={jogador}
                name="jogador"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full justify-end">
            <h1 className="mt-10 mb-5 text-2xl font-bold self-center sm:self-start">
              Scouts Padrões
            </h1>
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
              <TextField
                fullWidth
                type="number"
                label="Desarmes"
                variant="outlined"
                value={desarmes}
                name="desarmes"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Gols"
                variant="outlined"
                value={gol}
                name="gol"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Faltas Cometidas"
                variant="outlined"
                value={faltasCometidas}
                name="faltasCometidas"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Faltas Sofridas"
                variant="outlined"
                value={faltaSofrida}
                name="faltaSofrida"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
              <TextField
                fullWidth
                type="number"
                label="Assistências"
                variant="outlined"
                value={assistencia}
                name="assistencia"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Passes Incompletos"
                variant="outlined"
                value={passeIncompleto}
                name="passeIncompleto"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Finalizações na Trave"
                variant="outlined"
                value={finalizacaoTrave}
                name="finalizacaoTrave"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Finalizações Defendidas"
                variant="outlined"
                value={finalizacaoDefendida}
                name="finalizacaoDefendida"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
              <TextField
                fullWidth
                type="number"
                label="Finalizações para fora"
                variant="outlined"
                value={finalizacaoFora}
                name="finalizacaoFora"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Pênaltis Perdidos"
                variant="outlined"
                value={penaltiPerdido}
                name="penaltiPerdido"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Pênaltis Cometidos"
                variant="outlined"
                value={penaltiCometido}
                name="penaltiCometido"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Pênaltis Sofridos"
                variant="outlined"
                value={penaltiSofrido}
                name="penaltiSofrido"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
              <TextField
                fullWidth
                type="number"
                label="Cartões Amarelos"
                variant="outlined"
                value={cartaoAmarelo}
                name="cartaoAmarelo"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Cartões Vermehos"
                variant="outlined"
                value={cartaoVermelho}
                name="cartaoVermelho"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Impedimentos"
                variant="outlined"
                value={impedimento}
                name="impedimento"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Gols Contra"
                variant="outlined"
                value={golContra}
                name="golContra"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full justify-end">
            <h1 className="mt-10 mb-5 text-2xl font-bold self-center sm:self-start">
              Scouts de Goleiros
            </h1>
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-2 items-center">
              <TextField
                fullWidth
                type="number"
                label="Jogos sem sofrer gol"
                variant="outlined"
                value={jogosSemSofrerGols}
                name="jogosSemSofrerGols"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Defesa difícil"
                variant="outlined"
                value={defesaDificil}
                name="defesaDificil"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Gols sofridos"
                variant="outlined"
                value={golSofrido}
                name="golSofrido"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Defesa de pênalti"
                variant="outlined"
                value={defesaPenalti}
                name="defesaPenalti"
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-end">
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
