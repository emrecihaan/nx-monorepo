import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-react-wrapper',
  standalone: true,
  template: `<div #reactContainer id="react-container"></div>`,
  styles: [`
    #react-container { 
      width: 100%; 
      height: 100%; 
      display: block;
    }
  `]
})
export class ReactWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reactContainer', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  async ngAfterViewInit() {
    // @ts-ignore: This module is provided by Module Federation at runtime
    const { mount } = await import('shiftApp/Module');
    mount(this.containerRef.nativeElement);
  }

  async ngOnDestroy() {
    // @ts-ignore: This module is provided by Module Federation at runtime
    const { unmount } = await import('shiftApp/Module');
    unmount();
  }
}
