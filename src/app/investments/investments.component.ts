import { Component, DoCheck } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements DoCheck {
  cost: number = 0;
  value: number = 0;
  change: number = 0;
  stocks: any = [];
  length: number = 0;

  constructor(public accountService: AccountService) {}

  ngDoCheck(): void {
    if (this.accountService.getStocks().length !== this.stocks.length) {
      this.stocks = this.accountService.getStocks();
    }
    if (this.cost !== this.accountService.getCost() || this.value !== this.accountService.getValue()) {
      this.cost = this.accountService.getCost();
      this.value = this.accountService.getValue();
      this.change = this.accountService.getValue() - this.accountService.getCost();
    }
  }

  sell(index): void {
    this.accountService.sell(index);
  }
}
