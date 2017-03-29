using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Volume100 : AVolume
    {

        private int _volume = 10;

        [Required]
        public override int volume
        {
            get
            {
                return _volume;
            }
            protected set
            {
                if (value >= 0 && value <= 100)
                    _volume = value;
            }
        }

        public Volume100() { }

        public override void ChangeVolume(bool UpDown)
        {
            mute = false;
            volume += UpDown ? 1 : -1;
        }

        public override void MuteVolume()
        {
            mute = mute ? false : true;
        }
    }
}