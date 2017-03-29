using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC.SmartHouse.Models;
using System.Data.Entity;


namespace MVC.SmartHouse.Controllers
{
    public class MyController : Controller
    {
        public ActionResult Index()
        {
            try
            {
                using (DeviceContext db = new DeviceContext())
                {
                    var devs = db.Devices.DeviceFullLoad().ToArray();
                    return View("Index", devs);
                }
            }
            catch(Exception)
            {
                return View("Index", null);
            }
        }

        public PartialViewResult Add(string catchhall)
        {
            var catchs = catchhall.Split('/');
            Device newDevice;
            using (DeviceContext db = new DeviceContext())
            {

                if (catchs[0] == "light")
                {
                    newDevice = new Light("Лампа", new Modeslvl(new string[] { "низкий", "средний", "высокий", "максимальный" }));
                    db.Devices.Add(newDevice);
                    db.SaveChanges();
                    return PartialView("PartLight", newDevice);
                }
                else if (catchs[0] == "tv")
                {
                    newDevice = new TV("TV", new Modeslvl(new string[] { "низкий", "средний", "высокий", "максимальный" }), new Volume100(), new Channel100());
                    db.Devices.Add(newDevice);
                    db.SaveChanges();
                    return PartialView("PartTV", newDevice);
                }
                else if (catchs[0] == "cond")
                {
                    newDevice = new Conditioner("Cond", new Termostat());
                    db.Devices.Add(newDevice);
                    db.SaveChanges();
                    return PartialView("PartCond", newDevice);
                }
                else if (catchs[0] == "ref")
                {
                    newDevice = new Refrigerator("Ref", new Modeslvl(new string[] { "экономный", "авто", "интенсивный" }), new RefTemp(), new RefrigeratorSpace(50));
                    db.Devices.Add(newDevice);
                    db.SaveChanges();
                    return PartialView("PartRef", newDevice);
                }
                else if (catchs[0] == "ref_add")
                {
                    return PartialView("PartRefItem", new int[] { Convert.ToInt32(catchs[1]), Convert.ToInt32(catchs[2]) });
                }
                else if (catchs[0] == "micr")
                {
                    newDevice = new Microwave("Micr", new Modeslvl((new string[] { "разморозка", "низкий", "средний", "макс" })), new NetTimer());
                    db.Devices.Add(newDevice);
                    db.SaveChanges();
                    return PartialView("PartMicrowave", newDevice);
                }
                else
                {
                    throw new Exception("Bad Request");
                }
            }
        }

        public string DevAct(string catchhall)
        {
            string result = "";
            try
            {
                var catchs = catchhall.Split('/');
                var id = Convert.ToInt32(catchs[catchs.Length - 1]);
                using (var db = new DeviceContext())
                {
                    var device = db.Devices.DeviceFullLoad(id);
                    switch (catchs[0])
                    {
                        case "Power":
                            device.Power();
                            result = device.PwrState;
                            break;
                        case "Delete":
                            db.Devices.DeviceFullClear(device);
                            device = null;
                            result = "";
                            break;
                        case "pmode_up":
                            ((IModes)device).ChangeMode(true);
                            result = ((IModes)device).CurrentMode();
                            break;
                        case "pmode_dn":
                            ((IModes)device).ChangeMode(false);
                            result = ((IModes)device).CurrentMode();
                            break;
                        case "chn_up":
                            ((IChannel)device).ChangeChannel(true);
                            result = ((IChannel)device).channel.ToString();
                            break;
                        case "chn_dn":
                            ((IChannel)device).ChangeChannel(false);
                            result = ((IChannel)device).channel.ToString();
                            break;
                        case "vol_up":
                            ((IVolume)device).ChangeVolume(true);
                            result = ((IVolume)device).volume.ToString();
                            break;
                        case "vol_dn":
                            ((IVolume)device).ChangeVolume(false);
                            result = ((IVolume)device).volume.ToString();
                            break;
                        case "vol_mute":
                            ((IVolume)device).MuteVolume();
                            result = ((IVolume)device).mute ? "MUTE" : ((IVolume)device).volume.ToString();
                            break;
                        case "chn_bck":
                            ((IChannel)device).BackToLastChannel();
                            result = ((IChannel)device).channel.ToString();
                            break;
                        case "chn_write":
                            ((IChannel)device).WriteChannel(Convert.ToInt32(catchs[1]));
                            result = ((IChannel)device).channel.ToString();
                            break;
                        case "tmp_up":
                            ((ITemperature)device).ChangeTemperature(true);
                            result = ((ITemperature)device).temperature.ToString();
                            break;
                        case "tmp_dn":
                            ((ITemperature)device).ChangeTemperature(false);
                            result = ((ITemperature)device).temperature.ToString();
                            break;
                        case "tmp_min":
                            ((ITemperature)device).MinTemperature();
                            result = ((ITemperature)device).temperature.ToString();
                            break;
                        case "tmp_max":
                            ((ITemperature)device).MaxTemperature();
                            result = ((ITemperature)device).temperature.ToString();
                            break;
                        case "ref_put":
                            ((ICapacitySpace)device).Put(new RefItem { Name = catchs[1], Value = Convert.ToInt32(catchs[2]) });
                            result = ((ICapacitySpace)device).FreeSpace().ToString();
                            break;
                        case "ref_take":
                            ((ICapacitySpace)device).Take(Convert.ToInt32(catchs[1]), Convert.ToInt32(catchs[2]));
                            result = ((ICapacitySpace)device).FreeSpace().ToString();
                            break;
                        //case "micr_start":
                        //    ((ITimer)Devs[id]).Start();
                        //    Session["Devs"] = Devs;
                        //    return "";
                        case "micr_stop":
                            ((ITimer)device).restTime = Convert.ToInt32(catchs[1]);
                            result = ((ITimer)device).restTime.ToString();
                            break;
                        case "micr_suc":
                            ((ITimer)device).time = Convert.ToInt32(catchs[1]);
                            break;
                        case "micr_res":
                            ((ITimer)device).Reset();
                            break;
                        default:
                            device = null;
                            break;
                    }
                    if (device != null)
                        db.Devices.DeviceFullSave(device);
                }
            }
            catch (Exception) { }
            return result;
        }
    }
}