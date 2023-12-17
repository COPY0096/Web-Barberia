import { DateTime } from "luxon";

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

export { checkCita };
