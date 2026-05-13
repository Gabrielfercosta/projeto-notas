import { useState, useEffect, useReducer } from 'react'
import useFetch from './hooks/useFetch'
import useDebounce from './hooks/useDebounce'
import notasReducer from './reducers/notasReducer'

function App() {
  // const dados que representa os dados do json, carregando como boolean true enquanto carrega e erro para guardar os erros, useFetch usando o link do server local
  const {dados, carregando, erro} = useFetch("http://localhost:3001/notas")
  const [titulo, setTitulo] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [editandoId, setEditandoId] = useState(null)
  const [tituloEdit, setTituloEdit] = useState("")
  const [conteudoEdit, setConteudoEdit] = useState("")
  const [busca, setBusca] = useState("")
  const buscaDebounced = useDebounce(busca, 300)
  
  // declarado notas como nossa array principal e dispatch para manipulá-la, useReducer apontando para o notasReducer que foi criado no reducers
  // null como valor inicial que é ignorado por causa do terceiro parâmetro, que é a função que retorna os dados salvos, se houver
  
  const [notas, dispatch] = useReducer(notasReducer, null, ()=> {
      const salvo = localStorage.getItem('notas')
      return salvo !== null ? JSON.parse(salvo) : []
    }
  )

 // filtro para pegar pega barra de busca todos os dados que em titulo ou em conteudo são, em lowerCase, iguais a palavra buscada
 const notasFiltradas = notas.filter(n => n.titulo.toLowerCase().includes(buscaDebounced.toLowerCase()) || n.conteudo.toLowerCase().includes(buscaDebounced.toLowerCase()))
  
  // useEffect que roda toda vez que o app monta e que dados muda, se o (dados) existir e não houver nenhuma nota ainda (localStorage vazio) o dispatch
  // dispara usando o CARREGAR do reducer e passando os dados pelo payload, com o carregar atribuindo os dados às notas
  
  useEffect(() => {
    if(dados && notas.length === 0){
      dispatch ({ type: 'CARREGAR', payload: dados})
    }
  }, [dados])

  // quando notas tem alteração o useEffect salva a string (usando um stringify de notas) no localStorage para manter os dados (persistencia)
  
  useEffect(() => {
    localStorage.setItem('notas', JSON.stringify(notas))
  }, [notas])

  // adicionar verifica se o titulo nao ta vazio (pra não adicionar valores vazios nas notas), depois chama a função de adicionar passando o payload e
  // seta o titulo e o conteudo como vazios novamente (pra poder adicionar mais coisas depois e o texto sumir do input ao ser adicionado)

  function adicionar(){
    if(titulo.trim() === ""){
      return
    }
    dispatch({ type: 'ADICIONAR', payload: {titulo: titulo, conteudo: conteudo}})
    setTitulo("")
    setConteudo("")
  }

  function deletar(id){
    dispatch({ type: 'DELETAR', payload: { id: id }})
  }

  function fixar(id){
    dispatch({ type: 'ALTERNAR_FIXADA', payload: { id: id }})
  }

  function iniciarEdicao(nota){
    setEditandoId(nota.id)
    setTituloEdit(nota.titulo)
    setConteudoEdit(nota.conteudo)
  }

  function salvarEdicao(id){
    dispatch({ type: 'EDITAR', payload: { id: id, titulo: tituloEdit, conteudo: conteudoEdit } })
    setEditandoId(null)
    setTituloEdit("")
    setConteudoEdit("")
  }

  function cancelarEdicao(){
    setEditandoId(null)
    setTituloEdit("")
    setConteudoEdit("")
  }
  
  // early returns pra garantir que não ta carregando ainda e não deu nenhum erro
  if(carregando){
    return <p>carregando notas...</p>
  }

  if(erro){
    return <p>Erro: {erro}</p>
  }
  
  return (
    <div>
      <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
      {/* input que ao inserir coisas altera o titulo com setTitulo  */}
      <input type="text" placeholder='Titulo' value={titulo} onChange={e => setTitulo(e.target.value)} />
      <input type="text" placeholder='Conteúdo' value={conteudo} onChange={e => setConteudo(e.target.value)} />
      <button onClick={adicionar}>Adicionar</button>
      {notasFiltradas.map(n => (
        <div key={n.id}>
          {editandoId === n.id ? (
            <div>
              <input type="text" placeholder='Titulo' value={tituloEdit} onChange={e => setTituloEdit(e.target.value)} />
              <input type="text" placeholder='Conteúdo' value={conteudoEdit} onChange={e => setConteudoEdit(e.target.value)} />
              <button onClick={() => salvarEdicao(n.id)}>Salvar</button>
              <button onClick={cancelarEdicao}>Cancelar</button>
            </div>
          ) : (
            <div>
              <h2>{n.titulo}</h2> 
              <h3>{n.conteudo}</h3>
              <button onClick={() => deletar(n.id)}>Remover</button>
              <button onClick={() => fixar(n.id)}>{n.fixada ? 'Fixado' : 'Não Fixado'}</button>
              <button onClick={() => iniciarEdicao(n)}>Editar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default App;