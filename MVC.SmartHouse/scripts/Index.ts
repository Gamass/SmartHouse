class Dictionary<T>{
    private List: { [index: number]: T } = {};
    public Add(Key: number, Value: T): void {
        this.List[Key] = Value;
    }

    public Del(Key: number): void {
        delete this.List[Key];
        $("#div_" + Key).remove();
        $.ajax({
            url: "/My/DevAct/Delete/" + Key
        });
    }

    public Get(Key: number): T {
        return this.List[Key];
    }
}

let List: Dictionary<Dev> = new Dictionary<Dev>();

$(document).ready(function () {
    let devs: any = $("#devices").children();
    console.log(devs.length);
    for (var i = 0; i < devs.length; i++) {
        let num: number = devs[i].getAttribute('id').split("_")[1];
        let name: string = devs[i].className;
        Factory(name, num);
    }
});

function AddButtonPress(): void {
    let DevSelect: string = $("#DevSelect").val();
    $.ajax({
        url: "/My/Add/" + DevSelect,
        success: function (data) {
            $("#devices").append(data);
            let num: number = parseInt($("#devices").children().last().attr('id').split("_")[1]);
            Factory(DevSelect, num);
        }
    });
}

function Factory(name: string, num: number): void {
    switch (name) {
        case "light":
            List.Add(num, new Light(num, new SimpleMode(num)));
            break;
        case "tv":
            List.Add(num, new TV(num, new SimpleMode(num), new TvChannel(num), new SimpleVolume(num)));
            break;
        case "cond":
            let term: Termostat = new Termostat(num);
            List.Add(num, new Conditioner(num, term, term));
            break;
        case "ref":
            List.Add(num, new Refrigerator(num, new SimpleMode(num), new RefTemp(num), new RefSpaceSimple(num)));
            break;
        case "micr":
            List.Add(num, new Microwave(num, new SimpleMode(num), new TimerMicr(num)));
            break;
    }
}

class Overlay {
    public static Show(value: string, wait: number = 2500): void {
        location.href = "#close";
        $("#overlay_lbl").text(value);
        location.href = "#overlay";
        setTimeout(function() {
            Overlay.Hide();
        }, wait);
    }

    public static Hide(): void {
        location.href = "#close";
    }
}

abstract class Dev {
    protected num: number;
    private lblPower: JQuery;

    protected get PowerState(): string {
        return this.lblPower.text();
    }

    constructor(num: number) {
        this.lblPower = $("#lbl_pwr_" + num);
    }

    protected set PowerState(value: string) {
        this.lblPower.text(value);
    }

    protected abstract enableContent(): void;

    public SwitchPower(): void {
        let tmp: Dev = this;
        let link: string = "/My/DevAct/" + "Power" + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.PowerState = data;
                tmp.enableContent();
            }
        });
    }
}


interface IPmode {
    PmodeValue: string;
    EnablePmode(visible: boolean): void;
    ChangePmode(visible: boolean): void;
    SwitchMode(Switch: boolean): void;
}

class SimpleMode implements IPmode {
    private hiddenPmodes: string[];
    private _pmode: JQuery;
    private btnPmodeUp: JQuery;
    private btnPmodeDown: JQuery;
    private num: number;
    public get PmodeValue(): string {
        return this._pmode.text();
    }
    public set PmodeValue(value: string) {
        this._pmode.text(value);
    }

    constructor(num: number) {
        this.hiddenPmodes = $("#lbl_modes_" + num).text().split(" ");
        this._pmode = $("#lbl_pmode_" + num);
        this.btnPmodeUp = $("#pmode_up_" + num);
        this.btnPmodeDown = $("#pmode_dn_" + num);
        this.num = num;
    }

    public EnablePmode(visible: boolean): void {
        if (this.PmodeValue == this.hiddenPmodes[0]) {
            this.btnPmodeUp.prop("disabled", visible);
        }
        else if (this.PmodeValue == this.hiddenPmodes[1]) {
            this.btnPmodeDown.prop("disabled", visible);
        }
        else {
            this.btnPmodeUp.prop("disabled", visible);
            this.btnPmodeDown.prop("disabled", visible);
        }
    }

    public ChangePmode(visible: boolean): void {
        if (this.PmodeValue == this.hiddenPmodes[0]) {
            this.btnPmodeDown.prop("disabled", true);
        }
        else if (this.PmodeValue == this.hiddenPmodes[1]) {
            this.btnPmodeUp.prop("disabled", true);
        }
        else {
            this.btnPmodeUp.prop("disabled", visible);
            this.btnPmodeDown.prop("disabled", visible);
        }
    }

    public SwitchMode(Switch: boolean): void {
        let tmp: IPmode = this;
        let link: string = Switch ? "pmode_up" : "pmode_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.PmodeValue = data;
                tmp.ChangePmode(false);
            }
        });
    }
}


interface IChannel {
    ChnNumValue: number;
    EnableChn(visible: boolean): void;
    LimitChn(value: number): void;
    SwitchChn(Switch: boolean): void;
    WriteChn(): void;
    BackChn(): void;
    IsNumber(event, value: string): boolean;
    ClearInput(): void;
    FillInput(): void;
}

class TvChannel implements IChannel {
    private chnUp: JQuery;
    private chnDown: JQuery;
    private chnBack: JQuery;
    private chnInput: JQuery;
    private chnWrite: JQuery;
    private chnLbl: JQuery;
    private num: number;
    public get ChnNumValue(): number {
        return parseInt(this.chnLbl.text());
    }
    public set ChnNumValue(value: number) {
        this.chnLbl.text(value);
        this.chnInput.val(value);
    }
    
