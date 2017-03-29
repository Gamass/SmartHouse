using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace MVC.SmartHouse.Models
{

    public class NetTimer : ATimer
    {
        //protected DateTime start;
        //protected DateTime end;

        private int _time = 3;

        [Required]
        public override int time
        {
            get
            {
                return _time;
            }
            set
            {
                if (value > 0 && value < 121)
                {
                    _time = value;
                }
                else _time = 0;
            }
        }

        public NetTimer()
        {
            restTime = _time;
        }

        public override void Start()
        {
            //start = DateTime.Now;
            //inWork = true;
            //restTime = restTime == 0 ? time : restTime;
        }

        public override void Stop()
        {
            //end = DateTime.Now;
            //if (inWork)
            //{
            //    inWork = false;
            //    restTime = restTime - (end - start).Seconds;
            //}
        }

        public override void Reset()
        {
            inWork = false;
            restTime = time;
        }
    }
}