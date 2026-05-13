import { useState, useEffect } from 'react'

function useLocalStorage(chave, valorInicial) {
    const [valor, setValor] = useState(() => {
        const salvo = localStorage.getItem(chave)
        return salvo ? JSON.parse(salvo) : valorInicial
    })

    useEffect(() => {
        localStorage.setItem(chave, JSON.stringify(valor))
    }, [valor, chave])

    return[valor, setValor]
}

export default useLocalStorage;