import { DateTime } from "luxon";
import { checkCita } from "./check_cita.js";

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

export { determine_cita_agil };
