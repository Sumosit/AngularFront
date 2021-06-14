import { Component, OnInit, Input } from '@angular/core';
import * as SockJS from "sockjs-client";
import {Stomp} from '@stomp/stompjs';
import {TokenStorageService} from "../_services/token-storage.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import {Observable} from "rxjs";
import { transition, style, animate, trigger } from '@angular/animations';

import { GlobalMessage } from '../global-message';

const enterTransition = transition(':enter', [
  style({
    opacity: 0
  }),
  animate('1s ease-in', style({
    opacity: 1
  }))
]);

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('1s ease-out', style({
    opacity: 0
  }))
]);

const fadeIn = trigger('fadeIn', [
  enterTransition
]);

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    fadeIn,
    fadeOut
  ]
})
export class ChatComponent implements OnInit {

  text = "";
  title = 'grokonez';
  description = 'Angular-WebSocket Demo';

  greetings = [
    {id: 0,
    username:"1",
    message:"2"}
  ];
  disabled = true;
  name: string | undefined;
  private stompClient = null;

  constructor(private tokenStorage: TokenStorageService,
              private httpClient: HttpClient,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.connect();
    this.getGlobalMessages();
    this.updateScroll();
  }

  updateScroll(){
    var element = document.getElementById(".c-c-field");
    // @ts-ignore
    element.scrollTop = element.scrollHeight;
  }

  async getGlobalMessages() {
    const promise = this.httpClient.get('http://localhost:8080/api/user/global/messages').toPromise();
    console.log(promise);
    promise.then((data) => {
      // @ts-ignore
      this.greetings = data;
      this.greetings =  this.greetings.reverse();
      console.log('Promise resolved with: ' + JSON.stringify(data));
    }).catch((error) => {
      console.log('Promise rejected with ' + JSON.stringify(error));
    });
  }
  wordWrap(value:string) {
    return value.replace(new RegExp('\/n', 'g'), '<br/>');
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/gkz-stomp-endpoint');
    // @ts-ignore
    this.stompClient = Stomp.over(socket);

    const _this = this;
    // @ts-ignore
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // @ts-ignore
      _this.stompClient.subscribe('/topic/hi', function (hello) {
        // @ts-ignore
        _this.greetings.unshift(JSON.parse(hello.body));
        console.log(_this.greetings);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      // @ts-ignore
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName() {
    // @ts-ignore
    this.stompClient.send(
      '/gkz/hello',
      {},
      JSON.stringify({
        'name': this.name,
      })
    );
  }

  showGreeting(message: string) {
    // this.greetings.push(message);
  }

  send() {
    let text_copy = this.text;
    this.text = "";
    const msg = {
      username: this.tokenStorage.getUser().username,
      message: text_copy.substring(0, text_copy.length - 1)
    };
    // @ts-ignore
    this.stompClient.send(
      '/gkz/hello',
      {},
      JSON.stringify(msg)
    );
  }

}
