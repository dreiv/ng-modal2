import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DocumentService } from "../document.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.visible') visible: boolean;
  private scrollBarWidth = this.documentService.verticalScrollBarWidth;
  private subscription: Subscription;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService) { }

  ngOnInit(): void {
    this.subscription = this.documentService.verticalScrollBarWidth$
      .subscribe((scrollBarWidth)=> {
        this.scrollBarWidth = scrollBarWidth;
        if(this.visible) {
          this.padVerticalScrollbar();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  show() {
    if(this.visible) {
      return;
    }
    this.padVerticalScrollbar();
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.visible = true;
  }

  hide() {
    if(!this.visible) {
      return;
    }
    this.renderer.removeStyle(document.body, 'overflow');
    if(this.scrollBarWidth > 0){
      this.renderer.removeStyle(document.body, 'padding-right');
    }
    this.visible = false;
  }

  private padVerticalScrollbar() {
    if(this.scrollBarWidth > 0) {
      this.renderer.setStyle(document.body, 'padding-right', `${this.scrollBarWidth}px`);
    } else {
      this.renderer.removeStyle(document.body, 'padding-right');
    }
  }
}
