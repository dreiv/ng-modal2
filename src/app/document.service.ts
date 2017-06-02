import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class DocumentService {
  private scrollSpy$: Subject<any> = new Subject<any>();
  private verticalScrollBarWidth: number;
  verticalScrollBarWidth$ : BehaviorSubject<number>;

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() =>{
      this.computeScrollBarWidth();
      this.spyOnWindow();
    });

    this.verticalScrollBarWidth$ = new BehaviorSubject<number>(this.hasVerticalScrollbar() ? this.verticalScrollBarWidth : 0);
    this.scrollSpy$
      .map(() => {return this.hasVerticalScrollbar()})
      .distinctUntilChanged()
      .subscribe((hasVerticalScrollBar: boolean) => {
      this.verticalScrollBarWidth$.next(hasVerticalScrollBar ? this.verticalScrollBarWidth : 0);
      });
  }

  private computeScrollBarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "50px";
    outer.style.overflow = "scroll"; // force scrollbars
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner); // add inner div

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer); // cleanup
    this.zone.run(() => {
      this.verticalScrollBarWidth = 50 - widthWithScroll;
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

  private hasVerticalScrollbar(): boolean {
    return document.body.scrollHeight > window.innerHeight;
  }
}
