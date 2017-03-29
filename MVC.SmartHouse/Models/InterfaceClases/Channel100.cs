using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Channel100 : AChannel
    {
        private int _channel = 0;
        private int maxChannel = 100;

        public override int channel
        {
            get
            {
                return _channel;
            }
            protected set
            {
                lastChannel = _channel;
                if (value >= 0 && value < maxChannel) _channel = value;
            }
        }

        /// <param name="maxChannel"> More then 0, 100 or 1000</param>
        public Channel100(int maxChannel = 0)
        {
            this.maxChannel = maxChannel > 0 ? maxChannel : this.maxChannel;
        }
        public Channel100() { }

        public override void ChangeChannel(bool UpDown) => channel += UpDown ? 1 : -1;

        public override void WriteChannel(int channel) => this.channel = channel;

        public override void BackToLastChannel()
        {
            int temp = channel;
            channel = lastChannel;
            lastChannel = temp;
        }
    }
}