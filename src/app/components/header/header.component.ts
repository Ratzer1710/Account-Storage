import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() onConfig: EventEmitter<void> = new EventEmitter();

  constructor(){}

  onConfiguration(): void {
    this.onConfig.emit();
  }

}
