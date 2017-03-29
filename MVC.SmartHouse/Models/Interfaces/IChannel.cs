using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVC.SmartHouse.Models
{
    public interface IChannel : IEntity
    {
        int channel { get; }

        int lastChannel { get; }

        void ChangeChannel(bool UpDown);

        void WriteChannel(int ChannelNum);

        void BackToLastChannel();
    }
}