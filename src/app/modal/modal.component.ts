import {Component, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  private scrollBarWidth = 0;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  show() {
    this.renderer.setStyle(document.body, 'padding-right', `${this.getScrollBarWidth()}px`);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hide() {
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'padding-right');
  }

  /**
   * In order for this to work correctly the document body element must have no margins.
   * @returns {number}
   */
  private getScrollBarWidth(): number {
    if (this.scrollBarWidth === 0 && (document.body.scrollHeight > window.innerHeight)) {
      return this.scrollBarWidth  = window.innerWidth - document.body.clientWidth;
    }
    return this.scrollBarWidth;
  }
}
