import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FilesystemDirectory, FilesystemEncoding, Plugins} from "@capacitor/core";
import {UtilService} from "../../services/util.service";
import {DataShareService} from "../../services/data-share.service";
import {Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
const { Filesystem } = Plugins;

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],

})
export class SignatureComponent implements OnInit, AfterViewInit{
  @ViewChild('imageCanvas', {static: false}) canvas: ElementRef;
  canvasElement: any;
  imageUri = '';
  imageData = '';

  saveX: number;
  saveY: number;
  STORAGE_KEY = 'IMAGE_LIST';

  storedImages = [];
  public count: number = 0;

  constructor(private util:UtilService,private data: DataShareService, private plt:Platform,
              private storage: Storage,public dialogRef: MatDialogRef<SignatureComponent>,@Inject(MAT_DIALOG_DATA) public dialogData: { data:string }) { }
  ngAfterViewInit(): void {
    // Set the Canvas Element and its size
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 400;
    console.log(FilesystemDirectory.Documents);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.storage.ready().then(() => {
      this.storage.get(this.STORAGE_KEY).then(data => {
        if (data != undefined) {
          this.storedImages = data;
        }
      });
    });
  }





  startDrawing(ev) {
    console.log(this.canvasElement);
    var canvasPosition = this.canvasElement.getBoundingClientRect()

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
  }

  moved(ev) {
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    // ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
    this.count = this.count + 1;
    console.log('cursor moved');
  }



  async saveCanvasImage() {
    try {
      var dataUrl = this.canvasElement.toDataURL();
      let name = new Date().getTime() + '.png';
      this.canvasElement.toBlob((blob) => {
        console.log('Got blob', blob);
        if (blob !== null){
          this.data.signImage = blob;
        } else {
          console.log('Blob is null!');
        }
      });

      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // const fileName = new Date().getTime() + '.png';
      // const result = await Filesystem.writeFile({
      //   path: fileName,
      //   data: dataUrl,
      //   directory: FilesystemDirectory.Data,
      // });
      // // result.
      //  this.imageUri = result.uri;
      // let data = await Filesystem.readFile({
      //   directory: FilesystemDirectory.Data,
      //   encoding: FilesystemEncoding.UTF8,
      //   path: fileName
      // });
      //  this.imageData = data.data;
      // // console.log('Read file', data.data);
      // //
      // this.data.signImage = this.util.b64toBlob(data.data, `image/png`);
      this.dialogRef.close(1);
    } catch(e) {
      console.error('Unable to write file', e);
    }
  }

}
