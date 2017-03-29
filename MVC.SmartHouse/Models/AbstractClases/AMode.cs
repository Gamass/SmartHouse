using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class AMode : IModes
    {
        public int Id { get; set; }

        [Required]
        public string modes { get; protected set; }

        [NotMapped]
        public string[] modesMas
        {
            get
            {
                return modes.Split('|');
            }
            protected set
            {
                modes = String.Join(@"|", value);
            }
        }

        public virtual int modeLvl { get; protected set; }

        protected AMode() { }

        public abstract void ChangeMode(bool UpDown);

        public abstract string CurrentMode();

        public abstract (string first, string last) FirstLastModes();
    }
}