    constructor(num: number) {
        this.num = num;
        this.chnUp = $("#chn_up_" + num);
        this.chnDown = $("#chn_dn_" + num);
        this.chnBack = $("#chn_bck_" + num);
        this.chnInput = $("#input_chn_" + num);
        this.chnWrite = $("#chn_write_" + num);
        this.chnLbl = $("#lbl_chn_" + num);
    }
    public  EnableChn(visible: boolean): void {
        if (visible) {
            this.chnUp.prop("disabled", true);
            this.chnDown.prop("disabled", true);
            this.chnBack.prop("disabled", true);
            this.chnInput.prop("disabled", true);
            this.chnWrite.prop("disabled", true);
        }
        else {
            this.LimitChn(this.ChnNumValue);
            this.chnBack.prop("disabled", false);
            this.chnInput.prop("disabled", false);
            this.chnWrite.prop("disabled", (this.chnInput.val() != this.chnLbl.text() ? false : true));
        }
    }

    public  LimitChn(value: number): void {
        if (value == 0) {
            this.chnUp.prop("disabled", false);
            this.chnDown.prop("disabled", true);
        }
        else if (value == 99) {
            this.chnUp.prop("disabled", true);
            this.chnDown.prop("disabled", false);
        }
        else {
            this.chnUp.prop("disabled", false);
            this.chnDown.prop("disabled", false);
        }
    }

    public SwitchChn(Switch: boolean): void {
        this.SetChn(Switch ? 1 : 0);
    }

    public WriteChn(): void {
        this.SetChn(4);
    }

    public BackChn(): void {
        this.SetChn(3);
    }

    private SetChn(Switch: number): void {
        this.chnWrite.prop("disabled", true);
        let tmp: IChannel = this;
        let link: string
        if (Switch == 4)
            link = "/My/DevAct/chn_write/" + this.chnInput.val() + "/" + this.num
        else if (Switch == 3)
            link = "/My/DevAct/chn_bck/" + this.num;
        else
            link = Switch == 1 ? "/My/DevAct/chn_up/" + this.num : "/My/DevAct/chn_dn/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.ChnNumValue = parseInt(data);
                tmp.LimitChn(parseInt(data));
            }
        });
    }

    public IsNumber(event, value: string): boolean {
        event = event != null ? event : window.event;
        let charCode: number = event.which != null ? event.which : event.keyCode;
        if (charCode == 13) {
            if (value != "" && value != this.chnLbl.text()) {
                this.WriteChn();
                this.chnInput.blur();
                this.chnWrite.prop("disabled", true);
                return true;
            }
            else
                return false;
        }
        else if (value.length == 2 && charCode != 8) {
            return false;
        }
        else if (charCode == 8 || charCode > 47 && charCode < 58) {
            if (value.length == 1 && value[0] == "0") {
                this.chnInput.val("");
                value = "";
            }
            value = charCode == 8 ? value.substring(0, value.length - 1) : value + event.key;
            if (value != "" && value != this.chnLbl.text()) {
                this.chnWrite.prop("disabled", false);
            }
            else
                this.chnWrite.prop("disabled", true);
            return true;
        }
        else {
            return false;
        }
    }

    public ClearInput(): void {
        this.chnInput.val("");
    }

    public FillInput(): void {
        if (this.chnInput.val() == "") {
            this.chnInput.val(this.chnLbl.text());
        }
    }
}


interface IVolume {
    SwitchVol(Switch: boolean): void;
    Mute(): void;
    EnableVol(Switch: boolean): void;
    LimitVol(value: string): void;
}

class SimpleVolume implements IVolume {
    private num: number;
    private LblVolume: JQuery;
    private btnVolUp: JQuery;
    private btnVolDown: JQuery;
    private btnMute: JQuery;

    constructor(num: number) {
        this.num = num;
        this.LblVolume = $("#lbl_vol_" + num);
        this.btnVolUp = $("#vol_up_" + num);
        this.btnVolDown = $("#vol_dn_" + num);
        this.btnMute = $("#vol_mute_" + num);
    }

    public LimitVol(value: string): void {
        this.LblVolume.text(value);
        switch (value) {
            case "0":
                this.btnVolDown.prop("disabled", true);
                this.btnVolUp.prop("disabled", false);
                break;
            case "100":
                this.btnVolUp.prop("disabled", true);
                this.btnVolDown.prop("disabled", false);
            case "MUTE":
                break;
            default:
                this.btnVolDown.prop("disabled", false);
                this.btnVolUp.prop("disabled", false);
                break;
        }
    }

    public EnableVol(Switch: boolean): void {
        if (!Switch) {
            this.btnMute.prop("disabled", false);
            this.LimitVol(this.LblVolume.text());
        }
        else {
            this.btnMute.prop("disabled", true);
            this.btnVolUp.prop("disabled", true);
            this.btnVolDown.prop("disabled", true);
        }
    }

    public SwitchVol(Switch: boolean): void {
        let tmp: IVolume = this;
        let link: string = Switch ? "vol_up" : "vol_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.LimitVol(data);
            }
        });
    }

    public Mute(): void {
        let tmp: IVolume = this;
        let link: string = "/My/DevAct/vol_mute/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.LimitVol(data);
            }
        });
    }
}


