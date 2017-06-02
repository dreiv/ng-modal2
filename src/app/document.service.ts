import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from "rxjs/Rx";

@Injectable()
export class DocumentService {
  private scrollSpy$: Subject<any> = new Subject<any>();
  private verticalScrollBarWidth: number;
  verticalScrollBarWidth$ : Subject<number> = new Subject<number>();


  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() =>{
      this.computeScrollBarWidth();
      this.spyOnWindow();
    });

    this.scrollSpy$
      .map(() => {return document.body.scrollHeight > window.innerHeight})
      .distinctUntilChanged()
      .subscribe((hasVerticalScrollBar: boolean) => {
      this.verticalScrollBarWidth$.next(hasVerticalScrollBar ? this.verticalScrollBarWidth : 0);
      });
  }

  private computeScrollBarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll"; // force scrollbars

    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner); // add inner div

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer); // cleanup

    this.zone.run(() => {
      this.verticalScrollBarWidth = widthNoScroll - widthWithScroll;
    });
  }

  private spyOnWindow() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(400).distinctUntilChanged().subscribe((e: Event) => {
      this.zone.run(() => {
        this.scrollSpy$.next(e);
      });
    })
  }
}
