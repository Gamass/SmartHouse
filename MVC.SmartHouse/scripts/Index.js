var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dictionary = (function () {
    function Dictionary() {
        this.List = {};
    }
    Dictionary.prototype.Add = function (Key, Value) {
        this.List[Key] = Value;
    };
    Dictionary.prototype.Del = function (Key) {
        delete this.List[Key];
        $("#div_" + Key).remove();
        $.ajax({
            url: "/My/DevAct/Delete/" + Key
        });
    };
    Dictionary.prototype.Get = function (Key) {
        return this.List[Key];
    };
    return Dictionary;
}());
var List = new Dictionary();
$(document).ready(function () {
    var devs = $("#devices").children();
    console.log(devs.length);
    for (var i = 0; i < devs.length; i++) {
        var num = devs[i].getAttribute('id').split("_")[1];
        var name_1 = devs[i].className;
        Factory(name_1, num);
    }
});
function AddButtonPress() {
    var DevSelect = $("#DevSelect").val();
    $.ajax({
        url: "/My/Add/" + DevSelect,
        success: function (data) {
            $("#devices").append(data);
            var num = parseInt($("#devices").children().last().attr('id').split("_")[1]);
            Factory(DevSelect, num);
        }
    });
}
function Factory(name, num) {
    switch (name) {
        case "light":
            List.Add(num, new Light(num, new SimpleMode(num)));
            break;
        case "tv":
            List.Add(num, new TV(num, new SimpleMode(num), new TvChannel(num), new SimpleVolume(num)));
            break;
        case "cond":
            var term = new Termostat(num);
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
var Overlay = (function () {
    function Overlay() {
    }
    Overlay.Show = function (value, wait) {
        if (wait === void 0) { wait = 2500; }
        location.href = "#close";
        $("#overlay_lbl").text(value);
        location.href = "#overlay";
        setTimeout(function () {
            Overlay.Hide();
        }, wait);
    };
    Overlay.Hide = function () {
        location.href = "#close";
    };
    return Overlay;
}());
var Dev = (function () {
    function Dev(num) {
        this.lblPower = $("#lbl_pwr_" + num);
    }
    Object.defineProperty(Dev.prototype, "PowerState", {
        get: function () {
            return this.lblPower.text();
        },
        set: function (value) {
            this.lblPower.text(value);
        },
        enumerable: true,
        configurable: true
    });
    Dev.prototype.SwitchPower = function () {
        var that = this;
        var link = "/My/DevAct/" + "Power" + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.PowerState = data;
                that.enableContent();
            }
        });
    };
    return Dev;
}());
var SimpleMode = (function () {
    function SimpleMode(num) {
        this.hiddenPmodes = $("#lbl_modes_" + num).text().split(" ");
        this._pmode = $("#lbl_pmode_" + num);
        this.btnPmodeUp = $("#pmode_up_" + num);
        this.btnPmodeDown = $("#pmode_dn_" + num);
        this.num = num;
    }
    Object.defineProperty(SimpleMode.prototype, "PmodeValue", {
        get: function () {
            return this._pmode.text();
        },
        set: function (value) {
            this._pmode.text(value);
        },
        enumerable: true,
        configurable: true
    });
    SimpleMode.prototype.EnablePmode = function (visible) {
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
    };
    SimpleMode.prototype.ChangePmode = function (visible) {
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
    };
    SimpleMode.prototype.SwitchMode = function (Switch) {
        var that = this;
        var link = Switch ? "pmode_up" : "pmode_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.PmodeValue = data;
                that.ChangePmode(false);
            }
        });
    };
    return SimpleMode;
}());
var TvChannel = (function () {
    function TvChannel(num) {
        this.num = num;
        this.chnUp = $("#chn_up_" + num);
        this.chnDown = $("#chn_dn_" + num);
        this.chnBack = $("#chn_bck_" + num);
        this.chnInput = $("#input_chn_" + num);
        this.chnWrite = $("#chn_write_" + num);
        this.chnLbl = $("#lbl_chn_" + num);
    }
    Object.defineProperty(TvChannel.prototype, "ChnNumValue", {
        get: function () {
            return parseInt(this.chnLbl.text());
        },
        set: function (value) {
            this.chnLbl.text(value);
            this.chnInput.val(value);
        },
        enumerable: true,
        configurable: true
    });
    TvChannel.prototype.EnableChn = function (visible) {
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
    };
    TvChannel.prototype.LimitChn = function (value) {
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
    };
    TvChannel.prototype.SwitchChn = function (Switch) {
        this.SetChn(Switch ? 1 : 0);
    };
    TvChannel.prototype.WriteChn = function () {
        this.SetChn(4);
    };
    TvChannel.prototype.BackChn = function () {
        this.SetChn(3);
    };
    TvChannel.prototype.SetChn = function (Switch) {
        this.chnWrite.prop("disabled", true);
        var that = this;
        var link;
        if (Switch == 4)
            link = "/My/DevAct/chn_write/" + this.chnInput.val() + "/" + this.num;
        else if (Switch == 3)
            link = "/My/DevAct/chn_bck/" + this.num;
        else
            link = Switch == 1 ? "/My/DevAct/chn_up/" + this.num : "/My/DevAct/chn_dn/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.ChnNumValue = parseInt(data);
                that.LimitChn(parseInt(data));
            }
        });
    };
    TvChannel.prototype.IsNumber = function (event, value) {
        event = event != null ? event : window.event;
        var charCode = event.which != null ? event.which : event.keyCode;
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
    };
    TvChannel.prototype.ClearInput = function () {
        this.chnInput.val("");
    };
    TvChannel.prototype.FillInput = function () {
        if (this.chnInput.val() == "") {
            this.chnInput.val(this.chnLbl.text());
        }
    };
    return TvChannel;
}());
var SimpleVolume = (function () {
    function SimpleVolume(num) {
        this.num = num;
        this.LblVolume = $("#lbl_vol_" + num);
        this.btnVolUp = $("#vol_up_" + num);
        this.btnVolDown = $("#vol_dn_" + num);
        this.btnMute = $("#vol_mute_" + num);
    }
    SimpleVolume.prototype.LimitVol = function (value) {
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
    };
    SimpleVolume.prototype.EnableVol = function (Switch) {
        if (!Switch) {
            this.btnMute.prop("disabled", false);
            this.LimitVol(this.LblVolume.text());
        }
        else {
            this.btnMute.prop("disabled", true);
            this.btnVolUp.prop("disabled", true);
            this.btnVolDown.prop("disabled", true);
        }
    };
    SimpleVolume.prototype.SwitchVol = function (Switch) {
        var that = this;
        var link = Switch ? "vol_up" : "vol_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.LimitVol(data);
            }
        });
    };
    SimpleVolume.prototype.Mute = function () {
        var that = this;
        var link = "/My/DevAct/vol_mute/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.LimitVol(data);
            }
        });
    };
    return SimpleVolume;
}());
var Termostat = (function () {
    function Termostat(num) {
        this.hiddenTemps = new Array();
        this.hiddenModes = $("#lbl_modes_" + num).text().split(" ");
        this._pmode = $("#lbl_pmode_" + num);
        this.btnPmodeUp = $("#pmode_up_" + num);
        this.btnPmodeDown = $("#pmode_dn_" + num);
        var hid_temps_raw = $("#lbl_temps_" + num).text().split(" ");
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
    Object.defineProperty(Termostat.prototype, "minVal", {
        get: function () {
            if (this.PmodeValue == this.hiddenModes[this.hiddenModes.length - 1])
                return this.hiddenTemps[2];
            else
                return this.hiddenTemps[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Termostat.prototype, "maxVal", {
        get: function () {
            if (this.PmodeValue == this.hiddenModes[0])
                return this.hiddenTemps[1];
            else
                return this.hiddenTemps[3];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Termostat.prototype, "TModeValue", {
        get: function () {
            return parseInt(this.lblTemp.text());
        },
        set: function (value) {
            this.lblTemp.text(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Termostat.prototype, "PmodeValue", {
        get: function () {
            return this._pmode.text();
        },
        set: function (value) {
            this._pmode.text(value);
        },
        enumerable: true,
        configurable: true
    });
    Termostat.prototype.EnablePmode = function (visible) {
        this.ChangePmode(visible);
    };
    Termostat.prototype.ChangePmode = function (visible) {
        var right_temp;
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
            var tmp_up = this.TModeValue == this.hiddenTemps[3] ? true : visible;
            var tmp_dn = this.TModeValue == this.hiddenTemps[0] ? true : visible;
            this.btnPmodeUp.prop("disabled", visible);
            this.btnPmodeDown.prop("disabled", visible);
            this.btnTempUp.prop("disabled", tmp_up);
            this.btnTempDown.prop("disabled", tmp_dn);
            this.btnTempMax.prop("disabled", tmp_up);
            this.btnTempMin.prop("disabled", tmp_dn);
        }
    };
    Termostat.prototype.LimitTemp = function (visible) {
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
    };
    Termostat.prototype.SwitchMode = function (Switch) {
        var that = this;
        var link = Switch ? "pmode_up" : "pmode_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.PmodeValue = data;
                that.ChangePmode(false);
            }
        });
    };
    Termostat.prototype.SwitchTemp = function (Switch) {
        var that = this;
        var link = Switch ? "tmp_up" : "tmp_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.TModeValue = data;
                that.LimitTemp(false);
            }
        });
    };
    Termostat.prototype.MaxMinTemp = function (Switch) {
        var that = this;
        var link = Switch ? "tmp_max" : "tmp_min";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.TModeValue = data;
                that.LimitTemp(false);
            }
        });
    };
    return Termostat;
}());
var RefTemp = (function () {
    function RefTemp(num) {
        this.hiddenTemps = new Array();
        var lblHiddenTemps = $("#lbl_temps_" + num).text().split(" ");
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
    Object.defineProperty(RefTemp.prototype, "TModeValue", {
        get: function () {
            return parseInt(this.lblTemp.text());
        },
        set: function (value) {
            this.lblTemp.text(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RefTemp.prototype, "MinValue", {
        get: function () {
            return this.hiddenTemps[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RefTemp.prototype, "MaxValue", {
        get: function () {
            return this.hiddenTemps[1];
        },
        enumerable: true,
        configurable: true
    });
    RefTemp.prototype.LimitTemp = function (visible) {
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
    };
    RefTemp.prototype.SwitchTemp = function (Switch) {
        var that = this;
        var link = Switch ? "tmp_up" : "tmp_dn";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.TModeValue = data;
                that.LimitTemp(false);
            }
        });
    };
    RefTemp.prototype.MaxMinTemp = function (Switch) {
        var that = this;
        var link = Switch ? "tmp_max" : "tmp_min";
        link = "/My/DevAct/" + link + "/" + this.num;
        $.ajax({
            url: link,
            success: function (data) {
                that.TModeValue = data;
                that.LimitTemp(false);
            }
        });
    };
    return RefTemp;
}());
var RefSpaceSimple = (function () {
    function RefSpaceSimple(num) {
        this.unfocusEnable = true;
        this.num = num;
        this.tbody = $("#tbl_" + num).children('tbody');
        this.lblPwr = $("#lbl_pwr_" + num);
        this.lblFreeSpace = $("#lbl_fspace_" + num);
        this.btnAdd = $("#td_add_" + num);
    }
    RefSpaceSimple.prototype.UpdateElements = function (num) {
        this.btnEdit = $("#td_edit_" + num + "_" + this.num);
        this.btnDelete = $("#td_del_" + num + "_" + this.num);
        this.btnSuccess = $("#td_suc_" + num + "_" + this.num);
        this.btnCancel = $("#td_canc_" + num + "_" + this.num);
        this.lbl0 = $("#td_lbl0_" + num + "_" + this.num);
        this.lbl1 = $("#td_lbl1_" + num + "_" + this.num);
        this.inpt0 = $("#td_inpt0_" + num + "_" + this.num);
        this.inpt1 = $("#td_inpt1_" + num + "_" + this.num);
        this.trField = $("#tr_" + num + "_" + this.num);
    };
    RefSpaceSimple.prototype.Add = function () {
        var freeSpace = parseInt(this.lblFreeSpace.text());
        if (freeSpace > 0) {
            var tbody_1 = this.tbody;
            var num_1 = this.num;
            var trField_1 = this.trField;
            var elemId_1 = this.tbody.children().length > 0 ? parseInt(this.tbody.children().last().attr('id').split("_")[1]) + 1 : 0;
            //if (elemId == 0 || this.tbody.children().last().find('[id*="td_inpt0_"]').is(':hidden')) {
            var link = "/My/Add/ref_add/" + elemId_1 + "/" + num_1;
            $.ajax({
                url: link,
                success: function (data) {
                    tbody_1.append(data);
                    var last_inpt0 = $("#td_inpt0_" + elemId_1 + "_" + num_1);
                    last_inpt0.focus();
                    trField_1.click();
                }
            });
        }
    };
    RefSpaceSimple.prototype.Delete = function (num) {
        var lbl_free_space = this.lblFreeSpace;
        var link = "/My/DevAct/ref_take/" + num + "/0/" + this.num;
        $("#tr_" + num + "_" + this.num).remove();
        $.ajax({
            url: link,
            success: function (data) {
                lbl_free_space.text(data);
            }
        });
    };
    RefSpaceSimple.prototype.Edit = function (num) {
        this.UpdateElements(num);
        var content = this.lbl1.text();
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
    };
    RefSpaceSimple.prototype.Success = function (num) {
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
                var lbl_free_space_1 = this.lblFreeSpace;
                var link = "/My/DevAct/" + "ref_put" + "/" + this.lbl0.text() + "/" + this.lbl1.text() + "/" + this.num;
                $.ajax({
                    url: link,
                    success: function (data) {
                        lbl_free_space_1.text(data);
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
                var lbl_free_space_2 = this.lblFreeSpace;
                var link = "/My/DevAct/" + "ref_take" + "/" + num + "/" + this.lbl1.text() + "/" + this.num;
                $.ajax({
                    url: link,
                    success: function (data) {
                        lbl_free_space_2.text(data);
                    }
                });
            }
            else {
                Overlay.Show("Значение поля \"Объём\" должно быть больше 0 и меньше " + this.lblFreeSpace.text(), 3000);
                this.inpt1.focus();
            }
        }
    };
    RefSpaceSimple.prototype.Cancel = function (num) {
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
    };
    RefSpaceSimple.prototype.ClickTd1 = function (num) {
        this.UpdateElements(num);
        if (this.lblPwr.text() != "выкл" && this.inpt1.is(':hidden')) {
            var content = this.lbl1.text();
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
    };
    RefSpaceSimple.prototype.CheckTd0 = function (num) {
        this.UpdateElements(num);
        var split_val = this.inpt0.val().split(" ");
        var reg = new RegExp("^([A-Z]?[a-z]{0,10}([a-z]{1}$|[\,\.\-\:]{1}$))|^([А-Я]?[а-я]{0,10}([а-я]{1}$|[\,\.\-\:]{1}$))|^([A-Z]{1}|[А-Я]{1})$|^(([A-Z]{1}|[А-Я]{1})[\,\.\-\:]{1})$|^([0-9]{1,10})$", "");
        var check = true;
        if (split_val.length == 1) {
            check = split_val[0].search(reg) != 0 ? false : true;
            if (check) {
                var allLbl = this.tbody.find('[id*="td_lbl0_"]');
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
    };
    RefSpaceSimple.prototype.CheckTd1 = function (num) {
        this.UpdateElements(num);
        if (this.inpt1.val().search(/^([1-9]{1}[0-9]{1})$|^([1-9]{1})$/) == 0) {
            var freeSpace = parseInt(this.lblFreeSpace.text());
            var mainSpace = parseInt(this.lbl1.text());
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
    };
    RefSpaceSimple.prototype.PressTd1 = function (num) {
        this.UpdateElements(num);
        this.inpt1.removeClass("invalid");
    };
    RefSpaceSimple.prototype.OnblurTr = function (num) {
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
    };
    RefSpaceSimple.prototype.EnableRefSpace = function (visible) {
        var allLbl0 = this.tbody.find('[id*="td_lbl0_"]');
        var allLbl1 = this.tbody.find('[id*="td_lbl1_"]');
        var allEdit = this.tbody.find('[id*="td_edit_"]');
        var allDel = this.tbody.find('[id*="td_del_"]');
        this.btnAdd.prop("disabled", visible);
        if (allLbl0.length > 0) {
            for (var i = 0; i < allLbl0.length; i++) {
                $("#" + allLbl0[i].id).prop("disabled", visible);
                $("#" + allLbl1[i].id).prop("disabled", visible);
                $("#" + allEdit[i].id).prop("disabled", visible);
                $("#" + allDel[i].id).prop("disabled", visible);
            }
        }
    };
    RefSpaceSimple.prototype.CheckTr = function (num) {
        var idTr = "#tr_" + num + "_" + this.num;
        var that = this;
        var check = $(document).on("click", function (e) {
            var elem = $(e.target);
            var outOfArea = elem.closest(idTr).length == 0;
            var valId = elem.attr("id");
            var checklbl0 = valId == undefined ? false : valId.search("lbl0") >= 0;
            if (outOfArea || checklbl0) {
                that.OnblurTr(num);
            }
            //$(document).off('click');
            check = null;
        });
    };
    return RefSpaceSimple;
}());
var TimerMicr = (function () {
    function TimerMicr(num) {
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
    TimerMicr.prototype.Start = function () {
        this.btnStop.show();
        this.btnReset.hide();
        this.btnStop.prop("disabled", false);
        this.btnStart.prop("disabled", true);
        this.lblShowRest.show();
        var time = parseInt(this.lblRestTime.text());
        var lblRestTime = this.lblRestTime;
        var that = this;
        var num = this.num;
        this.timer = setTimeout(function () {
            Overlay.Show("Таймер №" + num + " сработал!");
            that.Reset();
        }, time * 1000);
        this.tmpTimer = setInterval(function () {
            lblRestTime.text(parseInt(lblRestTime.text()) - 1);
        }, 1000);
        //let link: string = "/My/DevAct/micr_start/" + this.num;
        //$.ajax({
        //    url: link
        //});
    };
    TimerMicr.prototype.Stop = function () {
        this.btnStart.prop("disabled", false);
        this.btnStop.hide();
        this.btnReset.show();
        clearTimeout(this.timer);
        clearTimeout(this.tmpTimer);
        var that = this;
        var link = "/My/DevAct/micr_stop/" + this.lblRestTime.text() + "/" + this.num;
        $.ajax({
            url: link,
        });
    };
    TimerMicr.prototype.Reset = function (visible) {
        if (visible === void 0) { visible = false; }
        this.btnReset.hide();
        this.btnStop.show();
        this.btnStart.prop("disabled", visible);
        this.btnStop.prop("disabled", true);
        clearTimeout(this.timer);
        clearTimeout(this.tmpTimer);
        this.ShowRest();
        var link = "/My/DevAct/micr_res/" + this.num;
        $.ajax({
            url: link
        });
    };
    TimerMicr.prototype.ShowRest = function (num) {
        if (num === void 0) { num = 0; }
        if (num > 0) {
            this.lblRestTime.text(num);
            this.lblShowRest.show();
        }
        else {
            this.lblRestTime.text(this.lblTime.text());
            this.lblShowRest.hide();
        }
    };
    TimerMicr.prototype.Edit = function () {
        var content = this.lblTime.text();
        this.input.val(content);
        this.lblTime.hide();
        this.btnEdit.hide();
        this.input.show();
        this.btnSuccess.show();
        this.btnCancel.show();
        this.input.focus();
        this.input.select();
    };
    TimerMicr.prototype.Success = function () {
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
                var content = this.input.val();
                this.lblTime.text(content);
                this.lblRestTime.text(content);
                var link = "/My/DevAct/micr_suc/" + content + "/" + this.num;
                $.ajax({
                    url: link
                });
            }
        }
    };
    TimerMicr.prototype.Cancel = function () {
        if (this.input.is(":visible")) {
            this.lblTime.show();
            this.btnEdit.show();
            this.input.hide();
            this.btnSuccess.hide();
            this.btnCancel.hide();
            this.input.removeClass("invalid");
        }
    };
    TimerMicr.prototype.Onblur = function () {
        var that = this;
        var checkSuc = this.btnSuccess.attr("id");
        var checkEdit = this.btnEdit.attr("id");
        var checkInput = this.input.attr("id");
        var check = $(document).on("click", function (e) {
            var elem = $(e.target);
            var valId = elem.attr("id");
            if (valId != undefined) {
                var check_1 = valId == checkEdit || valId == checkInput ? false : true;
                if (valId == checkSuc) {
                    //$(document).off('click');
                    check_1 = null;
                }
                else if (check_1) {
                    that.Cancel();
                    //$(document).off('click');
                    check_1 = null;
                }
            }
            else
                that.Cancel();
            //$(document).off('click');
            check = null;
        });
    };
    TimerMicr.prototype.EnableTimer = function (visible) {
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
    };
    return TimerMicr;
}());
var Light = (function (_super) {
    __extends(Light, _super);
    function Light(num, Pmode) {
        var _this = _super.call(this, num) || this;
        _this.num = num;
        _this.Pmode = Pmode;
        return _this;
    }
    Object.defineProperty(Light.prototype, "PmodeValue", {
        set: function (value) {
            this.Pmode.PmodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Light.prototype.enableContent = function () {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
        }
        else {
            this.EnablePmode(false);
        }
    };
    Light.prototype.EnablePmode = function (visible) {
        this.Pmode.EnablePmode(visible);
    };
    Light.prototype.ChangePmode = function (visible) {
        if (visible === void 0) { visible = null; }
        this.Pmode.ChangePmode(visible);
    };
    Light.prototype.SwitchMode = function (Switch) {
        this.Pmode.SwitchMode(Switch);
    };
    return Light;
}(Dev));
var TV = (function (_super) {
    __extends(TV, _super);
    function TV(num, Pmode, Channel, Volume) {
        var _this = _super.call(this, num) || this;
        _this.num = num;
        _this.Pmode = Pmode;
        _this.Channel = Channel;
        _this.Volume = Volume;
        return _this;
    }
    Object.defineProperty(TV.prototype, "PmodeValue", {
        set: function (value) {
            this.Pmode.PmodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    TV.prototype.enableContent = function () {
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
    };
    TV.prototype.EnablePmode = function (visible) {
        this.Pmode.EnablePmode(visible);
    };
    TV.prototype.ChangePmode = function (visible) {
        if (visible === void 0) { visible = null; }
        this.Pmode.ChangePmode(visible);
    };
    TV.prototype.SwitchMode = function (Switch) {
        this.Pmode.SwitchMode(Switch);
    };
    TV.prototype.EnableChn = function (visible) {
        this.Channel.EnableChn(visible);
    };
    TV.prototype.LimitChn = function (value) {
        this.Channel.LimitChn(value);
    };
    TV.prototype.SwitchChn = function (Switch) {
        this.Channel.SwitchChn(Switch);
    };
    TV.prototype.WriteChn = function () {
        this.Channel.WriteChn();
    };
    TV.prototype.BackChn = function () {
        this.Channel.BackChn();
    };
    TV.prototype.IsNumber = function (event, value) {
        return this.Channel.IsNumber(event, value);
    };
    TV.prototype.ClearInput = function () {
        this.Channel.ClearInput();
    };
    TV.prototype.FillInput = function () {
        this.Channel.FillInput();
    };
    TV.prototype.SwitchVol = function (Switch) {
        this.Volume.SwitchVol(Switch);
    };
    TV.prototype.Mute = function () {
        this.Volume.Mute();
    };
    TV.prototype.EnableVol = function (Switch) {
        this.Volume.EnableVol(Switch);
    };
    TV.prototype.LimitVol = function (value) { };
    return TV;
}(Dev));
var Conditioner = (function (_super) {
    __extends(Conditioner, _super);
    function Conditioner(num, Pmode, Temperature) {
        var _this = _super.call(this, num) || this;
        _this.num = num;
        _this.Pmode = Pmode;
        _this.Temperature = Temperature;
        return _this;
    }
    Object.defineProperty(Conditioner.prototype, "PmodeValue", {
        set: function (value) {
            this.Pmode.PmodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Conditioner.prototype, "TModeValue", {
        set: function (value) {
            this.Temperature.TModeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Conditioner.prototype.enableContent = function () {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
        }
        else {
            this.EnablePmode(false);
        }
    };
    Conditioner.prototype.EnablePmode = function (visible) {
        this.Pmode.EnablePmode(visible);
    };
    Conditioner.prototype.ChangePmode = function (visible) {
        if (visible === void 0) { visible = null; }
        this.Pmode.ChangePmode(visible);
    };
    Conditioner.prototype.SwitchMode = function (Switch) {
        this.Pmode.SwitchMode(Switch);
    };
    Conditioner.prototype.LimitTemp = function (visible) {
        this.Temperature.LimitTemp(visible);
    };
    Conditioner.prototype.SwitchTemp = function (Switch) {
        this.Temperature.SwitchTemp(Switch);
    };
    Conditioner.prototype.MaxMinTemp = function (Switch) {
        this.Temperature.MaxMinTemp(Switch);
    };
    return Conditioner;
}(Dev));
var Refrigerator = (function (_super) {
    __extends(Refrigerator, _super);
    function Refrigerator(num, Pmode, Temperature, RefField) {
        var _this = _super.call(this, num) || this;
        _this.num = num;
        _this.Pmode = Pmode;
        _this.RefField = RefField;
        _this.Temperature = Temperature;
        return _this;
    }
    Object.defineProperty(Refrigerator.prototype, "PmodeValue", {
        set: function (value) {
            this.Pmode.PmodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Refrigerator.prototype, "TModeValue", {
        set: function (value) {
            this.Temperature.TModeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Refrigerator.prototype.enableContent = function () {
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
    };
    Refrigerator.prototype.EnablePmode = function (visible) {
        this.Pmode.EnablePmode(visible);
    };
    Refrigerator.prototype.ChangePmode = function (visible) {
        if (visible === void 0) { visible = null; }
        this.Pmode.ChangePmode(visible);
    };
    Refrigerator.prototype.SwitchMode = function (Switch) {
        this.Pmode.SwitchMode(Switch);
    };
    Refrigerator.prototype.Add = function () {
        this.RefField.Add();
    };
    Refrigerator.prototype.Edit = function (num) {
        this.RefField.Edit(num);
    };
    Refrigerator.prototype.Delete = function (num) {
        this.RefField.Delete(num);
    };
    Refrigerator.prototype.Success = function (num) {
        this.RefField.Success(num);
    };
    Refrigerator.prototype.Cancel = function (num) {
        this.RefField.Cancel(num);
    };
    Refrigerator.prototype.ClickTd1 = function (num) {
        this.RefField.ClickTd1(num);
    };
    Refrigerator.prototype.CheckTd0 = function (num) {
        this.RefField.CheckTd0(num);
    };
    Refrigerator.prototype.CheckTd1 = function (num) {
        this.RefField.CheckTd1(num);
    };
    Refrigerator.prototype.PressTd1 = function (num) {
        this.RefField.PressTd1(num);
    };
    Refrigerator.prototype.OnblurTr = function (num) {
        this.RefField.OnblurTr(num);
    };
    Refrigerator.prototype.CheckTr = function (num) {
        this.RefField.CheckTr(num);
    };
    Refrigerator.prototype.EnableRefSpace = function (visible) {
        this.RefField.EnableRefSpace(visible);
    };
    Refrigerator.prototype.LimitTemp = function (visible) {
        this.Temperature.LimitTemp(visible);
    };
    Refrigerator.prototype.SwitchTemp = function (Switch) {
        this.Temperature.SwitchTemp(Switch);
    };
    Refrigerator.prototype.MaxMinTemp = function (Switch) {
        this.Temperature.MaxMinTemp(Switch);
    };
    return Refrigerator;
}(Dev));
var Microwave = (function (_super) {
    __extends(Microwave, _super);
    function Microwave(num, Pmode, Timer) {
        var _this = _super.call(this, num) || this;
        _this.num = num;
        _this.Pmode = Pmode;
        _this.Timer = Timer;
        return _this;
    }
    Object.defineProperty(Microwave.prototype, "PmodeValue", {
        set: function (value) {
            this.Pmode.PmodeValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Microwave.prototype.enableContent = function () {
        if (this.PowerState == "выкл") {
            this.EnablePmode(true);
            this.EnableTimer(true);
        }
        else {
            this.EnablePmode(false);
            this.EnableTimer(false);
        }
    };
    Microwave.prototype.EnablePmode = function (visible) {
        this.Pmode.EnablePmode(visible);
    };
    Microwave.prototype.ChangePmode = function (visible) {
        this.Pmode.ChangePmode(visible);
    };
    Microwave.prototype.SwitchMode = function (Switch) {
        this.Pmode.SwitchMode(Switch);
    };
    Microwave.prototype.Start = function () {
        this.Timer.Start();
    };
    Microwave.prototype.Stop = function () {
        this.Timer.Stop();
    };
    Microwave.prototype.Edit = function () {
        this.Timer.Edit();
    };
    Microwave.prototype.Success = function () {
        this.Timer.Success();
    };
    Microwave.prototype.Cancel = function () {
        this.Timer.Cancel();
    };
    Microwave.prototype.Onblur = function () {
        this.Timer.Onblur();
    };
    Microwave.prototype.ShowRest = function (num) {
        this.Timer.ShowRest(num);
    };
    Microwave.prototype.EnableTimer = function (visible) {
        this.Timer.EnableTimer(visible);
    };
    Microwave.prototype.Reset = function () {
        this.Timer.Reset();
    };
    return Microwave;
}(Dev));
//# sourceMappingURL=Index.js.map