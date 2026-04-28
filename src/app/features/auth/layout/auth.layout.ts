import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'dm-auth-layout',
  templateUrl: './auth.layout.html',
  styleUrl: './auth.layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {

}
