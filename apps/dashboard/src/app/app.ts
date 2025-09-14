import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
    
    ModuleRegistry.registerModules([ AllCommunityModule ]);
    
@Component({
  imports: [RouterModule],
  selector: 'ng-mf-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'dashboard';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
