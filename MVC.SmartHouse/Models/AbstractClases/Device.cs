using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization.Formatters.Binary;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public abstract class Device: IEntity
    {
        public int Id { get; set; }

        [Required]
        public bool OnOff { get; set; }

        [NotMapped]
        public string PwrState
        {
            get
            {
                return OnOff ? "вкл" : "выкл";
            }
        }

        public string Name { get; private set; }

        public Device(string Name)
        {
            this.Name = Name;
            this.OnOff = false;
        }

        protected Device() { }

        public virtual void Power()
        {
            OnOff = OnOff ? false : true;
        }
    }
}