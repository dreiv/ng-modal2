import {Component, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  show() {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hide() {
    this.renderer.removeStyle(document.body, 'overflow');
  }

}
