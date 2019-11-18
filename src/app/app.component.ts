import { Component } from '@angular/core';
import {resultList, SpeechRecognitionService} from '@kamiazya/ngx-speech-recognition';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    SpeechRecognitionService,
  ],
})
export class AppComponent {
  private synth = window.speechSynthesis;
  message = '';
  private voices;
  listen = ""
  title = 'ngRaspberryPi';
  leOn = false

  constructor(public _speech: SpeechRecognitionService,private _http:HttpClient){

  }

  commandVoice() {
    if (this.synth !== null) {
      this.voices = this.synth.getVoices();
      const utterThis = new SpeechSynthesisUtterance('Que accion desea realizar');
      utterThis.lang = 'es-EC';
      this.synth.speak(utterThis);
      const speking = this.synth.speaking;
      this.listen = 'warn';
      setTimeout(() => {
        this._speech.start();
      }, 1500);
      this._speech.onresult = ({results}) => {
        this.message = results.item(0).item(0).transcript;
      };
      this._speech.onend = () => {
        this.listen = '';
        console.log(this.message)
        if (this.message === 'encender') {
          this.leOn = true;
          this._http.get('http://192.168.0.5:4000/encender',{
            headers:{
            'Content-Type':'aplication/json'
            }
          }).subscribe(()=>{

          }); 
          console.log('')
        } if(this.message =='apagar') {
          this.leOn = false;
          this._http.get('http://192.168.0.5:4000/apagar').subscribe(()=>{});
        }
      };
    }
  }
}
