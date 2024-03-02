import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'nat-list-form',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './list-form.component.html',
  styleUrl: './list-form.component.less',
})
export class ListFormComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }

  showDetail() {
    this.router.navigate([`detail/${this.guidGenerator()}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
