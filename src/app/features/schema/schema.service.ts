import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material";
import { Subject } from "rxjs/internal/Subject";
import { LoaderService } from "../../shared/loader/loader.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class SchemaService {
  roomsInfo: RoomInfo[] = [
    { id: "A", name: "Room A" },
    { id: "B", name: "Room B" },
    { id: "C", name: "Room C" },
  ];

  times = [
    "05:30",
    "07:00",
    "08:30",
    "10:00",
    "11:30",
    "13:00",
    "14:30",
    "16:00",
    "17:30",
    "19:00",
    "20:30",
    "22:00",
    "23:30",
  ];

  // I need this data in firestore because I will need to confirm that the appointment is a wash or
  // dry appointment when placing it.
  machinesInfo: MachineInfo[] = [];

  // This contains an array of the days to display
  // isDisplayable starts from the current day + 7
  days: { id; isCurrentWeek; isDisplayable }[];
  daysChanged = new Subject<any[]>();

  constructor(
    private http: HttpClient,
    private loadingService: LoaderService,
    private snackBar: MatSnackBar
  ) {}

  onInitFetchMachinesInfo() {
    // return this.afStore.firestore.app.firestore().collection('machinesInfo').get();
  }

  onInitFetchDays() {
    // return this.afStore.collection('days').snapshotChanges();
  }

  fetchMachinesData(room, startingDate, endingDate) {
    console.log("startingDate, endingDate", startingDate, endingDate);
    // return this.afStore.collection('appointments',
    //   ref => ref.where('room', '==', room)
    //     .where('date', '>=', startingDate)
    //     .where('date', '<=', endingDate)
    //     .orderBy('date')
    //     .orderBy('time'));
  }

  removeAppointment(appointment: Appointment) {
    this.loadingService.show();

    // const currentUser = this.authService.getCurrentSignedInUser();
    const tokenBase64 = localStorage.getItem("token");
    console.log(tokenBase64);
    // var jwt = require('jsonwebtoken');
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(tokenBase64);
    const expirationDate = helper.getTokenExpirationDate(tokenBase64);
    var isExpired = helper.isTokenExpired(tokenBase64);
    console.log(decodedToken);
    // console.log(expirationDate)
    // console.log(isExpired)
    // const currentUser =
    // currentUser.getIdToken(true).then(token => {
    //   this.http.put(`${environment.firebaseUrl}/removeAppointment`, {
    //     appointment: appointment,
    //     jwt: token
    //   }).subscribe((response: { message }) => {
    //     this.snackBar.open(response.message, 'OK');
    //   }, (err: HttpErrorResponse) => {
    //     console.log('err', err);
    //   }, () => {
    //     this.loadingService.hide();
    //   });
    // });
  }
  selectRoom(room) {
    console.log(room)

  }
  addAppointment(appointment: Appointment) {
    this.loadingService.show();

    // const currentUser = this.authService.getCurrentSignedInUser();

    // currentUser.getIdToken(true).then(token => {
    //   this.http.put(`${environment.firebaseUrl}/addAppointment`, {
    //     appointment: appointment,
    //     jwt: token
    //   }).subscribe((response: { message }) => {
    //     this.snackBar.open(response.message, 'OK');
    //   }, (err: HttpErrorResponse) => {
    //     console.log('err', err);
    //   }, () => {
    //     this.loadingService.hide();
    //   });
    // });
  }
}

export interface Appointment {
  machineInfo: MachineInfo;
  day: { index: number; value: string };
  time: { index: number; value: string };
  houseNumber: string;
}

export interface RoomInfo {
  id: string;
  name: string;
}

export interface MachineInfo {
  id: string;
  room: RoomInfo;
  type: string;
  color: string;
}
