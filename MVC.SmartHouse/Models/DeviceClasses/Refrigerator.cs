using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    [Serializable]
    public class Refrigerator : Device, IModes, ITemperature, ICapacitySpace
    {
        public AMode PowerMode { get; private set; }

        public ATemperature Temperature { get; private set; }

        public ACapacitySpace CapacitySpace { get; private set; }

        [NotMapped]
        public int modeLvl => PowerMode.modeLvl;

        [NotMapped]
        public int temperature => Temperature.temperature;

        [NotMapped]
        public int SpaceLimit => CapacitySpace.SpaceLimit;

        [NotMapped]
        public int[] AllTemps => Temperature.AllTemps;

        [NotMapped]
        public List<RefItem> SpaceElements => CapacitySpace.SpaceElements;

        public Refrigerator(string Name, AMode PowerMode, ATemperature Temperature, ACapacitySpace CapacitySpace) : base(Name)
        {
            this.PowerMode = PowerMode;
            this.Temperature = Temperature;
            this.CapacitySpace = CapacitySpace;
        }

        private Refrigerator() { }

        public void ChangeMode(bool UpDown) => PowerMode.ChangeMode(UpDown);

        public string CurrentMode() => PowerMode.CurrentMode();

        public (string first, string last) FirstLastModes() => PowerMode.FirstLastModes();

        public void ChangeTemperature(bool UpDown) => Temperature.ChangeTemperature(UpDown);

        public void MinTemperature() => Temperature.MinTemperature();

        public void MaxTemperature() => Temperature.MaxTemperature();

        public int FreeSpace() => CapacitySpace.FreeSpace();

        public bool Put(RefItem item) => CapacitySpace.Put(item);

        public bool Take(int num, int volume) => CapacitySpace.Take(num, volume);
    }
}