interface ITemperature {
    TModeValue: number;
    LimitTemp(visible: boolean): void;
    SwitchTemp(Switch: boolean): void;
    MaxMinTemp(Switch: boolean): void;
}

class Termostat implements IPmode, ITemperature {
    private hiddenModes: string[];
    private _pmode: JQuery;
    private btnPmodeUp: JQuery;
    private btnPmodeDown: JQuery;
    private hiddenTemps: number[] = new Array();
    private lblTemp: JQuery;
    private btnTempUp: JQuery;
    private btnTempDown: JQuery;
    private btnTempMax: JQuery;
    private btnTempMin: JQuery;
    private num: number;
    private get minVal(): number {
        if (this.PmodeValue == this.hiddenModes[this.hiddenModes.length - 1])
            return this.hiddenTemps[2];
        else
            return this.hiddenTemps[0];
    }
    private get maxVal(): number {
        if (this.PmodeValue == this.hiddenModes[0])
            return this.hiddenTemps[1];
        else
            return this.hiddenTemps[3];
    }
    public get TModeValue(): number {
        return parseInt(this.lblTemp.text());
    }
    public set TModeValue(value: number) {
        this.lblTemp.text(value);
    }
    public get PmodeValue(): string {
        return this._pmode.text();
    }
    public set PmodeValue(value: string) {
        this._pmode.text(value);
    }

    constructor(num: number) {
        this.hiddenModes = $("#lbl_modes_" + num).text().split(" ");
        this._pmode = $("#lbl_pmode_" + num);
        this.btnPmodeUp = $("#pmode_up_" + num);
        this.btnPmodeDown = $("#pmode_dn_" + num);
        let hid_temps_raw: string[] = $("#lbl_temps_" + num).text().split(" ");
        for (var i = 0; i < hid_temps_raw.length; i++) {
            this.hiddenTemps.push(parseInt(hid_temps_raw[i]));
        }
        this.lblTemp = $("#lbl_tmp_" + num);
        this.btnTempUp = $("#tmp_up_" + num);
        this.btnTempDown = $("#tmp_dn_" + num);
        this.btnTempMax = $("#tmp_max_" + num);
        this.btnTempMin = $("#tmp_min_" + num);
        this.num = num;
    }

    public EnablePmode(visible: boolean): void {
        this.ChangePmode(visible);
    }

    public ChangePmode(visible: boolean): void {
        let right_temp: boolean;
        if (this.PmodeValue == this.hiddenModes[0]) {
            right_temp = this.TModeValue > this.hiddenTemps[0] && this.TModeValue < this.hiddenTemps[1] ? true : false;
            this.lblTemp.text(right_temp ? this.TModeValue : 16);
            this.btnPmodeUp.prop("disabled", visible);
            this.btnPmodeDown.prop("disabled", true);
            this.LimitTemp(visible);

        }
        else if (this.PmodeValue == this.hiddenModes[1]) {
            right_temp = this.TModeValue > this.hiddenTemps[2] && this.TModeValue < this.hiddenTemps[3] ? true : false;
            this.lblTemp.text(right_temp ? this.TModeValue : 30);
            this.btnPmodeUp.prop("disabled", true);
            this.btnPmodeDown.prop("disabled", visible);
            this.LimitTemp(visible);
        }
        else {
            let tmp_up: boolean = this.TModeValue == this.hiddenTemps[3] ? true : visible;
            let tmp_dn: boolean = this.TModeValue == this.hiddenTemps[0] ? true : visible;
            this.btnPmodeUp.prop("disabled", visible);
            this.btnPmodeDown.prop("disabled", visible);
            this.btnTempUp.prop("disabled", tmp_up);
            this.btnTempDown.prop("disabled", tmp_dn);
            this.btnTempMax.prop("disabled", tmp_up);
            this.btnTempMin.prop("disabled", tmp_dn);
        }
    }

    public LimitTemp(visible: boolean): void {
        if (this.TModeValue == this.minVal) {
            this.btnTempUp.prop("disabled", visible);
            this.btnTempDown.prop("disabled", true);
            this.btnTempMax.prop("disabled", visible);
            this.btnTempMin.prop("disabled", true);
        }
        else if (this.TModeValue == this.maxVal) {
            this.btnTempUp.prop("disabled", true);
            this.btnTempDown.prop("disabled", visible);
            this.btnTempMax.prop("disabled", true);
            this.btnTempMin.prop("disabled", visible);
        }
        else {
            this.btnTempUp.prop("disabled", visible);
            this.btnTempDown.prop("disabled", visible);
            this.btnTempMax.prop("disabled", visible);
            this.btnTempMin.prop("disabled", visible);
        }
    }

    public SwitchMode(Switch: boolean): void {
        let tmp: IPmode = this;
        let link: string = Switch ? "pmode_up" : "pmode_dn";
        link = "/My/DevAct/" + link + "/" + this.num;

        $.ajax({
            url: link,
            success: function (data) {
                tmp.PmodeValue = data;
                tmp.ChangePmode(false);
            }
        });
    }

    public SwitchTemp(Switch: boolean): void {
        let tmp: ITemperature = this;
        let link: string = Switch ? "tmp_up" : "tmp_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.TModeValue = data;
                tmp.LimitTemp(false);
            }
        });
    }

    public MaxMinTemp(Switch: boolean): void {
        let tmp: ITemperature = this;
        let link: string = Switch ? "tmp_max" : "tmp_min";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.TModeValue = data;
                tmp.LimitTemp(false);
            }
        });
    }
}

