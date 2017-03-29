using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class TV : Device, IModes, IVolume, IChannel
    {
        public AMode PowerMode { get; private set; }

        public AVolume Volume { get; private set; }

        public AChannel Channel { get; private set; }

        public TV (string Name, AMode PowerMode, AVolume Volume, AChannel Channel) : base(Name)
        {
            this.PowerMode = PowerMode;
            this.Volume = Volume;
            this.Channel = Channel;
        }

        private TV() { }

        [NotMapped]
        public int modeLvl => PowerMode.modeLvl;

        [NotMapped]
        public int volume => Volume.volume;

        [NotMapped]
        public bool mute => Volume.mute;

        [NotMapped]
        public int channel => Channel.channel;

        [NotMapped]
        public int lastChannel => Channel.lastChannel;

        public void ChangeMode(bool UpDown) => PowerMode.ChangeMode(UpDown);

        public string CurrentMode() => PowerMode.CurrentMode();

        public (string first, string last) FirstLastModes() => PowerMode.FirstLastModes();

        public void ChangeVolume(bool UpDown) => Volume.ChangeVolume(UpDown);

        public void MuteVolume() => Volume.MuteVolume();

        public void ChangeChannel(bool UpDown) => Channel.ChangeChannel(UpDown);

        public void WriteChannel(int ChannelNum) => Channel.WriteChannel(ChannelNum);

        public void BackToLastChannel() => Channel.BackToLastChannel();
    }
}