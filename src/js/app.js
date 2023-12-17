let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;
const DateTime = luxon.DateTime;

const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); // Muestra y oculta las secciones
  tabs(); // Cambia la sección cuando se presionen los tabs
  botonesPaginador(); // Agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();
  paginaAgil();

  consultarAPI(); // Consulta la API en el backend de PHP

  idCliente();
  nombreCliente(); // Añade el nombre del cliente al objeto de cita
  seleccionarFecha(); // Añade la fecha de la cita en el objeto
  seleccionarHora(); // Añade la hora de la cita en el objeto

  mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
  // Ocultar la sección que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  // Seleccionar la sección con el paso...
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  // Quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  // Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  // Agrega y cambia la variable de paso según el tab seleccionado
  const botones = document.querySelectorAll(".tabs button");
  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      e.preventDefault();

      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();

      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAgil = document.querySelector("#agil");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
    paginaAgil.classList.add("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    paginaAgil.classList.add("ocultar");

    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
    paginaAgil.classList.remove("ocultar");
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;
    paso--;

    botonesPaginador();
  });
}
function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;

    botonesPaginador();
  });
}

function botonAgil() {
  console.log("clicked the button");
  alert("clicked the button");
}

async function buscarServiciosCitas(idCita) {
  let url = `http://localhost:3000/api/citas-servicios?id=${idCita}`;
  let servicios = await fetch(url);
  servicios = await servicios.json();

  return servicios;
}

async function buscarCitas(fecha = "*") {
  let url = `http://localhost:3000/api/citas?fecha=${fecha}`;
  let citas = await fetch(url);
  citas = await citas.json();

  console.log(citas);
  let citasValidas = [];
  for (let cita of citas) {
    let date = DateTime.fromISO(`${cita.fecha}T${cita.hora}`);
    let num_servicios = await buscarServiciosCitas(cita.id);

    if (num_servicios) {
      num_servicios = num_servicios.length;
    } else {
      num_servicios = 0;
    }

    if (date.isValid) {
      citasValidas.push({
        id: cita.id,
        fecha: date,
        usuarioId: cita.usuarioId,
        servicios: num_servicios,
      });
    }
  }
  return citasValidas;
}

function checkCita(citas, newCita) {
  let today = DateTime.now();
  let endNewCita = newCita.fecha.plus({ minutes: newCita.servicios * 30 });

  const startWork = DateTime.fromObject({
    year: today.year,
    month: today.month,
    day: today.day,
    hour: 8,
    minute: 0,
  });

  const endWork = DateTime.fromObject({
    year: today.year,
    month: today.month,
    day: today.day,
    hour: 18,
    minute: 0,
  });

  if (newCita.fecha.weekday > 5) {
    // console.log(`Cita (${newCita.fecha.toString()}) es fin de semana`);
    return false;
  }

  if (
    (newCita.fecha < startWork || newCita.fecha > endWork) &&
    endNewCita < endWork
  ) {
    // console.log(`Cita (${newCita.fecha.toString()}) es fuera de horario`);
    return false;
  }

  for (let oldCita of citas) {
    let endOldCita = oldCita.fecha.plus({ minutes: oldCita.servicios * 30 });
    if (endOldCita > today) {
      if (endOldCita > newCita.fecha && oldCita.fecha < endNewCita) {
        // console.log(
        //   `Cita (${newCita.fecha.toString()}) choca con (${oldCita.fecha.toString()}), vieja cita termina a las(${endOldCita.toString()})`,
        // );
        return false;
      }
    }
  }

  return true;
}

function determine_cita_agil(num_servicios, citas) {
  let today = DateTime.now();
  let startWork = DateTime.fromObject({
    year: today.year,
    month: today.month,
    day: today.day,
    hour: 8,
    minute: 0,
  });

  let endWork = DateTime.fromObject({
    year: today.year,
    month: today.month,
    day: today.day,
    hour: 18,
    minute: 0,
  });

  let newCita = {
    fecha: startWork,
    servicios: num_servicios,
  };

  let endWorkAux = endWork;

  for (let added_day = 0; added_day < 90; added_day++) {
    newCita.fecha = startWork.plus({ days: added_day });
    endWorkAux = endWork.plus({ days: added_day });

    // console.log(`trying day ${added_day + 1} of 90`);

    while (newCita.fecha < endWorkAux) {
      if (checkCita(citas, newCita)) {
        return newCita;
      }
      newCita.fecha = newCita.fecha.plus({ minutes: 10 });
    }
  }
  return null;
}

function paginaAgil() {
  const paginaAgil = document.querySelector("#agil");
  console.log(paginaAgil);
  paginaAgil.addEventListener("click", async function () {
    let citas = await buscarCitas();
    // let listaCitas = [];

    // for (let [index, cita] of citas.entries()) {
    //   let date = DateTime.fromISO(`${cita.fecha}T${cita.hora}`);

    //   if (date.isValid) {
    //     listaCitas.push({
    //       id: cita.id,
    //       fecha: date,
    //       usuarioId: cita.usuarioId,
    //       servicios: index + 1,
    //     });
    //   }
    // }
    // // console.log(listaCitas);
    // citas = listaCitas;

    let newCita = determine_cita_agil(cita.servicios.length, citas);
    if (newCita) {
      console.log(`cita disponible para fecha  ${newCita.fecha.toString()}`);

      cita.fecha = newCita.fecha.toISODate();
      document.querySelector("#fecha").value = cita.fecha;

      cita.hora = newCita.fecha.toFormat("HH:mm");
      document.querySelector("#hora").value = cita.hora;
    } else {
      console.log(`cita no disponible en los proximos 3 meses.`);
    }
  });
}

async function consultarAPI() {
  try {
    const url = "http://localhost:3000/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();
    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  // Identificar el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si un servicio ya fue agregado
  if (servicios.some((agregado) => agregado.id === id)) {
    // Eliminarlo
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    // Agregarlo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
  // console.log(cita);
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}
function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", function (e) {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    
    if (hora < 8 || hora > 18) {
      e.target.value = "";
      mostrarAlerta("Hora No Válida", "error", ".formulario");
    } else {
      cita.hora = e.target.value;

      // console.log(cita);
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  // Previene que se generen más de 1 alerta
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  // Scripting para crear la alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    // Eliminar la alerta
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  // Limpiar el Contenido de Resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de Servicios, Fecha u Hora",
      "error",
      ".contenido-resumen",
      false
    );

    return;
  }

  // Formatear el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  // Heading para Servicios en Resumen
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  // Iterando y mostrando los servicios
  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // Heading para Cita en Resumen
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  // Formatear la fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

  // Boton para Crear una cita
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const { nombre, fecha, hora, servicios, id } = cita;

  let newCita = {
    fecha: DateTime.fromISO(`${cita.fecha}T${cita.hora}`),
    servicios: servicios.length,
  };

  let citas = await buscarCitas();

  if (!checkCita(citas, newCita)) {


    return;
  }

  const idServicios = servicios.map((servicio) => servicio.id);
  // console.log(idServicios);

  const datos = new FormData();

  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("usuarioId", id);
  datos.append("servicios", idServicios);

  // console.log([...datos]);

  try {
    // Petición hacia la api
    const url = "http://localhost:3000/api/citas";
    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resultado = await respuesta.json();
    console.log(resultado);

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: "OK",
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }

  // console.log([...datos]);
}
