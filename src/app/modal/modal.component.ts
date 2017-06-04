import { Component, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { DocumentService } from "../document.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements  OnDestroy {
  private subscription: Subscription;

  @HostBinding('class.show')
  isShown: boolean;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  show() {
    if(!this.isShown) {
      this.handleScrollbar(this.documentService.verticalScrollbarWidth$.getValue());
      this.renderer.setStyle(document.body, 'overflow', 'hidden');

      this.subscription = this.documentService.verticalScrollbarWidth$
        .subscribe((scrollBarWidth)=> {
          if(this.isShown) {
            this.handleScrollbar(scrollBarWidth);
          }
        });
      this.isShown = true;
    }
  }

  hide() {
    if(this.isShown) {
      this.renderer.removeStyle(document.body, 'padding-right');
      this.renderer.removeStyle(document.body, 'overflow');

      this.subscription.unsubscribe();
      this.isShown = false;
    }
  }

  private handleScrollbar(scrollBarWidth: number) {
    if(scrollBarWidth > 0) {
      this.renderer.setStyle(document.body, 'padding-right', `${scrollBarWidth}px`);
    } else {
      this.renderer.removeStyle(document.body, 'padding-right');
    }
  }
}
