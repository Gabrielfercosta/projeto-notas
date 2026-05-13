import { useState, useEffect } from 'react'

function useDebounce(valor, delay) {
  const [valorDebounced, setValorDebounced] = useState(valor)
  
  useEffect(() => {
    // 1. cria timer que vai atualizar valorDebounced
    const timer = setTimeout(() => {
      setValorDebounced(valor)
    }, delay)
    
    // 2. função de cleanup: cancela o timer se o valor mudar antes
    return () => clearTimeout(timer)
    
  }, [valor, delay])
  
  return valorDebounced
}

export default useDebounce;