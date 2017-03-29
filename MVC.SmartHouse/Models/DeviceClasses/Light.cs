using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Light : Device, IModes
    {
        public AMode PowerMode { get; private set; }

        [NotMapped]
        public int modeLvl => PowerMode.modeLvl;

        /// <param name="PowerMode">Only successor of AMode</param>
        public Light (string Name, AMode PowerMode) : base(Name)
        {
            this.PowerMode = PowerMode;
        }

        private Light() { }

        public void ChangeMode(bool UpDown) => PowerMode.ChangeMode(UpDown);

        public string CurrentMode() => PowerMode.CurrentMode();

        public (string first, string last) FirstLastModes() => PowerMode.FirstLastModes();
    }
}