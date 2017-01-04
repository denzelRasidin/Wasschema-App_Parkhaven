package nl.parkhaven.wasschema.model.appointment;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public final class AppointmentService {

	private static final Logger logger = LogManager.getLogger(AppointmentService.class);

	private AppointmentDaoImpl appointmentDao;
	private Appointment appointment;
	private String errorMessage;

	public void addAppointment(Appointment appointment) {
		this.appointment = appointment;
		if (entryValid()) {
			if (dateFree()) {
				placeDate();
			}
		}
	}

	public void removeAppointment(Appointment appointment) {
		boolean removed = new AppointmentDaoImpl().delete(appointment);
		if (!removed) {
			errorMessage = "Failed to remove appointment. Check if given info is correct or if appointment isnt within 30 minutes!";
			logger.warn(
					"Wrong date Or in the passed (remove appointment). GebruikerId: " + appointment.getGebruiker_id());
		}
	}

	public boolean errorOccured() {
		return errorMessage != null;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	private boolean entryValid() {
		if (appointment.getGebruiker_id() > 0) {
			return true;
		} else {
			errorMessage = "You are not logged in!";
			logger.warn("= Bypassed Javascript, entering appointment=");
			return false;
		}
	}

	private boolean dateFree() {
		appointmentDao = new AppointmentDaoImpl();
		if (appointmentDao.read(appointment).getGebruiker_id() == 0) {
			return true;
		} else {
			errorMessage = "Date already taken!";
			logger.warn("Date taken. GebruikerId: " + appointment.getGebruiker_id());
			return false;
		}
	}

	private void placeDate() {
		appointmentDao.update(appointment);
	}

}