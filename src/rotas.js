import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import CadastroPerformanceTecnico from "./views/forms/CadastroPerfomanceTecnico";
import PesquisarPartida from "./views/forms/PesquisarPartida";
import PesquisarJogador from "./views/forms/PesquisarJogador";
import DadosMedicos from "./views/forms/DadosMedicos";
import VisaoAdministrador from "./views/VisaoAdministrador";
import VisaoMedico from "./views/VisaoMedico";
import VisaoTecnico from "./views/VisaoTecnico";
import CadastroCampeonato from "./views/forms/CadastroCampeonato";
import CadastroEstadio from "./views/forms/CadastroEstadio";
import CadastroJogador from "./views/forms/CadastroJogador";
import CadastroLesao from "./views/forms/CadastroLesao";
import CadastroLesaoJogador from "./views/forms/CadastroLesaoJogador";
import CadastroMedico from "./views/forms/CadastroMedico";
import CadastroPartida from "./views/forms/CadastroPartida";
import CadastroPerformanceJogador from "./views/forms/CadastroPerfomanceJogador";
import CadastroPerfomanceTimePartida from "./views/forms/CadastroPerfomanceTimePartida";
import CadastroPosicao from "./views/forms/CadastroPosicao";
import CadastroTecnico from "./views/forms/CadastroTecnico";
import CadastroTimeAdversario from "./views/forms/CadastroTimeAdversario";
import CadastroTemporada from "./views/forms/CadastroTemporada";
import JogadoresRelacionados from "./views/forms/JogadoresRelacionados";
import EstatisticasGerais from "./views/stats/EstatisticasGerais";
import EstatisticasJogador from "./views/stats/EstatisticasJogador";
import EstatisticasTime from "./views/stats/EstatisticasTime";
import EstatisticasTecnico from "./views/stats/EstatisticasTecnico";
import JogadoresRelacionadosTimeAdversario from "./views/forms/JogadoresRelacionadosTimeAdversario";
import ListaMedicos from "./views/lists/ListaMedicos";
import ListaMedicosAntigos from "./views/lists/ListaMedicosAntigos";
import ListaTemporadas from "./views/lists/ListaTemporadas";
import ListaJogadores from "./views/lists/ListaJogadores";
import ListaJogadoresAntigos from "./views/lists/ListaJogadoresAntigos";
import ListaTecnicos from "./views/lists/ListaTecnicos";
import ListaCampeonatos from "./views/lists/ListaCampeonatos";
import ListaEstadios from "./views/lists/ListaEstadios";
import ListaLesoes from "./views/lists/ListaLesoes";
import ListaLesoesJogadores from "./views/lists/ListaLesaoJogadores";
import ListaPartidas from "./views/lists/ListaPartidas";
import ListaPosicoes from "./views/lists/ListaPosicoes";
import ListaTimeAdversarios from "./views/lists/ListaTimeAdversarios";
//import ListaPerformanceTecnico from "./views/lists/ListaPerformanceTecnico";
import ListaPerformanceJogadores from "./views/lists/ListaPerformanceJogadores";
import ListaPerformanceTimeNasPartidas from "./views/lists/ListaPerformanceTimeNasPartidas";
import ListaTecnicosAntigos from "./views/lists/ListaTecnicosAntigos";
import Signup from "./views/signup/signup";
import ListaLesoesJogadoresHistorico from "./views/lists/ListaLesaoJogadoresHistorico";
import ListaLocais from "./views/lists/ListaLocais";
import CadastroLocal from "./views/forms/CadastroLocal";

