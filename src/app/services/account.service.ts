import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Stock } from './stocks.model';
import { LocalStorageService } from './local-storage.service';
import { AlertService } from './alert.service'

const defaultBalance: number = 10000;

@Injectable()
export class AccountService {
    private _balance: number = defaultBalance;
    private _cost: number = 0;
    private _value: number = 0;
    private _stocks: Stock[] = [];

    constructor(
        private localStorageService: LocalStorageService,
        private alertService: AlertService,
        private currencyPipe: CurrencyPipe) {}

    getBalance(): number { return this._balance; }
    getCost(): number { return this._cost; }
    getValue(): number { return this._value; }
    getStocks(): Stock[] { return this._stocks; }

    purchaseStock(stock: Stock): void {
        stock = Object.assign({}, stock);
        if (stock.price < this._balance) {
            this._balance = this.debit(stock.price, this._balance);
            stock.cost = stock.price;
            this._cost = this.credit(stock.price, this._cost);
            stock.change = 0;
            this._stocks.push(stock);
            this.calculateValue();
            this.cacheValues();
            this.alertService.alert(`You bought ${stock.symbol} for ` + this.currencyPipe.transform(stock.price, 'USD', true, '.2'), 'success');
        } else {
            this.alertService.alert(`You have insufficient funds to buy ${stock.symbol}`, 'danger');
        }
    }

    sell(index: number): void {
        let stock = this._stocks[index];
        if (stock) {
            this._balance = this.credit(stock.price, this._balance);
            this._stocks.splice(index, 1);
            this._cost = this.debit(stock.cost, this._cost);
            this.calculateValue();
            this.cacheValues();
            this.alertService.alert(`You sold ${stock.symbol} for ` + this.currencyPipe.transform(stock.price, 'USD', true, '.2'), 'success');
        } else {
            this.alertService.alert(`You do not own the ${stock.symbol} stock.`, 'danger');
        }
    }

    reset() {
        this._stocks = [];
        this._balance = defaultBalance;
        this._value = this._cost = 0;
    }

    calculateValue() {
        this._value = this._stocks.
        map(stock => stock.price).
        reduce((a, b) => { return a + b }, 0);
    }

    init() {
        this._stocks = this.localStorageService.get('stocks', []);
        this._balance = this.localStorageService.get('balance', defaultBalance);
        this._cost = this.localStorageService.get('cost', 0);
    }

    private cacheValues() {
        this.localStorageService.set('stocks', this._stocks);
        this.localStorageService.set('balance', this._balance);
        this.localStorageService.set('cost', this._cost);
    }

    private debit(amount: number, balance: number): number {
        return (balance * 100 - amount * 100) / 100;
    }

    private credit(amount: number, balance: number): number {
        return (balance * 100 + amount * 100) / 100;
    }
}
