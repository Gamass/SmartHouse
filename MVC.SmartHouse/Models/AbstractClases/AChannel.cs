using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class AChannel: IChannel
    {
        public int Id { get; set; }

        public virtual int channel { get; protected set; }

        public virtual int lastChannel { get; protected set; }

        protected AChannel() { }

        public abstract void ChangeChannel(bool UpDown);

        public abstract void WriteChannel(int ChannelNum);

        public abstract void BackToLastChannel();

    }
}