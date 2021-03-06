import { Injectable } from '@angular/core';

import { DefaultParams } from 'components/defaults.component';
import { ICoinsData, ICoinParams } from 'interfaces/common';
import { ICredentials } from 'interfaces/userapi-query';
import { IUser } from 'interfaces/user';
import { ETime } from 'enums/time';
import { EUserRoles } from 'enums/role';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor() {}

    private ppdaMode: boolean = false;
    private localTimeD = DefaultParams.LOCALTIMEDELTA;
    private coin: string = '';
    private user: string = '';
    private targetLogin: string = '';
    private userMode: string = 'user';
    private worker: string = '';
    private type: string = DefaultParams.DEFAULTTYPE;
    private coinList: string[] = [];
    private coinListTS: number = 0;
    private coinsData: ICoinsData = {};
    private currentZoom = DefaultParams.ZOOM[this.type];
    private currentZoomList = DefaultParams.ZOOMSLIST[this.type];
    private userData: ICredentials;
    private trgUserData: IUser[];

    private zoomParams = DefaultParams.ZOOMPARAMS;

    get isPPDA(): boolean {
        return this.ppdaMode;
    }
    set isPPDA(ppda: boolean) {
        this.ppdaMode = ppda;
    }

    get locatTimeDelta(): { delta: number; isUpdated: boolean } {
        return this.localTimeD;
    }
    set locatTimeDelta(data: { delta: number; isUpdated: boolean }) {
        if (data) this.localTimeD = data;
        else this.localTimeD = DefaultParams.LOCALTIMEDELTA;
    }
    get zoomsList(): string[] {
        return this.currentZoomList;
    }

    get coinsListTs(): number {
        return this.coinListTS;
    }
    set coinsListTs(ts: number) {
        if (ts) this.coinListTS = ts;
        else this.coinListTS = 0;
    }
    get chartMainCoinName(): string {
        const resp = Object.entries(this.coinsObj).find(coin => {
            return coin[1].is.chartMain;
        });
        if (resp.length > 0) return resp[0];
        else return '';
    }
    get chartMainCoinObj(): ICoinParams {
        const resp = Object.entries(this.coinsObj).find(coin => {
            return coin[1].is.chartMain;
        });
        if (resp.length > 0) return resp[1];
        else return {} as ICoinParams;
    }

    get currentUser(): string {
        return this.user;
    }
    set currentUser(user: string) {
        if (user) this.user = user;
        else this.coin = '';
    }
    get userType(): string {
        return this.userMode;
    }
    set userType(user: string) {
        if (user) this.userMode = user;
        else this.userMode = 'user';
    }
    get currentWorker(): string {
        return this.worker;
    }
    set currentWorker(worker: string) {
        if (worker) this.worker = worker;
        else this.worker = '';
    }

    get currCoin(): string {
        return this.coin;
    }
    set currCoin(coin: string) {
        if (coin) this.coin = coin;
        else this.coin = '';
    }
    get currType(): string {
        return this.type;
    }
    set currType(type: string) {
        if (type) this.type = type;
        else this.type = DefaultParams.DEFAULTTYPE;
    }
    get currZoom(): string {
        return this.currentZoom;
    }
    set currZoom(zoom: string) {
        if (zoom) this.currentZoom = zoom;
        else this.currentZoom = DefaultParams.ZOOM[this.type];
    }
    get currZoomGroupByInterval(): number {
        return this.zoomParams[this.currentZoom].groupByInterval;
    }

    get currZoomStatsWindow(): number {
        return this.zoomParams[this.currentZoom].statsWindow;
    }
    get currZoomMaxStatsWindow(): number {
        return this.zoomParams[this.currentZoom].maxStatsWindow;
    }

    get currZoomTimeFrom(): number {
        //const delta = this.localTimeD.delta;
        const currentTime = parseInt(
            ((new Date().setMinutes(0, 0, 0).valueOf() / 1000) as any).toFixed(0),
        );
        const statsWindow = this.zoomParams[this.currentZoom].statsWindow;
        const groupByInterval = this.zoomParams[this.currentZoom].groupByInterval;
        return currentTime - statsWindow * groupByInterval;
    }

    get coinsList(): string[] {
        return this.coinList;
    }
    set coinsList(coins: string[]) {
        if (coins) this.coinList = coins;
        else this.coinList = [];
    }
    get coinsObj(): ICoinsData {
        return this.coinsData;
    }
    set coinsObj(data: ICoinsData) {
        if (data) this.coinsData = data;
        else this.coinsData = {} as ICoinsData;
    }

    get activeUserData(): ICredentials | null {
        return this.userData;
    }

    set activeUserData(user: ICredentials | null) {
        if (user) this.userData = user;
        else this.userData = null;
    }

    get targetUserRegDate(): number | null {
        if (this.targetLogin === null) return this.userData.registrationDate;
        if (this.targetLogin === EUserRoles.Admin || this.targetLogin === EUserRoles.Observer) {
            const groupByInterval = ETime.Day;
            const currTime = parseInt(
                ((new Date().setMinutes(0, 0, 0).valueOf() / 1000) as any).toFixed(0),
            );
            return currTime - 30 * groupByInterval;
        } else
            return this.trgUserData.find(el => {
                return el.login === this.targetLogin;
            }).registrationDate;
    }

    get allUsersData(): IUser[] | null {
        return this.trgUserData;
    }

    set allUsersData(user: IUser[] | null) {
        if (user) this.trgUserData = user;
        else this.trgUserData = null;
    }

    get isReadOnly(): boolean {
        return Boolean(window.localStorage.getItem('isReadOnly')) || false;
    }

    set isReadOnly(isReadOnly: boolean | null) {
        if (isReadOnly) window.localStorage.setItem('isReadOnly', 'true');
        else window.localStorage.removeItem('isReadOnly');
    }

    get sessionId(): string | null {
        return window.localStorage.getItem('sessionId') || null;
    }

    set sessionId(sessionId: string | null) {
        if (sessionId) window.localStorage.setItem('sessionId', sessionId);
        else window.localStorage.removeItem('sessionId');
    }
    /*
    get targetLogin(): string | null {
        return window.localStorage.getItem('targetLogin') || null;
    }

    set targetLogin(targetLogin: string | null) {
        if (targetLogin) window.localStorage.setItem('targetLogin', targetLogin);
        else window.localStorage.removeItem('targetLogin');
    }*/
    get targetUser(): string | null {
        return this.targetLogin || null;
    }

    set targetUser(targetUser: string | null) {
        if (targetUser) this.targetLogin = targetUser;
        else this.targetLogin = null;
    }

    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////
    ///////////////////TODO//////////////////////////////////////TODO///////////////////

    /*
    private allCoins = [] as IPoolCoinsItem[];
    private currentCoin = {};
    private baseCoin = {} as IPoolCoinsItem;
    private chartsLoaded = {};
    private zoomLoading = {};
    private chartsData = {};

    get chartData(): {
        [coin: string]: {
            title: string;
            actualData: IWorkerStatsHistoryItem[];
            prevData: IWorkerStatsHistoryItem[];
            firstTime?: number;
            lastTime?: number;
            timeFrom?: number;
            type?: string;
            workerId?: string;
            oldShifted?: number;
            newPushed?: number;
        };
    } {
        return this.chartsData;
    }
    set chartData(data: {
        [coin: string]: {
            title: string;
            actualData: IWorkerStatsHistoryItem[];
            prevData: IWorkerStatsHistoryItem[];
            firstTime?: number;
            lastTime?: number;
            timeFrom?: number;
            type?: string;
            workerId?: string;
            oldShifted?: number;
            newPushed?: number;
        };
    }) {
        this.chartsData = data;
    }

    get isZoomLoading(): { [coin: string]: boolean } {
        return this.zoomLoading;
    }
    set isZoomLoading(data: { [coin: string]: boolean }) {
        this.zoomLoading = data;
    }
    get isChartsLoaded(): { [coin: string]: boolean } {
        return this.chartsLoaded;
    }
    set isChartsLoaded(data: { [coin: string]: boolean }) {
        this.chartsLoaded = data;
    }

    get whatZoomParams(): {} {
        return this.zoomParamsOld;
    }
    set whatZoomParams(params: {}) {
        if (params) this.zoomParamsOld = params as any;
        else this.zoomParamsOld = {} as any;
    }
    get whatZoom(): string {
        return this.currentZoom;
    }
    set whatZoom(zoom: string) {
        if (zoom) this.currentZoom = zoom;
        else this.currentCoin = {};
    }
    get whatZooms(): string[] {
        return this.zoomListOld;
    }
    set whatZooms(zoom: string[]) {
        if (zoom) this.zoomListOld = zoom;
        else this.currentCoin = {};
    }
    get whatCoin(): {} {
        return this.currentCoin;
    }
    set whatCoin(data: {}) {
        if (data) this.currentCoin = data;
        else this.currentCoin = {};
    }
    get whatBase(): IPoolCoinsItem {
        return this.baseCoin;
    }

    set whatBase(data: IPoolCoinsItem) {
        if (data) this.baseCoin = data;
        else this.baseCoin = {} as IPoolCoinsItem;
    }
    get whatCoins(): IPoolCoinsItem[] {
        return this.allCoins;
    }

    set whatCoins(data: IPoolCoinsItem[]) {
        if (data) this.allCoins = data;
        else this.allCoins = [] as IPoolCoinsItem[];
    }

    get sessionId(): string | null {
        return window.localStorage.getItem('sessionId') || null;
    }

    set sessionId(sessionId: string | null) {
        if (sessionId) window.localStorage.setItem('sessionId', sessionId);
        else window.localStorage.removeItem('sessionId');
    }

    get targetLogin(): string | null {
        return window.localStorage.getItem('targetLogin') || null;
    }

    set targetLogin(targetLogin: string | null) {
        if (targetLogin) window.localStorage.setItem('targetLogin', targetLogin);
        else window.localStorage.removeItem('targetLogin');
    }
    */

    /*
    get poolCoins2(): { [coin: string]: IPoolCoinsData } {
        return JSON.parse(window.localStorage.getItem("coins")) || false;
    }
    set poolCoins2(data: { [coin: string]: IPoolCoinsData }) {
        if (data) window.localStorage.setItem("coins", JSON.stringify(data));
        else window.localStorage.removeItem("coins");
    }
*/
    /*
    get poolCoins(): IPoolCoinsItem[] | null {
        return JSON.parse(window.localStorage.getItem('poolCoins')) || null;
    }
    set poolCoins(poolCoins: IPoolCoinsItem[] | null) {
        if (poolCoins) window.localStorage.setItem('poolCoins', JSON.stringify(poolCoins));
        else window.localStorage.removeItem('poolCoins');
    }*/
    /*
    get coinsCacheTime(): number | null {
        return parseInt(window.localStorage.getItem("coinsCacheTime")) || null;
    }
    set coinsCacheTime(time: number | null) {
        if (time)
            window.localStorage.setItem("coinsCacheTime", time.toString());
        else window.localStorage.removeItem("coinsCacheTime");
    }
*/
    /*
    get poolCoinsliveStat(): IPoolStatsItem | null {
        return JSON.parse(window.localStorage.getItem('poolCoinsliveStat')) || null;
    }
    set poolCoinsliveStat(poolCoinsliveStat: IPoolStatsItem | null) {
        if (poolCoinsliveStat)
            window.localStorage.setItem('poolCoinsliveStat', JSON.stringify(poolCoinsliveStat));
        else window.localStorage.removeItem('poolCoinsliveStat');
    }
    get poolCoinsliveStat2(): { [coin: string]: IPoolStatsData } | null {
        return JSON.parse(window.localStorage.getItem('cLiveStat')) || null;
    }
    set poolCoinsliveStat2(data: { [coin: string]: IPoolStatsData }) {
        if (data) window.localStorage.setItem('cLiveStat', JSON.stringify(data));
        else window.localStorage.removeItem('cLiveStat');
    }

    get currentCoinInfo(): IPoolCoinsItem {
        return JSON.parse(window.localStorage.getItem('currentCoinInfo')) || ({} as IPoolCoinsItem);
    }
    set currentCoinInfo(currentCoinInfo: IPoolCoinsItem | null) {
        if (currentCoinInfo)
            window.localStorage.setItem('currentCoinInfo', JSON.stringify(currentCoinInfo));
        else window.localStorage.removeItem('currentCoinInfo');
    }

    get currentCoinInfoWorker(): IPoolCoinsItem {
        return (
            JSON.parse(window.localStorage.getItem('currentCoinInfoWorker')) ||
            ({} as IPoolCoinsItem)
        );
    }
    set currentCoinInfoWorker(currentCoinInfoWorker: IPoolCoinsItem | null) {
        if (currentCoinInfoWorker)
            window.localStorage.setItem(
                'currentCoinInfoWorker',
                JSON.stringify(currentCoinInfoWorker),
            );
        else window.localStorage.removeItem('currentCoinInfoWorker');
    }

    get currentUser(): string | null {
        return window.localStorage.getItem('currentUser') || null;
    }
    set currentUser(currentUser: string | null) {
        if (currentUser) window.localStorage.setItem('currentUser', currentUser);
        else window.localStorage.removeItem('currentUser');
    }
    get chartsTimeFrom(): number | null {
        return parseInt(window.localStorage.getItem('chartsTimeFrom')) || null;
    }
    set chartsTimeFrom(chartsTimeFrom: number | null) {
        if (chartsTimeFrom)
            window.localStorage.setItem('chartsTimeFrom', chartsTimeFrom.toString());
        else window.localStorage.removeItem('chartsTimeFrom');
    }

    get chartsWorkerTimeFrom(): number | null {
        return parseInt(window.localStorage.getItem('chartsWorkerTimeFrom')) || null;
    }
    set chartsWorkerTimeFrom(chartsWorkerTimeFrom: number | null) {
        if (chartsWorkerTimeFrom)
            window.localStorage.setItem('chartsWorkerTimeFrom', chartsWorkerTimeFrom.toString());
        else window.localStorage.removeItem('chartsWorkerTimeFrom');
    }
    */
    /*
    get chartsDataLoaded(): { [coin: string]: boolean | false } {
        return JSON.parse(window.localStorage.getItem("chDLoaded")) || false;
    }
    set chartsDataLoaded(data: { [coin: string]: boolean }) {
        if (data)
            window.localStorage.setItem("chDLoaded", JSON.stringify(data));
        else window.localStorage.removeItem("chDLoaded");
    }
    */
    /*
    get charts1BaseData(): {
        title: string;
        data: IWorkerStatsHistoryItem[];
        firstTime?: number;
        lastTime?: number;
        timeFrom?: number;
        type?: string;
        workerId?: string;
    } | null {
        return JSON.parse(window.localStorage.getItem('chBData')) || null;
    }
    set charts1BaseData(
        chartsBaseData: {
            title: string;
            data: IWorkerStatsHistoryItem[];
            firstTime?: number;
            lastTime?: number;
            timeFrom?: number;
            type?: string;
            workerId?: string;
        } | null,
    ) {
        if (chartsBaseData) window.localStorage.setItem('chBData', JSON.stringify(chartsBaseData));
        else window.localStorage.removeItem('chBData');
    }

    get chartsWorkerBaseData(): {
        title: string;
        data: [];
    } | null {
        return JSON.parse(window.localStorage.getItem('chartsWorkerBaseData')) || {};
    }
    set chartsWorkerBaseData(
        chartsWorkerBaseData: {
            title: string;
            data: [];
        } | null,
    ) {
        if (chartsWorkerBaseData)
            window.localStorage.setItem(
                'chartsWorkerBaseData',
                JSON.stringify(chartsWorkerBaseData),
            );
        else window.localStorage.removeItem('chartsWorkerBaseData');
    }

    get currentUserliveStat(): IUserStats | null {
        return JSON.parse(window.localStorage.getItem('currentUserliveStat')) || null;
    }
    set currentUserliveStat(currentUserliveStat: IUserStats | null) {
        if (currentUserliveStat)
            window.localStorage.setItem('currentUserliveStat', JSON.stringify(currentUserliveStat));
        else window.localStorage.removeItem('currentUserliveStat');
    }

    get currentWorkerName(): string | null {
        return window.localStorage.getItem('currentWorkerName') || null;
    }
    set currentWorkerName(currentWorkerName: string | null) {
        if (currentWorkerName) window.localStorage.setItem('currentWorkerName', currentWorkerName);
        else window.localStorage.removeItem('currentWorkerName');
    }
    get needWorkerInint(): boolean | null {
        return window.localStorage.getItem('needWorkerInint') == 'true' || null;
    }
    set needWorkerInint(needWorkerInint: boolean | null) {
        if (needWorkerInint)
            window.localStorage.setItem('needWorkerInint', needWorkerInint.toString());
        else window.localStorage.removeItem('needWorkerInint');
    }
*/
    /*    get currentWorkerliveStat(): IWorkerStatsItem[] | null {
        return (
            JSON.parse(window.localStorage.getItem("currentWorkerliveStat")) ||
            null
        );
    }
    set currentWorkerliveStat(
        currentWorkerliveStat: IWorkerStatsItem[] | null,
    ) {
        if (currentWorkerliveStat)
            window.localStorage.setItem(
                "currentWorkerliveStat",
                JSON.stringify(currentWorkerliveStat),
            );
        else window.localStorage.removeItem("currentWorkerliveStat");
    }
*/
    /*
    get userSettings(): {} | null {
        return JSON.parse(window.localStorage.getItem('userSettings')) || null;
    }
    set userSettings(userSettings: {} | null) {
        if (userSettings) window.localStorage.setItem('userSettings', JSON.stringify(userSettings));
        else window.localStorage.removeItem('userSettings');
    }

    get userCredentials(): {} | null {
        return window.localStorage.getItem('userCredentials') || null;
    }
    set userCredentials(userCredentials: {} | null) {
        if (userCredentials)
            window.localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
        else window.localStorage.removeItem('userCredentials');
    }*/
}
