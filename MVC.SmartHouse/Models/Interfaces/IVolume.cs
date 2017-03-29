using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVC.SmartHouse.Models
{
    public interface IVolume : IEntity
    {
        int volume { get; }

        bool mute { get; }

        void ChangeVolume(bool UpDown);

        void MuteVolume();
    }
}