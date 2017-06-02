import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { DocumentService } from "../document.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @HostBinding('class.visible') visible: boolean;
  private scrollBarWidth = 0;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.verticalScrollBarWidth$.subscribe((data)=> {
      console.log('data',data);
    });
  }

  show() {
    if(this.visible) {
      return;
    }
    this.renderer.setStyle(document.body, 'padding-right', `${this.documentService.verticalScrollBarWidth$}px`);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.visible = true;
  }

  hide() {
    if(!this.visible) {
      return;
    }
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'padding-right');
    this.visible = false;
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
