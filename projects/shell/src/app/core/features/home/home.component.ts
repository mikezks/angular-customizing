import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Angular Runtime Customizing</h2>
      </div>

      <div class="card-body">
        <p>
          Add, replace, or remove implementations from a separate build process w/o
          a browser reload by using Module Federation.</p>
        <ul>
          <li>Micro Apps</li>
          <li>Features</li>
          <li>Services</li>
          <li>Functions</li>
        </ul>
      </div>
    </div>
  `
})
export class HomeComponent {

}
