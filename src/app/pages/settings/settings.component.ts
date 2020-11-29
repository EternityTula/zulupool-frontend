import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserApiService } from 'api/user.api';
import { IUserSettings } from 'interfaces/user';
import { TCoinName } from 'interfaces/coin';
import { StorageService } from 'services/storage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
    settingsItems: IUserSettings[];
    selectedIndex: number;
    currentCoin: TCoinName;
    isStarting: boolean;
    form = this.formBuilder.group({
        address: [],
        payoutThreshold: [],
        autoPayoutEnabled: [],
    } as Record<keyof IUserSettings, any>);
    isSubmitting = false;
    private disabledCoin: string;

    get isDisabled(): boolean {
        return this.currentCoin === this.disabledCoin;
    }

    constructor(
        private formBuilder: FormBuilder,
        private userApiService: UserApiService,
        private storageService: StorageService,
        private nzModalService: NzModalService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.isStarting = true;
        this.getSettings();
    }
    onCurrentCoinChange(coin: TCoinName): void {
        if (this.isStarting) return;
        this.currentCoin = coin;
        let index = this.settingsItems.findIndex(el => el.name === coin);
        this.form.patchValue(this.settingsItems[index]);
    }

    changeCoin(): void {
        this.form.patchValue(this.settingsItems[this.selectedIndex]);
    }

    save(): void {
        if (this.form.value.payoutThreshold === null || this.form.value.address === null) return;
        this.isSubmitting = true;

        const index = this.settingsItems.findIndex(el => el.name === this.currentCoin);
        let coinName = this.settingsItems[index].name;
        const coinObj = this.storageService.coinsObj[coinName];
        if (coinObj.is.nameSplitted) coinName = coinObj.info.name + '.' + coinObj.info.algorithm;
        const data = {
            ...this.form.value,
            coin: coinName,
        };

        this.userApiService.userUpdateSettings(data).subscribe(
            () => {
                this.nzModalService.success({
                    nzContent: this.translateService.instant('settings.form.success', {
                        coinName: this.currentCoin,
                    }),
                    nzOkText: this.translateService.instant('common.ok'),
                });
                this.isSubmitting = false;
            },
            () => {
                this.isSubmitting = false;
            },
        );
    }

    private getSettings(): void {
        this.userApiService.userGetSettings().subscribe(({ coins }) => {
            if (coins.length > 0) {
                const coinObj = this.storageService.coinsObj;
                if (coins.length > 2) {
                    const algoCoin = this.storageService.coinsList.find(coin => {
                        return coinObj[coin].is.algo;
                    });
                    const algoData =
                        coins.find(coin => {
                            return coin.name === algoCoin;
                        }) || {};
                    if (algoCoin.length > 0 && Object.keys(algoData).length === 0) {
                        coins.push({
                            name: algoCoin,
                            address: '',
                            payoutThreshold: null,
                            autoPayoutEnabled: false,
                        });
                        this.disabledCoin = algoCoin;
                    }
                }
                coins.forEach(coin => {
                    if (coin.name.split('.').length > 1) {
                        coin.name = coin.name.split('.')[0];
                    }
                });

                this.settingsItems = coins;
                this.currentCoin = coins[coins.length - 1].name;
                this.isStarting = false;
                this.onCurrentCoinChange(this.currentCoin);
            }
        });
    }
}
