using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class AVolume: IVolume
    {
        public int Id { get; set; }

        public virtual int volume { get; protected set; }

        public virtual bool mute { get; protected set; }

        protected AVolume() { }

        public abstract void ChangeVolume(bool UpDown);

        public abstract void MuteVolume();
    }
}