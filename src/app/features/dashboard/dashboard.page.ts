import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: 'dm-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
}) export class DashboardPage {

}