class RefTemp implements ITemperature {
    private hiddenTemps: number[] = new Array();
    private lblTemp: JQuery;
    private btnTempUp: JQuery;
    private btnTempDown: JQuery;
    private btnTempMax: JQuery;
    private btnTempMin: JQuery;
    private num: number;
    public get TModeValue(): number {
        return parseInt(this.lblTemp.text());
    }
    public set TModeValue(value: number) {
        this.lblTemp.text(value);
    }
    private get MinValue(): number {
        return this.hiddenTemps[0];
    }
    private get MaxValue(): number {
        return this.hiddenTemps[1];
    }

    constructor(num: number) {
        let lblHiddenTemps: string[] = $("#lbl_temps_" + num).text().split(" ");
        for (var i = 0; i < lblHiddenTemps.length; i++) {
            this.hiddenTemps.push(parseInt(lblHiddenTemps[i]));
        }
        this.lblTemp = $("#lbl_tmp_" + num);
        this.btnTempUp = $("#tmp_up_" + num);
        this.btnTempDown = $("#tmp_dn_" + num);
        this.btnTempMax = $("#tmp_max_" + num);
        this.btnTempMin = $("#tmp_min_" + num);
        this.num = num;
    }

    public LimitTemp(visible: boolean): void {
        if (this.TModeValue == this.MinValue) {
            this.btnTempUp.prop("disabled", visible);
            this.btnTempDown.prop("disabled", true);
            this.btnTempMax.prop("disabled", visible);
            this.btnTempMin.prop("disabled", true);
        }
        else if (this.TModeValue == this.MaxValue) {
            this.btnTempUp.prop("disabled", true);
            this.btnTempDown.prop("disabled", visible);
            this.btnTempMax.prop("disabled", true);
            this.btnTempMin.prop("disabled", visible);
        }
        else {
            this.btnTempUp.prop("disabled", visible);
            this.btnTempDown.prop("disabled", visible);
            this.btnTempMax.prop("disabled", visible);
            this.btnTempMin.prop("disabled", visible);
        }
    }

    public SwitchTemp(Switch: boolean): void {
        let tmp: ITemperature = this;
        let link: string = Switch ? "tmp_up" : "tmp_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.TModeValue = data;
                tmp.LimitTemp(false);
            }
        });

    }

    public MaxMinTemp(Switch: boolean): void {
        let tmp: ITemperature = this;
        let link: string = Switch ? "tmp_max" : "tmp_min";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                tmp.TModeValue = data;
                tmp.LimitTemp(false);
            }
        });
    }
}


interface IRefField {
    Add(): void;
    Edit(num: number): void;
    Delete(num: number): void;
    Success(num: number): void;
    Cancel(num: number): void;
    ClickTd1(num: number): void;
    CheckTd0(num: number): void;
    CheckTd1(num: number): void;
    PressTd1(num: number): void;
    OnblurTr(num: number): void;
    CheckTr(num: number): void;
    EnableRefSpace(visible: boolean): void;
}

class RefSpaceSimple implements IRefField {
    private btnAdd: JQuery;
    private lblPwr: JQuery;
    private btnEdit: JQuery;
    private btnDelete: JQuery;
    private btnSuccess: JQuery;
    private btnCancel: JQuery;
    private lbl0: JQuery;
    private lbl1: JQuery;
    private inpt0: JQuery;
    private inpt1: JQuery;
    private tbody: JQuery;
    private lblFreeSpace: JQuery;
    private trField: JQuery;
    private num: number;
    private unfocusEnable: boolean = true;

    constructor(num: number) {
        this.num = num;
        this.tbody = $("#tbl_" + num).children('tbody');
        this.lblPwr = $("#lbl_pwr_" + num);
        this.lblFreeSpace = $("#lbl_fspace_" + num);
        this.btnAdd = $("#td_add_" + num);
    }

    private UpdateElements(num: number): void {
        this.btnEdit = $("#td_edit_" + num + "_" + this.num);
        this.btnDelete = $("#td_del_" + num + "_" + this.num);
        this.btnSuccess = $("#td_suc_" + num + "_" + this.num);
        this.btnCancel = $("#td_canc_" + num + "_" + this.num);
        this.lbl0 = $("#td_lbl0_" + num + "_" + this.num);
        this.lbl1 = $("#td_lbl1_" + num + "_" + this.num);
        this.inpt0 = $("#td_inpt0_" + num + "_" + this.num);
        this.inpt1 = $("#td_inpt1_" + num + "_" + this.num);
        this.trField = $("#tr_" + num + "_" + this.num);
    }

    public Add(): void {
        let freeSpace: number = parseInt(this.lblFreeSpace.text());
        if (freeSpace > 0) {
            let tbody: JQuery = this.tbody;
            let num = this.num;
            let trField = this.trField;
            let elemId: number = this.tbody.children().length > 1 ? parseInt(this.tbody.children().last().attr('id').split("_")[1]) + 1 : 0;
            //if (elemId == 0 || this.tbody.children().last().find('[id*="td_inpt0_"]').is(':hidden')) {
                let link: string = "/My/Add/ref_add/" + elemId + "/" + num;
                $.ajax({
                    url: link,
                    success: function (data) {
                        tbody.append(data);
                        let last_inpt0: JQuery = $("#td_inpt0_" + elemId + "_" + num);
                        last_inpt0.focus();
                        trField.click();
                    }
                });
            //}
        }
    }

