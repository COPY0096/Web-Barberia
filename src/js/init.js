import { DateTime } from "luxon";
import { determine_cita_agil } from "./determine_cita_agil.js";

async function buscarCitas(fecha = "*") {
  let citas = [
    {
      "id": "1",
      "fecha": "2023-12-21",
      "hora": "15:50:00",
      "usuarioId": "6",
    },
    {
      "id": "4",
      "fecha": "2023-12-15",
      "hora": "18:30:00",
      "usuarioId": "6",
    },
    {
      "id": "5",
      "fecha": "2023-12-18",
      "hora": "09:00:00",
      "usuarioId": "6",
    },
  ];

  return citas;
}

class Cita {
  constructor(titulo, fecha, servicios) {
    this.title = titulo;
    this.fecha = fecha;
    this.servicios = servicios;
  }
}

async function init() {
  let citas = await buscarCitas();
  let listaCitas = [];
  for (let [index, cita] of citas.entries()) {
    let date = DateTime.fromISO(`${cita.fecha}T${cita.hora}`);

    if (date.isValid) {
      listaCitas.push({
        id: cita.id,
        fecha: date,
        usuarioId: cita.usuarioId,
        servicios: index + 1,
      });
    }
  }
  // console.log(listaCitas);
  citas = listaCitas;

  let newCita = determine_cita_agil(1, citas);
  if (newCita) {
    console.log(`Cita disponible para fecha: ${newCita.fecha.toString()}`);
  } else {
    console.log("No hay citas disponibles");
  }
}

init();
