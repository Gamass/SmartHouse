using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Conditioner : Device, ITermostat
    {
        public ATermostat Termostat { get; private set; }

        [NotMapped]
        public int[] AllTemps => Termostat.AllTemps;

        [NotMapped]
        public int modeLvl => Termostat.modeLvl;

        [NotMapped]
        public int temperature => Termostat.temperature;

        public Conditioner(string Name, ATermostat Termostat) : base(Name)
        {
            this.Termostat = Termostat;
        }

        private Conditioner() { }

        public void ChangeMode(bool UpDown) => Termostat.ChangeMode(UpDown);

        public string CurrentMode() => Termostat.CurrentMode();

        public (string first, string last) FirstLastModes() => Termostat.FirstLastModes();

        public void ChangeTemperature(bool UpDown) => Termostat.ChangeTemperature(UpDown);

        public void MinTemperature() => Termostat.MinTemperature();

        public void MaxTemperature() => Termostat.MaxTemperature();

    }
}