    public Delete(num: number): void {
        let lbl_free_space: JQuery = this.lblFreeSpace;
        let link: string = "/My/DevAct/ref_take/" + num + "/0/" + this.num;
        $("#tr_" + num + "_" + this.num).remove();
        $.ajax({
            url: link,
            success: function (data) {
                lbl_free_space.text(data);
            }
        });
    }

    public Edit(num: number): void {
        this.UpdateElements(num);
        let content: string = this.lbl1.text();
        this.btnCancel.show();
        this.lbl1.hide();
        this.btnSuccess.show();
        this.btnEdit.hide();
        this.btnDelete.hide();
        this.btnCancel.show();
        this.inpt1.show();
        this.inpt1.focus();
        this.inpt1.val(content);
        this.inpt1.select();
    }

    public Success(num: number): void {
        this.UpdateElements(num);
        if (this.inpt0.is(":visible")) {
            if (this.inpt1.val() == "") {
                this.inpt1.addClass("invalid");
            }
            if (this.inpt0.hasClass("invalid") != true && this.inpt1.hasClass("invalid") != true) {
                this.inpt0.hide();
                this.inpt1.hide();
                this.lbl0.text(this.inpt0.val());
                this.lbl1.text(this.inpt1.val());
                this.inpt0.val("");
                this.inpt1.val("");
                this.lbl0.show();
                this.lbl1.show();
                this.btnSuccess.hide();
                this.btnEdit.show();
                this.btnDelete.show();
                this.btnCancel.hide();
                let lbl_free_space: JQuery = this.lblFreeSpace;
                let link: string = "/My/DevAct/" + "ref_put" + "/" + this.lbl0.text() + "/" + this.lbl1.text() + "/" + this.num;
                $.ajax({
                    url: link,
                    success: function (data) {
                        lbl_free_space.text(data);
                    }
                });
            }
            else if (this.inpt0.hasClass("invalid")) {
                Overlay.Show("Значение поля \"Продукт\" должно быть одним словом в одной раскладке", 3000);
                this.inpt0.focus();
            }
            else {
                Overlay.Show("Значение поля \"Объём\" должно быть больше 0 и меньше " + this.lblFreeSpace.text(), 3000);
                this.inpt1.focus();
            }
        }
        else if (this.inpt1.is(":visible")) {
            if (this.inpt1.hasClass("invalid") != true) {
                this.inpt1.hide();
                this.lbl1.text(this.inpt1.val());
                this.inpt1.val("");
                this.lbl1.show();
                this.btnSuccess.hide();
                this.btnEdit.show();
                this.btnCancel.hide();
                this.btnDelete.show();
                let lbl_free_space: JQuery = this.lblFreeSpace;
                let link: string = "/My/DevAct/" + "ref_take" + "/" + num + "/" + this.lbl1.text() + "/" + this.num;
                $.ajax({
                    url: link,
                    success: function (data) {
                        lbl_free_space.text(data);
                    }
                });
            }
            else {
                Overlay.Show("Значение поля \"Объём\" должно быть больше 0 и меньше " + this.lblFreeSpace.text(), 3000);
                this.inpt1.focus();
            }
        }
    }

    public Cancel(num: number): void {
        this.UpdateElements(num);
        if (this.inpt0.is(":visible"))
            $("#tr_" + num + "_" + this.num).remove();
        else {
            this.lbl1.show();
            this.inpt1.hide();
            this.btnSuccess.hide();
            this.btnEdit.show();
            this.btnCancel.hide();
            this.btnDelete.show();
        }
    }

    public ClickTd1(num: number): void {
        this.UpdateElements(num);
        if (this.lblPwr.text() != "выкл" && this.inpt1.is(':hidden')) {
            let content: string = this.lbl1.text();
            this.lbl1.hide();
            this.btnSuccess.show();
            this.btnEdit.hide();
            this.btnCancel.show();
            this.btnDelete.hide();
            this.inpt1.show();
            this.inpt1.focus();
            this.inpt1.val(content);
            this.inpt1.select();
        }
    }

    public CheckTd0(num: number): void {
        this.UpdateElements(num);
        let split_val: string[] = this.inpt0.val().split(" ");
        let reg = new RegExp("^([A-Z]?[a-z]{0,10}([a-z]{1}$|[\,\.\-\:]{1}$))|^([А-Я]?[а-я]{0,10}([а-я]{1}$|[\,\.\-\:]{1}$))|^([A-Z]{1}|[А-Я]{1})$|^(([A-Z]{1}|[А-Я]{1})[\,\.\-\:]{1})$|^([0-9]{1,10})$", "");
        let check: boolean = true;
        if (split_val.length == 1) {
            check = split_val[0].search(reg) != 0 ? false : true;
            if (check) {
                let allLbl = this.tbody.find('[id*="td_lbl0_"]');
                for (var i = 0; i < allLbl.length; i++) {
                    if (allLbl[i].textContent.toLocaleLowerCase() == this.inpt0.val().toLocaleLowerCase()) {
                        check = false;
                        break;
                    }
                }
                if (check) {
                    this.inpt0.removeClass("invalid");
                }
                else
                    this.inpt0.addClass("invalid");
            }
            else {
                this.inpt0.addClass("invalid");
            }
        }
        else {
            this.inpt0.addClass("invalid");
        }
        this.CheckTr(num);

    }

