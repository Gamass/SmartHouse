using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class ATermostat: ITermostat
    {
        public int Id { get; set; }

        [Required]
        public string _modesMas { get; protected set; }

        [NotMapped]
        public string[] modesMas
        {
            get
            {
                return _modesMas.Split('|');
            }
            protected set
            {
                _modesMas = String.Join(@"|", value);
            }
        }

        [NotMapped]
        public virtual int modeLvl { get; protected set; }

        [Required]
        public string _AllTemps { get; protected set; }

        [NotMapped]
        public int[] AllTemps
        {
            get
            {
                return (from i in _AllTemps.Split('|')
                        select Convert.ToInt32(i)).ToArray();
            }
            protected set
            {
                _AllTemps = String.Join(@"|", value);
            }
        }

        [NotMapped]
        public virtual int temperature { get; protected set; }

        protected ATermostat() { }

        public abstract void ChangeMode(bool UpDown);

        public abstract string CurrentMode();

        public abstract (string first, string last) FirstLastModes();

        public abstract void ChangeTemperature(bool UpDown);

        public abstract void MinTemperature();

        public abstract void MaxTemperature();
    }
}