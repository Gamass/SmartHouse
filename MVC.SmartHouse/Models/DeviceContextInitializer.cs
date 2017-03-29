using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MVC.SmartHouse.Models
{
    public class DeviceContextInitializer: DropCreateDatabaseAlways<DeviceContext>
    {
        protected override void Seed(DeviceContext context)
        {
            var light = new Light("Лампа", new Modeslvl(new string[] { "низкий", "средний", "высокий", "максимальный" }));
            var tv = new TV("TV", new Modeslvl(new string[] { "низкий", "средний", "высокий", "максимальный" }), new Volume100(), new Channel100());
            var cond = new Conditioner("Cond", new Termostat());
            var refrig = new Refrigerator("Ref", new Modeslvl(new string[] { "экономный", "авто", "интенсивный" }), new RefTemp(), new RefrigeratorSpace(50));
            var micr = new Microwave("Micr", new Modeslvl(new string[] { "разморозка", "низкий", "средний", "макс" }), new NetTimer());
            context.Devices.Add(light);
            context.Devices.Add(tv);
            context.Devices.Add(cond);
            context.Devices.Add(refrig);
            context.Devices.Add(micr);
            context.SaveChanges();
        }
    }
}