    public CheckTd1(num: number): void {
        this.UpdateElements(num);
        if (this.inpt1.val().search(/^([1-9]{1}[0-9]{1})$|^([1-9]{1})$/) == 0) {
            let freeSpace: number = parseInt(this.lblFreeSpace.text());
            let mainSpace: number = parseInt(this.lbl1.text());
            mainSpace = isNaN(mainSpace) ? 0 : mainSpace;
            if (parseInt(this.inpt1.val()) <= freeSpace + mainSpace) {
                this.inpt1.removeClass("invalid");
            }
            else
                this.inpt1.addClass("invalid");
        }
        else {
            this.inpt1.addClass("invalid");
        }
        this.CheckTr(num);

    }

    public PressTd1(num: number): void {
        this.UpdateElements(num);
        this.inpt1.removeClass("invalid");
    }

    public OnblurTr(num: number): void {
        this.UpdateElements(num);
        if (this.inpt0.is(":visible")) {
            this.trField.remove();
        }
        else if (this.inpt1.is(":visible")) {
            this.lbl1.show();
            this.inpt1.hide();
            this.inpt0.val("");
            this.btnSuccess.hide();
            this.btnEdit.show();
            this.btnCancel.hide();
            this.btnDelete.show();
        }
    }

    public EnableRefSpace(visible: boolean): void {
        let allLbl0 = this.tbody.find('[id*="td_lbl0_"]');
        let allLbl1 = this.tbody.find('[id*="td_lbl1_"]');
        let allEdit = this.tbody.find('[id*="td_edit_"]');
        let allDel = this.tbody.find('[id*="td_del_"]');
        this.btnAdd.prop("disabled", visible);
        if (allLbl0.length > 0) {
            for (var i = 0; i < allLbl0.length; i++) {
                $("#" + allLbl0[i].id).prop("disabled", visible);
                $("#" + allLbl1[i].id).prop("disabled", visible);
                $("#" + allEdit[i].id).prop("disabled", visible);
                $("#" + allDel[i].id).prop("disabled", visible);
            }
        }
    }

    public CheckTr(num: number) {
        let idTr: string = "#tr_" + num + "_" + this.num;
        let tmp: IRefField = this;
        let check =
            $(document).on("click", function (e) {
                let elem: JQuery = $(e.target);
                let outOfArea: boolean = elem.closest(idTr).length == 0;
                let valId: string = elem.attr("id");
                let checklbl0: boolean = valId == undefined ? false : valId.search("lbl0") >= 0;
                if (outOfArea || checklbl0) {
                    tmp.OnblurTr(num);
                }
                //$(document).off('click');
                check = null;
            });
    }
}


interface ITimer {
    Start(): void;
    Stop(): void;
    Edit(): void;
    Success(): void;
    Cancel(): void;
    Onblur(): void;
    ShowRest(num: number): void;
    EnableTimer(visible: boolean): void;
    Reset(): void;
}

class TimerMicr implements ITimer {
    private timer: any;
    private tmpTimer: any;
    private lblTime: JQuery;
    private lblRestTime: JQuery;
    private lblShowRest: JQuery;
    private input: JQuery;
    private btnEdit: JQuery;
    private btnSuccess: JQuery;
    private btnCancel: JQuery;
    private btnStart: JQuery;
    private btnStop: JQuery;
    private btnReset: JQuery;
    private num: number;

    constructor(num: number) {
        this.num = num;
        this.lblTime = $("#lbl_time_" + num);
        this.lblRestTime = $("#micr_resttime_" + num);
        this.lblShowRest = $("#micr_showrest_" + num);
        this.input = $("#micr_inpt_" + num);
        this.btnEdit = $("#micr_edit_" + num);
        this.btnSuccess = $("#micr_suc_" + num);
        this.btnCancel = $("#micr_canc_" + num);
        this.btnStart = $("#micr_start_" + num);
        this.btnStop = $("#micr_stop_" + num);
        this.btnReset = $("#micr_reset_" + num);
    }

    public Start(): void {
        this.btnStop.show();
        this.btnReset.hide();
        this.btnStop.prop("disabled", false);
        this.btnStart.prop("disabled", true);
        this.lblShowRest.show();
        let time: number = parseInt(this.lblRestTime.text());
        let lblRestTime : JQuery = this.lblRestTime;
        let tmp: ITimer = this;
        let num: number = this.num;
        this.timer = setTimeout(function () {
            Overlay.Show("Таймер №" + num + " сработал!");
            tmp.Reset();
        },  time * 1000);
        this.tmpTimer = setInterval(function () {
            lblRestTime.text(parseInt(lblRestTime.text()) - 1);
        }, 1000);
        //let link: string = "/My/DevAct/micr_start/" + this.num;
        //$.ajax({
        //    url: link
        //});
    }

    public Stop(): void {
        this.btnStart.prop("disabled", false);
        this.btnStop.hide();
        this.btnReset.show();
        clearTimeout(this.timer);
        clearTimeout(this.tmpTimer);
        let tmp: ITimer = this;
        let link: string = "/My/DevAct/micr_stop/" + this.lblRestTime.text() + "/" + this.num;
        $.ajax({
            url: link,
            //success: function (data) {
            //    tmp.showRest(data);
            //}
        });

    }

    public Reset(visible: boolean = false): void {
        this.btnReset.hide();
        this.btnStop.show();
        this.btnStart.prop("disabled", visible);
        this.btnStop.prop("disabled", true);
        clearTimeout(this.timer);
        clearTimeout(this.tmpTimer);
        this.ShowRest();
        let link: string = "/My/DevAct/micr_res/" + this.num;
        $.ajax({
            url: link
        });
    }

