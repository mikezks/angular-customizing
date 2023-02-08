import { Component } from "@angular/core";

export const DynComponentFactory = (providedContent: string) => {
  @Component({
    standalone: true,
    template: `<div [innerHtml]="content"></div>`
  })
  class DynComponent {
    content = providedContent
  }

  return DynComponent
};

export const CardComponentFactory = (title: string, content: string) => DynComponentFactory(`
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">${ title }</h2>
    </div>

    <div class="card-body">
      ${ content }
    </div>
  </div>
`);
