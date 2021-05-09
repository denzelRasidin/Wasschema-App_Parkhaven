import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { RoomInfo, SchemaService } from "./schema.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from "@angular/material";
import { AuthService } from "../../auth/auth.service";
import { Subscription } from "rxjs/internal/Subscription";
import { SettingsService } from "../settings/settings.service";
import { Router, NavigationExtras } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-schema",
  templateUrl: "./schema.component.html",
  styleUrls: ["./schema.component.css"],
})
export class SchemaComponent implements OnInit, OnDestroy {
  rooms: RoomInfo[];
  counterData;

  currentDate;

  private fetchUserInformationSubscription: Subscription;
  private fetchFavouriteLaundryRoomSubscription: Subscription;
  data: any;

  constructor(
    private router: Router,
    private schemaService: SchemaService,
    private settingsService: SettingsService,
    private authService: AuthService,
    private bottomSheet: MatBottomSheet,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.rooms = this.schemaService.roomsInfo;

    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let RequestOptions = { headers: headers };
    let loginUrl = "api/v1/building/woongebouw-parkhaven/room";
    this.http.get(loginUrl, RequestOptions).subscribe((data) => {
      console.log(data);
      this.rooms = [
        { id: data[0], name: "Room A" },
        { id: data[1], name: "Room B" },
        { id: data[2], name: "Room C" },
      ];
      console.log(this.rooms);
    });
    const currentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    console.log(currentUser);

    const userInfo = {
      favouriteRoom: "A",
    };
    console.log(userInfo);
    this.router.navigate([`room/${userInfo.favouriteRoom}`]);

    // this.fetchUserInformationSubscription =
    //   this.authService.fetchUserInformation().valueChanges().subscribe((userData: any) => {
    //     this.counterData = userData.counters;
    //     console.log('this.counterData', this.counterData);
    //   });
    this.counterData = currentUser.houseNumber.counter;
    console.log("this.counterData", this.counterData);
    this.currentDate = new Date();
  }
  selectRoom(room) {
    // console.log(SchemaService)
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let RequestOptions = { headers: headers };
    let URL = "api/v1/building/woongebouw-parkhaven/room/" + room;
    console.log(URL);
    this.http.get(URL, RequestOptions).subscribe((data) => {
      console.log(data);
      this.data = data
    });
    this.router.navigate(['/room/',room]);
  }

  ngOnDestroy(): void {
    // this.fetchUserInformationSubscription.unsubscribe();
    // this.fetchFavouriteLaundryRoomSubscription.unsubscribe();
  }

  getCounters() {
    this.bottomSheet.open(CounterSheetComponent, {
      data: { counter: this.counterData },
    });
  }
}

@Component({
  selector: "counter-sheet",
  template: ` <mat-nav-list>
    <a mat-list-item>
      <span mat-line>Remaining this week:</span>
      <span mat-line
        >Laundry machine appointments:
        {{ 3 - data.counter.laundrymachine }}</span
      >
      <span mat-line>Dryer appointments: {{ 3 - data.counter.dryer }}</span>
    </a>

    <a mat-list-item>
      <span mat-line>Remaining next week:</span>
      <span mat-line
        >Laundry machine appointments:
        {{ 3 - data.counter.nextWeekLaundrymachine }}</span
      >
      <span mat-line
        >Dryer appointments: {{ 3 - data.counter.nextWeekDryer }}</span
      >
    </a>
  </mat-nav-list>`,
})
export class CounterSheetComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}
}