    public ShowRest(num: number = 0): void {
        if (num > 0) {
            this.lblRestTime.text(num);
            this.lblShowRest.show();
        }
        else {
            this.lblRestTime.text(this.lblTime.text());
            this.lblShowRest.hide();
        }
    }

    public Edit(): void {
        let content: string = this.lblTime.text();
        this.input.val(content);
        this.lblTime.hide();
        this.btnEdit.hide();
        this.input.show();
        this.btnSuccess.show();
        this.btnCancel.show();
        this.input.focus();
        this.input.select();
    }

    public Success(): void {
        if (this.input.is(":visible") && this.input.hasClass("invalid") != true) {
            this.lblTime.show();
            this.btnEdit.show();
            this.input.hide();
            this.btnSuccess.hide();
            this.btnCancel.hide();
            if (this.input.val().search(/^([1-9]{1}[0-9]{1})$|^([1-9]{1})$|^([1]{1}[0-1]{1}[0-9]{1})$|^([1]{1}[2]{1}[0]{1})$/) != 0) {
                this.input.val(this.lblTime.text());
                Overlay.Show("Значение должно быть целым числом больше 0 и меньше 121!", 3000);
            }
            else {
                let content: string = this.input.val();
                this.lblTime.text(content);
                this.lblRestTime.text(content);
                let link: string = "/My/DevAct/micr_suc/" + content + "/" + this.num;
                $.ajax({
                    url: link
                });
            }
        }
    }

    public Cancel(): void {
        if (this.input.is(":visible")) {
            this.lblTime.show();
            this.btnEdit.show();
            this.input.hide();
            this.btnSuccess.hide();
            this.btnCancel.hide();
            this.input.removeClass("invalid");
        }
    }

    public Onblur(): void {
        let tmp: ITimer = this;
        let checkSuc: string = this.btnSuccess.attr("id");
        let checkEdit: string = this.btnEdit.attr("id");
        let checkInput: string = this.input.attr("id");
        let check =
            $(document).on("click", function (e) {
                let elem: JQuery = $(e.target);
                let valId: string = elem.attr("id");
                if (valId != undefined) {
                    let check: boolean = valId == checkEdit || valId == checkInput ? false : true;
                    if (valId == checkSuc) {
                        //$(document).off('click');
                        check = null;
                    }
                    else if (check) {
                        tmp.Cancel();
                        //$(document).off('click');
                        check = null;
                    }
                }
                else
                    tmp.Cancel();
                //$(document).off('click');
                check = null;
            });
    }

    public EnableTimer(visible: boolean): void {
        if (!visible) {
            this.btnStop.prop("disabled", true);
            this.btnStart.prop("disabled", false);
            this.btnEdit.prop("disabled", false);
        }
        else {
            this.btnStop.prop("disabled", true);
            this.btnStart.prop("disabled", true);
            this.btnEdit.prop("disabled", true);
            this.Reset(true);
        }
    }
}


class Light extends Dev implements IPmode {
    private Pmode: IPmode;
    public set PmodeValue(value: string) {
        this.Pmode.PmodeValue = value;
    }

    constructor(num: number, Pmode: IPmode) {
        super(num);
        this.num = num;
        this.Pmode = Pmode;
    }

    public enableContent(): void {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
        }
        else {
            this.EnablePmode(false);
        }
    }

    public EnablePmode(visible: boolean): void {
        this.Pmode.EnablePmode(visible);
    }

    public ChangePmode(visible: boolean = null): void {
        this.Pmode.ChangePmode(visible);
    }

    public SwitchMode(Switch: boolean): void {
        this.Pmode.SwitchMode(Switch);
    }
}


class TV extends Dev implements IPmode, IChannel, IVolume {
    private Pmode: IPmode;
    private Channel: IChannel;
    private Volume: IVolume;
    public ChnNumValue: number;
    public set PmodeValue(value: string) {
        this.Pmode.PmodeValue = value;
    }

    constructor(num: number, Pmode: IPmode, Channel: IChannel, Volume: IVolume) {
        super(num);
        this.num = num;
        this.Pmode = Pmode;
        this.Channel = Channel;
        this.Volume = Volume;
    }

    public enableContent(): void {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
            this.EnableChn(true);
            this.EnableVol(true);
        }
        else {
            this.EnablePmode(false);
            this.EnableChn(false);
            this.EnableVol(false);
        }
    }

    public EnablePmode(visible: boolean): void {
        this.Pmode.EnablePmode(visible);
    }

    public ChangePmode(visible: boolean = null): void {
        this.Pmode.ChangePmode(visible);
    }

    public SwitchMode(Switch: boolean): void {
        this.Pmode.SwitchMode(Switch);
    }

    public EnableChn(visible: boolean): void {
        this.Channel.EnableChn(visible);
    }

    public LimitChn(value: number): void {
        this.Channel.LimitChn(value);
    }

    public SwitchChn(Switch: boolean): void {
        this.Channel.SwitchChn(Switch);
    }

    public WriteChn(): void {
        this.Channel.WriteChn();
    }

    public BackChn(): void {
        this.Channel.BackChn();
    }

    public IsNumber(event, value: string): boolean {
        return this.Channel.IsNumber(event, value);
    }

    public ClearInput(): void {
        this.Channel.ClearInput();
    }

    public FillInput(): void {
        this.Channel.FillInput();
    }

    public SwitchVol(Switch: boolean): void {
        this.Volume.SwitchVol(Switch);
    }

    public Mute(): void {
        this.Volume.Mute();
    }

    public EnableVol(Switch: boolean): void {
        this.Volume.EnableVol(Switch);
    }

    public LimitVol(value: string): void { }
}


