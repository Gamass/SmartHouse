using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace MVC.SmartHouse.Models
{
    public class DeviceContext : DbContext
    {
        static DeviceContext()
        {
            Database.SetInitializer<DeviceContext>(new DeviceContextInitializer());
        }

        public DbSet<Device> Devices{ get; set; }
        public DbSet<Light> Lights { get; set; }
        public DbSet<TV> TVs { get; set; }
        public DbSet<Conditioner> Conditioners { get; set; }
        public DbSet<Refrigerator> Refrigerators { get; set; }
        public DbSet<Microwave> Microwaves { get; set; }

        public DbSet<Modeslvl> Modeslvls { get; set; }
        public DbSet<Termostat> Termostats { get; set; }
        public DbSet<Channel100> Channel100s { get; set; }
        public DbSet<RefrigeratorSpace> RefrigeratorSpaces { get; set; }
        public DbSet<RefTemp> RefTemps { get; set; }
        public DbSet<RefItem> RefItems { get; set; }
        public DbSet<NetTimer> NetTimers { get; set; }
        public DbSet<Volume100> Volume100s { get; set; }

        public DbSet<ACapacitySpace> ACapacitySpaces { get; set; }
        public DbSet<AChannel> AChannels { get; set; }
        public DbSet<AMode> AModes { get; set; }
        public DbSet<ATermostat> AModeTemperatures { get; set; }
        public DbSet<ATemperature> ATemperatures { get; set; }
        public DbSet<AVolume> AVolumes { get; set; }
        public DbSet<ATimer> ATimers { get; set; }
    }
}