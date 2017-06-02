import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DocumentService } from "../document.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @HostBinding('class.isShown')
  isShown: boolean;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService) { }

  ngOnInit(): void {
    this.subscription = this.documentService.verticalScrollBarWidth$
      .subscribe((scrollBarWidth)=> {
        if(this.isShown) {
          this.handleScrollbar(scrollBarWidth);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  show() {
    if(!this.isShown) {
      this.handleScrollbar(this.documentService.verticalScrollBarWidth$.getValue());
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      this.isShown = true;
    }
  }

  hide() {
    if(this.isShown) {
      this.renderer.removeStyle(document.body, 'padding-right');
      this.renderer.removeStyle(document.body, 'overflow');
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