class Conditioner extends Dev implements IPmode, ITemperature {
    private Pmode: IPmode;
    private Temperature: ITemperature;
    public set PmodeValue(value: string) {
        this.Pmode.PmodeValue = value;
    }
    public set TModeValue(value: number) {
        this.Temperature.TModeValue = value;
    }

    constructor(num: number, Pmode: IPmode, Temperature: ITemperature) {
        super(num);
        this.num = num;
        this.Pmode = Pmode;
        this.Temperature = Temperature;
    }

    public enableContent(): void {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
        }
        else {
            this.EnablePmode(false);
        }
    }

    public EnablePmode(visible: boolean): void {
        this.Pmode.EnablePmode(visible);
    }

    public ChangePmode(visible: boolean = null): void {
        this.Pmode.ChangePmode(visible);
    }

    public SwitchMode(Switch: boolean): void {
        this.Pmode.SwitchMode(Switch);
    }

    public LimitTemp(visible: boolean) {
        this.Temperature.LimitTemp(visible);
    }

    public SwitchTemp(Switch: boolean) {
        this.Temperature.SwitchTemp(Switch);
    }

    public MaxMinTemp(Switch: boolean) {
        this.Temperature.MaxMinTemp(Switch);
    }
}


class Refrigerator extends Dev implements IPmode, ITemperature, IRefField{
    private Pmode: IPmode;
    private RefField: IRefField;
    private Temperature: ITemperature;
    public set PmodeValue(value: string) {
        this.Pmode.PmodeValue = value;
    }
    public set TModeValue(value: number) {
        this.Temperature.TModeValue = value;
    }

    constructor(num: number, Pmode: IPmode, Temperature: ITemperature, RefField: IRefField) {
        super(num);
        this.num = num;
        this.Pmode = Pmode;
        this.RefField = RefField;
        this.Temperature = Temperature;
    }

    public enableContent(): void {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
            this.EnableRefSpace(true);
            this.LimitTemp(true);
        }
        else {
            this.EnablePmode(false);
            this.EnableRefSpace(false);
            this.LimitTemp(false);
        }
    }

    public EnablePmode(visible: boolean): void {
        this.Pmode.EnablePmode(visible);
    }

    public ChangePmode(visible: boolean = null): void {
        this.Pmode.ChangePmode(visible);
    }

    public SwitchMode(Switch: boolean): void {
        this.Pmode.SwitchMode(Switch);
    }

    public Add(): void {
        this.RefField.Add();
    }

    public Edit(num: number): void {
        this.RefField.Edit(num);
    }

    public Delete(num: number): void {
        this.RefField.Delete(num);
    }

    public Success(num: number): void {
        this.RefField.Success(num);
    }

    public Cancel(num: number): void {
        this.RefField.Cancel(num);
    }

    public ClickTd1(num: number): void {
        this.RefField.ClickTd1(num);
    }

    public CheckTd0(num: number): void {
        this.RefField.CheckTd0(num);
    }

    public CheckTd1(num: number): void {
        this.RefField.CheckTd1(num);
    }

    public PressTd1(num: number): void {
        this.RefField.PressTd1(num);
    }

    public OnblurTr(num: number): void {
        this.RefField.OnblurTr(num);
    }

    public CheckTr(num: number): void {
        this.RefField.CheckTr(num);
    }

    public EnableRefSpace(visible: boolean): void {
        this.RefField.EnableRefSpace(visible);
    }

    public LimitTemp(visible: boolean) {
        this.Temperature.LimitTemp(visible);
    }

    public SwitchTemp(Switch: boolean) {
        this.Temperature.SwitchTemp(Switch);
    }

    public MaxMinTemp(Switch: boolean) {
        this.Temperature.MaxMinTemp(Switch);
    }
}


class Microwave extends Dev implements IPmode, ITimer{
    public num: number;
    private Pmode: IPmode;
    private Timer: ITimer;

    public set PmodeValue(value: string) {
        this.Pmode.PmodeValue = value;
    }

    constructor(num: number, Pmode: IPmode, Timer: ITimer) {
        super(num);
        this.num = num;
        this.Pmode = Pmode;
        this.Timer = Timer;
    }

    public enableContent(): void {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
            this.EnableTimer(true);
        }
        else {
            this.EnablePmode(false);
            this.EnableTimer(false);
        }
    }

    public EnablePmode(visible: boolean): void {
        this.Pmode.EnablePmode(visible);
    }

    public ChangePmode(visible: boolean): void {
        this.Pmode.ChangePmode(visible);
    }

    public SwitchMode(Switch: boolean): void {
        this.Pmode.SwitchMode(Switch);
    }

    public Start(): void {
        this.Timer.Start();
    }

    public Stop(): void {
        this.Timer.Stop();
    }

    public Edit(): void {
        this.Timer.Edit();
    }

    public Success(): void {
        this.Timer.Success();
    }

    public Cancel(): void {
        this.Timer.Cancel();
    }

    public Onblur(): void {
        this.Timer.Onblur();
    }

    public ShowRest(num: number): void {
        this.Timer.ShowRest(num);
    }

    public EnableTimer(visible: boolean): void {
        this.Timer.EnableTimer(visible);
    }

    public Reset(): void {
        this.Timer.Reset();
    }
}