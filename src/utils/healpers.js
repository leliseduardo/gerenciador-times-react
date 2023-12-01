import axios from "axios";
import {get , set} from "lodash/object";
import {mensagemErro , mensagemSucesso} from "../views/Components/toastr";
import {groupBy} from "lodash";

const fetchData = async (url, path, setState) => {
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (path === "vasco"){
      console.log(data)
    }
    data.forEach((item) => {
      let id = item.id
      let value = get(item, path, "")

      setState((prev) => ({
        ...prev,
        [id]: value,
      }));
    });

    return data
  } catch (error) {
    // Handle any error that occurs during the request
    console.error(error);
  }
}

const formatArrayForSelect = (array, idPath, labelPath) => {
  const formatted = {}

  array.forEach(item => {
    const id = get(item, idPath, false)
    const label = get(item, labelPath, false)

    if(id && label){
      set(formatted, id, label)
    }
  })

  return formatted
}

const getDataBasedOnId = async (baseUrl, id, data, handleChange, except = []) => {
  let localData = {};
  await axios.get(`${baseUrl}/${id}`).then((response) => {
    localData = response.data;
    handleChange({ target: { name: "data", value: localData } });
  });

  Object.keys(data).forEach((key) => {
    let value = get(localData, key, false);

    if (except.includes(key)){
      return
    }

    handleChange({ target: { name: key, value: value } });
  });

  return localData
}

const cadastrarOuAtualizar = async (data, baseUrl, id, message, navigateTo, navigate) => {
  let item = { ...data };

  if (id == null) {
    await axios
      .post(baseUrl, item)
      .then((response) => {
        mensagemSucesso(
          `${message} salva com sucesso`
        );
        navigate(navigateTo);
      })
      .catch(() => {
        mensagemErro("Preencha todos os campos corretamente.");
      });
  } else {
    await axios
      .put(`${baseUrl}/${id}`, item)
      .then((response) => {
        mensagemSucesso(
          `${message} atualizada com sucesso`
        );
        navigate(navigateTo);
      })
      .catch(() => {
        mensagemErro("Preencha todos os campos corretamente.");
      });
  }
}

const groupAndSet = (items, path, setState) => {
  const groupedData = groupBy(items, path)
  setState(() => groupedData)
  return groupedData
}

const setItemsBySelectRelation = (items, toPath, source, sourcePath, sourceLabelPath, groupedSource, setSourceState, setState) => {
  const sourceId = get(items, sourcePath, false)

  const sourceObj = get(groupBy(source, "id"), `${sourceId}[0]`, false)

  if (sourceObj){
    const toId = get(sourceObj, `${toPath}Id`, "")

    setState((prev) => ({
      ...prev,
      [toPath]: toId,
    }));

    setSourceState(() => formatArrayForSelect(get(groupedSource, toId, []), "id", sourceLabelPath))
  }

  return sourceObj
}

export {fetchData, formatArrayForSelect, getDataBasedOnId, cadastrarOuAtualizar, groupAndSet, setItemsBySelectRelation}