using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class ATemperature : ITemperature
    {
        public int Id { get; set; }

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

        protected ATemperature() { }

        public abstract void ChangeTemperature(bool UpDown);

        public abstract void MinTemperature();

        public abstract void MaxTemperature();
    }
}