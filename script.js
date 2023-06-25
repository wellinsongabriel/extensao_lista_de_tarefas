document.addEventListener('DOMContentLoaded', function () {
    var inputTarefa = document.getElementById('inputTarefa')
    var btnAdicionarTarefa = document.getElementById('btnAdicionarTarefa')
    var listaTarefas = document.getElementById('listaTarefas')
    var informacao = document.getElementById('informacao')

    carregarDados(function (dadosSalvos) {
        dadosSalvos.forEach(tarefa => {
            criarItem(tarefa, listaTarefas)
        })
        informacao.textContent = dadosSalvos.length > 0 ? '' : 'Nenhuma tarefa adicionada'
    })

    btnAdicionarTarefa.addEventListener('click', function () {
        var textoTarefa = inputTarefa.value

        if (textoTarefa !== '' && textoTarefa.length <= 20) {
            criarItem({ "estado": false, "textoTarefa": textoTarefa }, listaTarefas)

            carregarDados(function (dadosSalvos) {
                var listaTarefas = dadosSalvos || []
                listaTarefas.push({ "estado": false, "textoTarefa": textoTarefa })
                gravarDados(listaTarefas)
                informacao.textContent = dadosSalvos.length > 0 ? '' : 'Nenhuma tarefa adicionada'
            })
            inputTarefa.value = ''
        } else if (textoTarefa == '') {
            alert("Informe algum texto para a tarefa")
        } else {
            alert("Informe no máximo 20 caracteres")
        }
    })
})

function criarItem(tarefa, listaTarefas) {
    var div = document.createElement('div')
    var checkbox = document.createElement('input')
    var item = document.createElement('li')
    var btnExcluir = document.createElement('button')
    checkbox.type = 'checkbox'
    btnExcluir.textContent = '🗑'

    div.appendChild(checkbox)
    div.appendChild(document.createTextNode(tarefa.textoTarefa))
    item.appendChild(div)
    item.appendChild(btnExcluir)

    listaTarefas.appendChild(item)
    
    checkbox.checked = tarefa.estado
    checkbox.addEventListener('change', function () {
        tarefa.estado = checkbox.checked
        if (checkbox.checked) {
            div.style.textDecoration = 'line-through'
        } else {
            div.style.textDecoration = 'none'
        }
        carregarDados(function (dadosSalvos){
            var tarefas = dadosSalvos || []
            const index = tarefas.findIndex(item => item.textoTarefa === tarefa.textoTarefa)
            if(index !==-1){
                tarefas[index] = tarefa;
                gravarDados(tarefas)
            }
        })
    })

    btnExcluir.addEventListener('click', function () {
        if (confirm('Tem certeza que deseja apagar esta tarefa')) {
            item.remove()
            carregarDados(function(dadosSalvos){
                var listaTarefas = dadosSalvos || []
                listaTarefas.pop(item)
                gravarDados(listaTarefas)
                informacao.textContent = dadosSalvos.length > 0 ? '' : 'Nenhuma tarefa adicionada'
            })
        }
    })

}

function gravarDados(listaTarefas) {
    chrome.storage.local.set({ 'tarefas': listaTarefas }, function () { })
}

function carregarDados(callback) {
    chrome.storage.local.get('tarefas', function (resultado) {
        var dadosSalvos = resultado.tarefas || []
        callback(dadosSalvos)
    })
}