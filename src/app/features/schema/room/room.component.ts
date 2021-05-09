import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { MachineInfo, SchemaService } from "../schema.service";
import { Subscription } from "rxjs/internal/Subscription";
import { switchMap } from "rxjs/operators";
import { LoaderService } from "../../../shared/loader/loader.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { DatePipe } from '@angular/common'

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnInit, OnDestroy {
  days:any;
  times = [];
  dryerTimes;

  roomId: string;

  // currentRoomMachinesInfo: MachineInfo[];

  machines = {};
  currentRoomMachinesInfo: any;
  private megaSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private schemaService: SchemaService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    public datepipe: DatePipe
  ) {}

  ngOnInit() {
    var d = '2021-05-09T17:50:47.077Z';
d = d.split('T')[0];
console.log(d);
    this.loaderService.show();
   this.days = [];
    for (let i = 0; i < 7; i++) {
      this.days.push({
        id:(new Date(new Date().setDate(new Date().getDate() + i)).toISOString()).split('T')[0]
      })
    }

    console.log("lllllllllllllllllllllllllllllllll");

    this.activeRoute.params.subscribe((routeParams) => {
      // this.loadUserDetail(routeParams.id);
      console.log(routeParams.id);
      const token = localStorage.getItem("token");
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      let RequestOptions = { headers: headers };
      let loginUrl =
        "api/v1/building/woongebouw-parkhaven/room/" + routeParams.id;
      this.http.get(loginUrl, RequestOptions).subscribe((data) => {
        // console.log('api/v1/building/woongebouw-parkhaven/room/A')
        console.log('============='+data);
        this.currentRoomMachinesInfo = data;
        console.log("+++++++++++++")
        console.log(this.currentRoomMachinesInfo);
      });
      this.loaderService.hide();
    });
    let a = this.route.snapshot.paramMap.get("id");
    console.log("dddddddddddddddddddddddddddddd" + a);
    // this.loaderService.show();

    this.times = this.schemaService.times;
    this.dryerTimes = this.times.slice(1);
    console.log(this.dryerTimes);
    this.dryerTimes.push("01:00");

    // TODO: If the userData leaves the tab open for more than a day.. I will just have a please refresh notification
    // this.days = this.schemaService.days;
    // for (let day of this.days) {
    //   if (!day.isCurrentWeek) {
    //     day.isStartNextWeek = true;
    //     break;
    //   }
    // }
    // const token =  localStorage.getItem('token')
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    // let  RequestOptions = ({ headers: headers });
    // let loginUrl =
    //   "api/v1/building/woongebouw-parkhaven/room/A";
    // this.http.get(loginUrl,  RequestOptions ).subscribe((data) => {
    //   console.log('api/v1/building/woongebouw-parkhaven/room/A')
    //   console.log(data);
    //   // data = this.roomData
    // })
    // This is the most important part. Based on the route (room id) the specific firebase path
    // is selected schema/room.id
    // this.megaSubscription = this.route.params.pipe(switchMap(roomParams => {
    //   this.roomId = roomParams.id;
    //   console.log('roomId', this.roomId);
    // }))
    // this.currentRoomMachinesInfo = this.getCurrentRoomMachinesInfo(this.schemaService.machinesInfo);

    //   this.machines = this.createEmptyMachinesArray();

    //   return this.schemaService.fetchMachinesData(this.roomId, this.days[0].id, this.days[6].id).stateChanges();
    // })).subscribe((documentChangeAction) => {
    //   documentChangeAction.forEach((doc: any) => {
    //     // console.log(doc);
    //     const appointment = doc.payload.doc.data();
    //     if (doc.type === 'added') { // the first pull always has doc.type = added
    //       this.machines[appointment.machine][appointment.date][appointment.time] = appointment.houseNumber;
    //       // console.log('appointment added', appointment);
    //     } else { // doc.type === 'removed'
    //       this.machines[appointment.machine][appointment.date][appointment.time] = '';
    //       // console.log('appointment removed', appointment);
    //     }
    //   });

    // this.loaderService.hide();
    // });
  }

  ngOnDestroy(): void {
    // this.megaSubscription.unsubscribe();

    this.loaderService.hide();
  }

  private createEmptyMachinesArray() {
    const machines = {};
    // for (const machinesInfo of this.currentRoomMachinesInfo) {
    //   const machine = {};
    //   for (const day of this.days) {
    //     const dayArray = [];
    //     for (let time = 0; time < 13; time++) {
    //       dayArray.push("");
    //     }
    //     machine[day.id] = dayArray;
    //   }
    //   machines[machinesInfo.id] = machine;
    // }
    // return machines;
  }

  private getCurrentRoomMachinesInfo(machinesInfo: MachineInfo[]) {
    return machinesInfo.filter((machine) => machine.room.id === this.roomId);
  }

  public readableType(type: string) {
    if (type === "WASHER") {
      return "Laundry machine";
    } else {
      return "Dryer";
    }
  }
}
