using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Termostat : ATermostat
    {
        [Required]
        public int _modeLvl { get; private set; }

        [Required]
        public int _temperature { get; private set; }

        [NotMapped]
        public override int modeLvl
        {
            get
            {
                return _modeLvl;
            }
            protected set
            {
                if (value >= 0 && value < modesMas.Length)
                {
                    _modeLvl = value;
                    if (_modeLvl == 0 && temperature > AllTemps[1])
                    {
                        temperature = AllTemps[0];
                    }
                    else if (_modeLvl == modesMas.Length - 1 && temperature < AllTemps[2])
                    {
                        temperature = AllTemps[3];
                    }
                }
            }
        }

        public override int temperature
        {
            get
            {
                return _temperature;
            }
            protected set
            {
                if (modeLvl == 0)
                {
                    if (value >= AllTemps[0] && value <= AllTemps[1])
                    {
                        _temperature = value;
                    }
                }
                else if (modeLvl == 2)
                {
                    if (value >= AllTemps[2] && value <= AllTemps[3])
                    {
                        _temperature = value;
                    }
                }
                else
                {
                    if (value >= AllTemps[0] && value <= AllTemps[3])
                    {
                        _temperature = value;
                    }
                }
            }
        }

        /// <param name="modes">Names of modes, ascend</param>
        /// <param name="TempLimits">4 values: min & max of lowest mode, min & max of biggest mode</param>
        public Termostat(string[] modes = null, int[] TempLimits = null)
        {
            modesMas = modes?.Length > 1 ? modes : new string[] { "охлаждение", "авто", "обогрев" };
            AllTemps = TempLimits?.Length == 4 ? TempLimits : new int[] { 16, 25, 26, 30 };
            _modeLvl = 1;
            _temperature = 23;
        }

        private Termostat() { }

        public override void ChangeMode(bool UpDown) => modeLvl += UpDown ? 1 : -1;

        public override string CurrentMode() => modesMas[modeLvl];

        public override (string first, string last) FirstLastModes() => (modesMas[0], modesMas[modesMas.Length - 1]);

        public override void ChangeTemperature(bool UpDown) => temperature += UpDown ? 1 : -1;

        public override void MinTemperature() => _temperature = modeLvl == 2 ? AllTemps[2] : AllTemps[0];

        public override void MaxTemperature() => _temperature = modeLvl == 0 ? AllTemps[1] : AllTemps[3];
    }
}