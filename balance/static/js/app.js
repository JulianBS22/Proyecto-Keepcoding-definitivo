/* recuperar los movimientos de la base de datos en el servidor (backend) */
const peticionarioMovimientos = new XMLHttpRequest()
const peticionarioUpdate = new XMLHttpRequest()
const button= document.querySelector("#btn-alta")
const pideInyectarMovimientos = new XMLHttpRequest()
const ocultacoins = new XMLHttpRequest()
let monedasHttp

//Captura el evento click del botón de alta de movimiento
button.addEventListener('click',clickButton)

function clickButton(){
    const nuevoFormulario = document.querySelector("#bloqueNuevoMov")
    nuevoFormulario.style.display = 'block'
    //se obtiene aqui las monedas disponibles del wallet para rellenar el select del formulario
    obtenerCoinsDisponiblesHttp()
}
function pideMovimientosHttp(){
    peticionarioMovimientos.open("GET", "http://localhost:5000/api/v1/todos", true)
    peticionarioMovimientos.onload = listaMovimientos
    
    peticionarioMovimientos.send()
}

function listaMovimientos() {
    const campos = ['date', 'time', 'moneda_from', 'cantidad_from', 'moneda_to','cantidad_to']
    if (this.readyState === 4 && this.status === 200 ) {
        let movimientos = JSON.parse(this.responseText).datos
       
        const tbody = document.querySelector("#tbbody-movimientos")
        tbody.innerHTML = ""

        for (let i = 0; i < movimientos.length; i++) {
            const fila = document.createElement('tr')
            const movimiento = movimientos[i]
            fila.id = movimiento.id
            for (const campo of campos) {
                const celda = document.createElement('td')
                celda.innerHTML = movimiento[campo]
                fila.appendChild(celda)
            }
            console.log(fila)
            tbody.appendChild(fila)
        }
                
        // Una vez recuperados los movimientos y pintada la tabla de los mismos, llamamos al backend para recuperar el balance a día de hoy
        pideBalanceHttp()

    } else {
        alert("Se ha producido un error al cargar los movimientos")
    }
}


function pideBalanceHttp() {
    peticionarioMovimientos.open("GET", "http://localhost:5000/api/v1/status", true)
    peticionarioMovimientos.onload = detalleBalance
    
    peticionarioMovimientos.send()
}

function detalleBalance() {
    const campos = ['moneda','cantidad']
    
    if (this.readyState === 4 && this.status === 200 ) {
        balanceHttp = JSON.parse(this.responseText).datos
        console.log(balanceHttp)
       // monedero =  JSON.parse(this.responseText)
        const resultado= balanceHttp.valor_actual - balanceHttp.invertido
        //const resultado= monedero.valor_actual-monedero.invertido
       
        const body = document.querySelector("#balance")
               
        body.innerHTML = ""
        
        // Se crea el contenido dinámico 
        const row1 = document.createElement('div')
        row1.setAttribute('class','row')
        const labelInvertido =document.createElement('div')
        labelInvertido.innerText='Invertido:'
        labelInvertido.setAttribute('class','col-4')
        row1.appendChild(labelInvertido)
        const valorInvertido =document.createElement('div')
        valorInvertido.setAttribute('class','col-4')
        valorInvertido.innerText=balanceHttp.invertido
        row1.appendChild(valorInvertido)
        body.appendChild(row1)

        const row2 = document.createElement('div')
        row2.setAttribute('class','row')
        const labelValor =document.createElement('div')
        labelValor.setAttribute('class','col-4')
        labelValor.innerText='Valor:'
        row2.appendChild(labelValor)
        const valorValor =document.createElement('div')
        valorValor.setAttribute('class','col-4')
        //valorValor.innerText=balanceHttp.valor_actual
        valorValor.innerText=balanceHttp.valor_actual
        row2.appendChild(valorValor)
        body.appendChild(row2)

        const row3 = document.createElement('div')
        row3.setAttribute('class','row')
        const labelResultado =document.createElement('div')
        labelResultado.setAttribute('class','col-4')
        labelResultado.innerText='Resultado:'
        row3.appendChild(labelResultado)

        const valorResultado =document.createElement('div')
        valorResultado.setAttribute('class','col-4')
        valorResultado.innerText= resultado
        row3.appendChild(valorResultado)
        body.appendChild(row3)
    } else {
        alert("Se ha producido un error al cargar el balance")
    }
   
}

