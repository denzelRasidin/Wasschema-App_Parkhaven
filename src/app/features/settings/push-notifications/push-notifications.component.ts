import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../../../auth/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.css']
})
export class PushNotificationsComponent implements OnInit, OnDestroy {

  notificationsEnabled = false;
  permissionDenied = false;
  permissionGranted = false;

  private getTokenSubscription: Subscription;
  private requestPermissionSubscription: Subscription;
  private messagesSubscription: Subscription;

  constructor(private authService: AuthService,
              private afMessaging: AngularFireMessaging,
              private afFire: AngularFirestore,
              private http: HttpClient,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const notification: any = Notification;

    if (notification.permission === 'default') {
      this.notificationsEnabled = false;
      this.permissionDenied = false;
      this.permissionGranted = false;
    } else if (notification.permission === 'granted') {
      // Check if tokens are similar, refresh token in db
      this.afMessaging.getToken.subscribe(token => {
        this.afFire.collection('pushTokens')
          // .doc(this.authService.getCurrentSignedInUser().displayName).set({token: token})
          // .then(() => {
          //   this.notificationsEnabled = true;
          //   this.permissionDenied = false;
          //   this.permissionGranted = true;
          // });
      });
    } else { // denied
      this.notificationsEnabled = false;
      this.permissionDenied = true;
      this.permissionGranted = false;
    }
  }

  ngOnDestroy() {
    if (this.getTokenSubscription) {
      this.getTokenSubscription.unsubscribe();
    }
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.requestPermissionSubscription) {
      this.requestPermissionSubscription.unsubscribe();
    }
  }

  changeOccurred(slideToggleEvent) {
    console.log('slideToggleEvent', slideToggleEvent);
    if (slideToggleEvent.checked) {
      this.requestPermissionSubscription = this.afMessaging.requestPermission
        .pipe(mergeMapTo(this.afMessaging.tokenChanges))
        .subscribe(token => {
            // add token to backend
            // this.afFire.collection('pushTokens').doc(this.authService.getCurrentSignedInUser().displayName).set({token: token});
            console.log('Permission granted. Token', token);
            // show snackBar that you will get notifications
            this.snackBar.open('You will receive notifications 30 minutes before your appointments.', 'OK');

            // this.messagesSubscription = this.afMessaging.messages.subscribe((message: any) => {
            //   console.log('message', message);
            //   this.snackBar.open(message.notification.body, 'OK', {duration: 30000});
            // });
            this.permissionGranted = true;
          },
          error => {
            console.log('error', error);
            this.notificationsEnabled = false;
            this.permissionDenied = true;
            this.snackBar.open('You denied receiving notifications. ' +
              'To allow it manually, press the icon next to the url.', 'OK', {duration: 30000});
          });
    } else {
      this.getTokenSubscription = this.afMessaging.getToken.pipe(switchMap(token => {
        return this.afMessaging.deleteToken(token);
      })).subscribe(isDeleted => {
        // this.afFire.collection('pushTokens').doc(this.authService.getCurrentSignedInUser().displayName).delete();
        if (this.messagesSubscription) {
          this.messagesSubscription.unsubscribe();
        }
        console.log('token deleted', isDeleted);
        this.permissionGranted = false;
        this.snackBar.open('You disabled notifications.', 'OK');
      });
    }
  }

}
