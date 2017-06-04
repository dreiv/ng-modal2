import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class DocumentService {
  private windowResizeSpy$: Subject<any> = new Subject<any>();
  private scrollbarWidth: number;
  verticalScrollbarWidth$ : BehaviorSubject<number>;

  constructor(private zone: NgZone) {
    this.zone.runOutsideAngular(() =>{
      this.computeScrollBarWidth();
      this.spyOnWindowResize();
    });

    this.windowResizeSpy$
      .map(() => { return this.getVerticalScrollbarWidth(); })
      .distinctUntilChanged()
      .subscribe((verticalScrollbarWidth: number) => {
        this.verticalScrollbarWidth$.next(verticalScrollbarWidth);
      });
  }

  private computeScrollBarWidth() {
    const widthNoScroll = 100;
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = `${widthNoScroll}px`;
    outer.style.overflow = "scroll"; // force scrollbars
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner); // add inner div

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer); // cleanup
    this.zone.run(() => {
      this.scrollbarWidth = widthNoScroll - widthWithScroll;
      this.verticalScrollbarWidth$ = new BehaviorSubject<number>(this.getVerticalScrollbarWidth())
    });
  }

  private spyOnWindowResize() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((e: Event) => {
        this.zone.run(() => {
          this.windowResizeSpy$.next(e);
        });
    });
  }

  private getVerticalScrollbarWidth(): number {
    return document.body.scrollHeight > window.innerHeight ?  this.scrollbarWidth : 0;
  }
}
