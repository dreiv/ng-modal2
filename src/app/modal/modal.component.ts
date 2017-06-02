import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DocumentService } from "../document.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  @HostBinding('class.isShown') isShown: boolean;
  private scrollBarWidth = this.documentService.verticalScrollBarWidth$.getValue();
  private subscription: Subscription;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService) { }

  ngOnInit(): void {
    this.subscription = this.documentService.verticalScrollBarWidth$
      .subscribe((scrollBarWidth)=> {
        this.scrollBarWidth = scrollBarWidth;
        if(this.isShown) {
          this.padVerticalScrollbar();
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  show() {
    if(!this.isShown) {
      this.padVerticalScrollbar();
      this.isShown = true;
    }
  }

  hide() {
    if(this.isShown) {
      if(this.scrollBarWidth > 0){
        this.renderer.removeStyle(document.body, 'overflow');
        this.renderer.removeStyle(document.body, 'padding-right');
      }
      this.isShown = false;
    }
  }

  private padVerticalScrollbar() {
    if(this.scrollBarWidth > 0) {
      this.renderer.setStyle(document.body, 'padding-right', `${this.scrollBarWidth}px`);
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'padding-right');
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
}
