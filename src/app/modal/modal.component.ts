import {Component, ElementRef, HostBinding, OnDestroy, Renderer2} from '@angular/core';
import { DocumentService } from "../document.service";
import { Subscription } from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnDestroy {
  private scrollbar$: Subscription;
  private fade$: Subscription;

  @HostBinding('class.show')
  isShown: boolean;
  @HostBinding('class.fade')
  isFading: boolean;

  constructor(private renderer: Renderer2,
              private documentService: DocumentService,
              private element: ElementRef) { }

  ngOnDestroy(): void {
    this.scrollbar$.unsubscribe();
  }

  show() {
    if (!this.isShown) {
      this.handleScrollbar(this.documentService.verticalScrollbarWidth$.getValue());
      this.renderer.setStyle(document.body, 'overflow', 'hidden');

      if(this.fade$) {
        this.fade$.unsubscribe();
      }
      this.scrollbar$ = this.documentService.verticalScrollbarWidth$.subscribe((scrollBarWidth)=> { this.handleScrollbar(scrollBarWidth); });

      this.element.nativeElement.focus();
      this.isShown = true;
    }
  }

  hide() {
    if (this.isShown) {
      this.renderer.removeStyle(document.body, 'padding-right');
      this.renderer.removeStyle(document.body, 'overflow');

      if(this.scrollbar$) {
        this.scrollbar$.unsubscribe();
      }

      this.element.nativeElement.blur();

      this.isFading = true;
      this.fade$ = Observable.fromEvent(this.element.nativeElement, 'transitionend').subscribe((e: Event) => {
        this.isShown = false;
        this.isFading = false;
      });
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
