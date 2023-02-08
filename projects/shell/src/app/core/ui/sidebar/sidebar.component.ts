import { DynamicUiWidgetComponent } from './../../../shared/ui/dynmic-ui-widget.component';
import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { PushModule } from '@ngrx/component';
import { DynamicUiService } from '../../../shared/logic/dynamic-ui.service';


@Component({
  selector: 'app-sidebar-cmp',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  imports: [
    NgFor, PushModule,
    RouterLinkWithHref, RouterLinkActive,
    DynamicUiWidgetComponent
  ]
})
export class SidebarComponent {
  connect = inject(DynamicUiService);
}
