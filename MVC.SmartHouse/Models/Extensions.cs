using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MVC.SmartHouse.Models
{
    public static class Extensions
    {
        //Метод расширения выборки из Devices включая все навигационные свойства
        public static IQueryable<Device> DeviceFullLoad(this IQueryable<Device> query)
        {
            var devs = query.ToList();
            using (DeviceContext db = new DeviceContext())
            {
                int id;
                for (var i = 0; i < devs.Count; i++)
                {
                    var className = devs[i].GetType().Name;
                    id = devs[i].Id;
                    switch (className)
                    {
                        case "Conditioner":
                            devs[i] = db.Conditioners.Include(v => v.Termostat)
                                                     .Single(v => v.Id == id);
                            break;
                        case "Light":
                            devs[i] = db.Lights.Include(v => v.PowerMode)
                                                              .Single(v => v.Id == id);
                            break;
                        case "Microwave":
                            devs[i] = db.Microwaves.Include(v => v.PowerMode)
                                                   .Include(v => v.Timer)
                                                   .Single(v => v.Id == id);
                            break;
                        case "Refrigerator":
                            devs[i] = db.Refrigerators.Include(v => v.PowerMode)
                                                      .Include(v => v.Temperature)
                                                      .Include(v => v.CapacitySpace.SpaceElements)
                                                      .Single(v => v.Id == id);
                            break;
                        case "TV":
                            devs[i] = db.TVs.Include(v => v.PowerMode)
                                                           .Include(v => v.Channel)
                                                           .Include(v => v.Volume)
                                                           .Single(v => v.Id == id);
                            break;
                    }
                }
                return devs.AsQueryable();
            }
        }

        //Метод расширения выборки одного объекта по Id из Devices включая все навигационные свойства
        public static Device DeviceFullLoad(this IQueryable<Device> query, int id)
        {
            using (DeviceContext db = new DeviceContext())
            {
                var dev = db.Devices.Find(id);
                var className = dev.GetType().Name;
                switch (className)
                {
                    case "Conditioner":
                        dev = db.Conditioners.Include(v => v.Termostat)
                                             .Single(v => v.Id == id);
                        break;
                    case "Light":
                        dev = db.Lights.Include(v => v.PowerMode)
                                                      .Single(v => v.Id == id);
                        break;
                    case "Microwave":
                        dev = db.Microwaves.Include(v => v.PowerMode)
                                           .Include(v => v.Timer)
                                           .Single(v => v.Id == id);
                        break;
                    case "Refrigerator":
                        dev = db.Refrigerators.Include(v => v.PowerMode)
                                              .Include(v => v.Temperature)
                                              .Include(v => v.CapacitySpace.SpaceElements)
                                              .Single(v => v.Id == id);
                        break;
                    case "TV":
                        dev = db.TVs.Include(v => v.PowerMode)
                                    .Include(v => v.Channel)
                                    .Include(v => v.Volume)
                                    .Single(v => v.Id == id);
                        break;
                }
                return dev;
            }
        }

        //Метод расширения удаления из Devices включая все навигационные свойства
        public static void DeviceFullClear(this IQueryable<Device> query, Device dev)
        {
            using (DeviceContext db = new DeviceContext())
            {
                var id = dev.Id;
                var className = dev.GetType().Name;
                switch (className)
                {
                    case "Conditioner":
                        db.AModeTemperatures.Remove(db.AModeTemperatures.Find(((Conditioner)dev).Termostat.Id));
                        break;
                    case "Light":
                        db.AModes.Remove(db.AModes.Find(((Light)dev).PowerMode.Id));
                        break;
                    case "Microwave":
                        db.AModes.Remove(db.AModes.Find(((Microwave)dev).PowerMode.Id));
                        db.ATimers.Remove(db.ATimers.Find(((Microwave)dev).Timer.Id));
                        break;
                    case "Refrigerator":
                        db.AModes.Remove(db.AModes.Find(((Refrigerator)dev).PowerMode.Id));
                        db.ATemperatures.Remove(db.ATemperatures.Find(((Refrigerator)dev).Temperature.Id));
                        foreach (var elem in ((Refrigerator)dev).CapacitySpace.SpaceElements)
                        {
                            db.RefItems.Remove(db.RefItems.Find(elem.Id));
                        }
                        db.ACapacitySpaces.Remove(db.ACapacitySpaces.Find(((Refrigerator)dev).CapacitySpace.Id));
                        break;
                    case "TV":
                        db.AModes.Remove(db.AModes.Find(((TV)dev).PowerMode.Id));
                        db.AChannels.Remove(db.AChannels.Find(((TV)dev).Channel.Id));
                        db.AVolumes.Remove(db.AVolumes.Find(((TV)dev).Volume.Id));
                        break;
                }
                db.Devices.Remove(db.Devices.Find(id));
                db.SaveChanges();
            }
        }

        public static void DeviceFullSave(this IQueryable<Device> query, Device dev)
        {
            using (DeviceContext db = new DeviceContext())
            {
                var id = dev.Id;
                var origDev = db.Devices.Find(id);
                var className = dev.GetType().Name;
                AMode aModeOrig;
                switch (className)
                {
                    case "Conditioner":
                        var aModeTempOrig = db.AModeTemperatures.Find(((Conditioner)dev).Termostat.Id);
                        db.Entry(aModeTempOrig).CurrentValues.SetValues(((Conditioner)dev).Termostat);
                        break;
                    case "Light":
                        aModeOrig = db.AModes.Find(((Light)dev).PowerMode.Id);
                        db.Entry(aModeOrig).CurrentValues.SetValues(((Light)dev).PowerMode);
                        break;
                    case "Microwave":
                        aModeOrig = db.AModes.Find(((Microwave)dev).PowerMode.Id);
                        db.Entry(aModeOrig).CurrentValues.SetValues(((Microwave)dev).PowerMode);
                        var aTimerOrig = db.ATimers.Find(((Microwave)dev).Timer.Id);
                        db.Entry(aTimerOrig).CurrentValues.SetValues(((Microwave)dev).Timer);
                        break;
                    case "Refrigerator":
                        var aCapSpaceOrig = db.ACapacitySpaces.Find(((Refrigerator)dev).CapacitySpace.Id);
                        var RefElemOrig = db.RefItems.Where(v => v.CapacitySpaceID == ((Refrigerator)dev).CapacitySpace.Id).ToList();
                        var RefElemUpd = ((Refrigerator)dev).SpaceElements;
                        var RefElemUpdIds = RefElemUpd.Select(v => v.Id);
                        var RefElemOrigIds = RefElemOrig.Select(v => v.Id);
                        var RefElemAdded = RefElemUpd.Where(v => v.Id == 0);
                        var RefElemDeletedNums = RefElemOrigIds.Except(RefElemUpdIds);
                        if(RefElemAdded.Count() > 0)
                        {
                            foreach(var elem in RefElemAdded)
                            {
                                db.RefItems.Add(elem);
                            }
                        }
                        IEnumerable<RefItem> RefElemOrigToUpd;
                        if (RefElemDeletedNums.Count() > 0)
                        {
                            var RefElemOrigDeleted = RefElemOrig.Where(v => RefElemDeletedNums.Contains(v.Id));
                            foreach(var elem in RefElemOrigDeleted)
                            {
                                db.RefItems.Remove(elem);
                            }
                            RefElemOrigToUpd = RefElemOrig.Except(RefElemOrigDeleted);
                        }
                        else
                        {
                            RefElemOrigToUpd = RefElemOrig;
                        }
                        foreach(var elem in RefElemOrigToUpd)
                        {
                            var elemUpdt = RefElemUpd.Where(v => v.Id == elem.Id).Single();
                            db.Entry(elem).CurrentValues.SetValues(elemUpdt);
                        }
                        db.Entry(aCapSpaceOrig).CurrentValues.SetValues(((Refrigerator)dev).CapacitySpace);
                        aModeOrig = db.AModes.Find(((Refrigerator)dev).PowerMode.Id);
                        db.Entry(aModeOrig).CurrentValues.SetValues(((Refrigerator)dev).PowerMode);
                        var aTempOrig = db.ATemperatures.Find(((Refrigerator)dev).Temperature.Id);
                        db.Entry(aTempOrig).CurrentValues.SetValues(((Refrigerator)dev).Temperature);
                        break;
                    case "TV":
                        aModeOrig = db.AModes.Find(((TV)dev).PowerMode.Id);
                        db.Entry(aModeOrig).CurrentValues.SetValues(((TV)dev).PowerMode);
                        var aChannelOrig = db.AChannels.Find(((TV)dev).Channel.Id);
                        db.Entry(aChannelOrig).CurrentValues.SetValues(((TV)dev).Channel);
                        var aVolumeOrig = db.AVolumes.Find(((TV)dev).Volume.Id);
                        db.Entry(aVolumeOrig).CurrentValues.SetValues(((TV)dev).Volume);
                        break;
                }
                db.Entry(origDev).CurrentValues.SetValues(dev);
                db.SaveChanges();
            }
        }
    }
}