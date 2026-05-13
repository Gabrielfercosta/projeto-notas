import { useState, useEffect } from 'react'

function useFetch(url) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

    useEffect(() => {
        async function carregar(){
            setCarregando(true)
            setErro(null)

            try{
               const resposta = await fetch(url)
               if(!resposta.ok){
                 throw new Error("Falha na busca")
               }
               const resultado = await resposta.json()
               setDados(resultado)
            }catch (err){
                setErro(err.message)
            }finally{
                setCarregando(false)
            }
        }
        carregar()
    }, [url])
  

  return { dados, carregando, erro};
}

export default useFetch;