function cambioDivisa() {
    const formulario = document.forms['cambioDivisaForm'];
    const monedaFrom = formulario.elements["moneda_from"].value;
    const monedaTo = formulario.elements["moneda_to"].value
    const cantidadFrom = formulario.elements["cantidad_from"].value
    if(monedaFrom==""){
        alert('Selecione una moneda origen antes de calcular el cambio')
        return
    }
    if(monedaTo==""){
        alert('Selecione una moneda destino antes de calcular el cambio')
        return
    }
    if(cantidadFrom==""){
        alert('Para calcular el cambio debe introducir una cantidad inicial')
        return
    }

    peticionarioMovimientos.open("GET", "http://localhost:5000/api/v1/tipo_cambio/"+monedaFrom+"/"+monedaTo+"/"+cantidadFrom, true)
    peticionarioMovimientos.onload = pintarResultadoCambioDivisa
    
    peticionarioMovimientos.send()
}
function pintarResultadoCambioDivisa(){
    if (this.readyState === 4 && this.status === 200 ) {
        let cambioHttp = JSON.parse(this.responseText).valor_cambio
        const totalConversion = document.querySelector("#cantidad_to")
        console.log(cambioHttp)
        totalConversion.value=cambioHttp
        
    }else {
        alert ("No se ha podido cambiar la divisa")
    }
        
}
function pideInyectarMovimientosHttp(){

    const movimiento = {
        moneda_from: document.querySelector("#moneda_from").value,
        cantidad_from: document.querySelector("#cantidad_from").value,
        moneda_to: document.querySelector("#moneda_to").value,
        cantidad_to: document.querySelector("#cantidad_to").value,
    }
    console.log(movimiento.moneda_from)
    if(movimiento.moneda_from==""){
        alert('Selecciona la moneda origen para continuar')
        return
    }
    if(movimiento.moneda_to==""){
        alert('Selecciona la moneda destino para continuar')
        return
    }
    if(movimiento.cantidad_from=="" || movimiento.cantidad_from <= 0){
        alert('La cantidad inicial no es correcta')
        return
    }
    if(movimiento.cantidad_to == "" || movimiento.cantidad_to == 0){
        alert('El calculo aún no se ha realizado. Pulse el boton de Calcular')
        return
    }
    if(movimiento.moneda_from == movimiento.moneda_to){
        alert('No se puede realizar el cambio de la misma divisa')
        return
    }
    for(let i= 0; i < monedasHttp.length;i++){
        const moneda=monedasHttp[i]
        if(moneda.moneda==movimiento.moneda_from){
            if  (moneda.cantidad < movimiento.cantidad_from){
                alert('Error en la operación. Sólo tienes '+ moneda.cantidad +' '+ moneda.moneda)
                return null
            }
        }
        
    }
    console.log(movimiento)
    
    pideInyectarMovimientos.open("UPDATE","http://localhost:5000/api/v1/movimientos", true)
    pideInyectarMovimientos.setRequestHeader("Content-Type", "application/json")
    pideInyectarMovimientos.onload = listaMovimientos
    
    pideInyectarMovimientos.send(JSON.stringify(movimiento))
    addMonedaFrom(movimiento.moneda_to)
}

function addMonedaFrom(codigoMoneda){

    const moneda_fromSelect = document.querySelector("#moneda_from")
        
        
    const fila = document.createElement('option')

    fila.innerText = codigoMoneda
    fila.setAttribute('value',codigoMoneda)
    moneda_fromSelect.appendChild(fila)
}
function borraCantidadTo(){
    console.log("entre")
    document.querySelector("#cantidad_to").value = "0"

}
/*function confirmar(){
    if (this.readyState === 4 && this.status === 200 ) {
        let movimientosHttp = JSON.parse(this.responseText)
        const button=document.querySelector('button')
        console.log(button)
  
        console.log(movimientosHttp)
        inyectarMovimientos.value=movimientosHttp
    }
    

}*/
function obtenerCoinsDisponiblesHttp(){
    ocultacoins.open("GET","http://localhost:5000/api/v1/walletcoins", true)
    ocultacoins.onload = obtenerCoinsDisponibles
    ocultacoins.send()
    
}


function obtenerCoinsDisponibles(){
    if (this.readyState === 4 && this.status === 200 ){
        monedasHttp = JSON.parse(this.responseText).wallet
        console.log(monedasHttp)
        const moneda_fromSelect = document.querySelector("#moneda_from")
        
        for (var i = 0; i < monedasHttp.length; i++) {
            const fila = document.createElement('option')

            const moneda = monedasHttp[i]
            fila.innerText = moneda.moneda
            fila.setAttribute('value',moneda.moneda)
            moneda_fromSelect.appendChild(fila)
        }        
       
    } else{
        alert("Error al obtener el wallet")
    }

    
   
}
