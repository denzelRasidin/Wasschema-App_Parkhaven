import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Appointment, SchemaService } from '../../schema.service';

@Component({
  selector: 'app-appointment-button',
  templateUrl: './appointment-button.component.html',
  styleUrls: ['./appointment-button.component.css']
})
export class AppointmentButtonComponent implements OnInit, OnChanges {

  @Input() appointment: Appointment;
  @Input() isPositionedLeft: boolean;

  isEmpty;
  isInThePast;

  currentUserHouseNumber;

  constructor(private authService: AuthService,
              private schemaService: SchemaService) {
  }

  private static checkIfIsInThePast(currentAppointment: Appointment) {
    if (currentAppointment.day.index !== 0 || currentAppointment.time.index === 12) {
      return false;
    }

    const now = new Date();

    const timeOfAppointment = new Date(Date.parse('1/1/1970 ' + currentAppointment.time.value));
    const deadlineToPlaceAppointment = new Date(now.getTime() + (10 * 60000)); // plus 10min

    // If it is between 00:00 and 02:00 that night
    if (deadlineToPlaceAppointment.getHours() < 3) {
      return true;
    }

    const parsedTimeOfAppointment = Date.parse('1/1/1970 ' + timeOfAppointment.getHours() + ':' + timeOfAppointment.getMinutes());
    const parsedDeadlineToPlaceAppointment =
      Date.parse('1/1/1970 ' + deadlineToPlaceAppointment.getHours() + ':' + deadlineToPlaceAppointment.getMinutes());

    return parsedTimeOfAppointment <= parsedDeadlineToPlaceAppointment;
  }

  ngOnInit() {
    this.checkFields();

    // this.currentUserHouseNumber = this.authService.getCurrentSignedInUser().displayName;
  }

  ngOnChanges() {
    this.checkFields();
  }

  makeOrRemoveAppointment() {
    if (this.isEmpty) {
      this.schemaService.addAppointment(this.appointment);
    } else {
      this.schemaService.removeAppointment(this.appointment);
    }
  }

  private checkFields() {
    // - means empty spot
    this.isEmpty = this.appointment.houseNumber === '';
    // time passed
    this.isInThePast = AppointmentButtonComponent.checkIfIsInThePast(this.appointment);
  }
}
