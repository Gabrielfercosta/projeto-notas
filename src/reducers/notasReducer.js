function notasReducer(notas, acao){
    switch(acao.type){
        // dispatch envia os dados do json via payload -> case CARREGAR retorna os dados -> react atualiza notas com esse return
        case 'CARREGAR':
            return acao.payload;
        // adicionar usando o date.now para gerar um id único que não vai se repetir, tudo sendo puxado do payload e fixada sendo false por default
        case 'ADICIONAR':
            return [...notas, {id: crypto.randomUUID, titulo: acao.payload.titulo, conteudo: acao.payload.conteudo, fixada: false}]
        // cria nova array sem o registro em que id.geral for igual a id.aSerRemovido (o id do registor que quero apagar)
        case 'DELETAR':
            return notas.filter(n => n.id !== acao.payload.id)
        // mesma lógica de comparar id's, se for true retorna o titulo e conteudo dele atualizado pelo que vem no payload, senão só retorna n
        case 'EDITAR':
            return notas.map(n => n.id === acao.payload.id ? {...n, titulo: acao.payload.titulo, conteudo: acao.payload.conteudo} : n)
        // mesma coisa de cima
        case 'ALTERNAR_FIXADA':
            return notas.map(n => n.id === acao.payload.id ? {...n, fixada: !n.fixada} : n)
        // no caso de uma função desconhecida, retorna o array inalterado novamente    
        default:
            return notas;
    }
}

export default notasReducer;