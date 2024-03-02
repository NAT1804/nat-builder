import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'nat-form-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './form-detail.component.html',
  styleUrl: './form-detail.component.less',
})
export class FormDetailComponent {
  private activedRoute = inject(ActivatedRoute);

  id = this.activedRoute.snapshot.paramMap.get('id');
}
