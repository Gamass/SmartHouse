using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Modeslvl : AMode
    {
        private int _modeLvl;

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
                }
            }
        }

        /// <param name="modes">Names of modes, ascend</param>
        public Modeslvl(string[] modes)
        {
            modesMas = modes;
            _modeLvl = 1;
        }

        private Modeslvl() { }

        public override void ChangeMode(bool UpDown) => modeLvl += UpDown ? 1 : -1;

        public override string CurrentMode() => modesMas[modeLvl];

        public override (string first, string last) FirstLastModes() => (modesMas[0], modesMas[modesMas.Length - 1]);
    }

}