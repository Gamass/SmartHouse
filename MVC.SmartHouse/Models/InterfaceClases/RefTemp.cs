using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace MVC.SmartHouse.Models
{
    public class RefTemp : ATemperature
    {
        [Required]
        public int _temperature { get; private set; }

        [NotMapped]
        public override int temperature
        {
            get
            {
                return _temperature;
            }
            protected set
            {
                if (value >= AllTemps[0] && value <= AllTemps[1])
                {
                    _temperature = value;
                }
            }
        }

        /// <param name="TempLimits">2 values: min & max</param>
        public RefTemp(int[] TempLimits = null)
        {
            AllTemps = TempLimits?.Length == 2 ? TempLimits : new int[] { 0, 10 };
            _temperature = 5;
        }

        private RefTemp() { }

        public override void ChangeTemperature(bool UpDown)
        {
            temperature += UpDown ? 1 : -1;
        }

        public override void MinTemperature()
        {
            temperature = AllTemps[0];
        }

        public override void MaxTemperature()
        {
            temperature = AllTemps[1];
        }
    }
}