export default function Rotas(props) {
  return (
    <BrowserRouter>
      <Routes>
        // Components
        <Route
          path="cadastro-campeonato/:idParam?"
          element={<CadastroCampeonato />}
        />
        <Route path="campeonatos" element={<ListaCampeonatos />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="cadastro-estadio/:idParam?"
          element={<CadastroEstadio />}
        />
        <Route path="estadios" element={<ListaEstadios />} />
        <Route
          path="cadastro-jogador/:idParam?"
          element={<CadastroJogador />}
        />
        <Route path="jogadores" element={<ListaJogadores />} />
        <Route path="jogadores-antigos" element={<ListaJogadoresAntigos />} />
        <Route path="cadastro-lesao/:idParam?" element={<CadastroLesao />} />
        <Route path="cadastro-local/:idParam?" element={<CadastroLocal />} />
        <Route path="lesoes" element={<ListaLesoes />} />
        <Route path="locais" element={<ListaLocais />} />
        <Route
          path="cadastro-lesao-jogador/:idParam?"
          element={<CadastroLesaoJogador />}
        />
        <Route
          path="cadastro-temporada/:idParam?"
          element={<CadastroTemporada />}
        />
        <Route path="temporadas" element={<ListaTemporadas />} />
        <Route path="lesoes-jogadores" element={<ListaLesoesJogadores />} />
        <Route
          path="historico-lesoes"
          element={<ListaLesoesJogadoresHistorico />}
        />
        <Route path="cadastro-medico/:idParam?" element={<CadastroMedico />} />
        <Route path="medicos" element={<ListaMedicos />} />
        <Route path="medicos-antigos" element={<ListaMedicosAntigos />} />
        <Route path="partidas" element={<ListaPartidas />} />
        <Route
          path="cadastro-partida/:idParam?"
          element={<CadastroPartida />}
        />
        <Route
          path="cadastro-performance-jogador/:idParam?"
          element={<CadastroPerformanceJogador />}
        />
        <Route
          path="/performance-jogadores"
          element={<ListaPerformanceJogadores />}
        />
        <Route
          path="cadastro-performance-time-partida/:idParam?"
          element={<CadastroPerfomanceTimePartida />}
        />
        <Route
          path="performance-time-partidas"
          element={<ListaPerformanceTimeNasPartidas />}
        />
        <Route
          path="cadastro-posicao/:idParam?"
          element={<CadastroPosicao />}
        />
        <Route path="posicoes" element={<ListaPosicoes />} />
        <Route path="tecnicos" element={<ListaTecnicos />} />
        <Route path="tecnicos-antigos" element={<ListaTecnicosAntigos />} />
        <Route
          path="cadastro-tecnico/:idParam?"
          element={<CadastroTecnico />}
        />
        <Route
          path="cadastro-time-adversario/:idParam?"
          element={<CadastroTimeAdversario />}
        />
        <Route path="adversarios" element={<ListaTimeAdversarios />} />
        <Route
          path="jogadores-relacionados-time-adversario/:idParam?"
          element={<JogadoresRelacionadosTimeAdversario />}
        />
        <Route
          path="relacionados/:idParam?"
          element={<JogadoresRelacionados />}
        />
        <Route
          path="relacionados/:partidaId?/performance/:performanceId?"
          element={<CadastroPerformanceJogador />}
        />
        <Route path="dados-medicos" element={<DadosMedicos />} />
        <Route path="pesquisar-jogador" element={<PesquisarJogador />} />
        <Route path="pesquisar-partida" element={<PesquisarPartida />} />
        //stats
        <Route path="estatisticas-gerais" element={<EstatisticasGerais />} />
        <Route path="estatisticas-jogador" element={<EstatisticasJogador />} />
        <Route path="estatisticas-time" element={<EstatisticasTime />} />
        <Route path="estatisticas-tecnico" element={<EstatisticasTecnico />} />
        // Views
        <Route path={process.env.PUBLIC_URL} element={<Login />} />
        <Route path="visao-adm" element={<VisaoAdministrador />} />
        <Route path="visao-medico" element={<VisaoMedico />} />
        <Route path="visao-tecnico" element={<VisaoTecnico />} />
      </Routes>
    </BrowserRouter>
  );
}
