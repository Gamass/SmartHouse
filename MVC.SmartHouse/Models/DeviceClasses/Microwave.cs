using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class Microwave : Device, IModes, ITimer
    {
        public AMode PowerMode { get; set; }

        public ATimer Timer { get; set; }

        [NotMapped]
        public int modeLvl => PowerMode.modeLvl;

        [NotMapped]
        public int time
        {
            get
            {
                return Timer.time;
            }
            set
            {
                Timer.time = value;
            }
        }

        [NotMapped]
        public bool inWork => Timer.inWork;

        [NotMapped]
        public int restTime
        {
            get
            {
                return Timer.restTime;
            }
            set
            {
                Timer.restTime = value;
            }
        }

        public Microwave (string Name, AMode PowerMode, ATimer Timer) : base(Name)
        {
            this.PowerMode = PowerMode;
            this.Timer = Timer;
        }

        private Microwave() { }

        public void ChangeMode(bool UpDown) => PowerMode.ChangeMode(UpDown);

        public string CurrentMode() => PowerMode.CurrentMode();

        public (string first, string last) FirstLastModes() => PowerMode.FirstLastModes();

        public void Start() => Timer.Start();

        public void Stop() => Timer.Stop();

        public void Reset() => Timer.Reset();
    }
}