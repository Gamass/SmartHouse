using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class ATimer
    {
        public int Id { get; set; }

        public virtual int time { get; set; }

        public virtual bool inWork { get; protected set; }

        public virtual int restTime { get; set; }

        protected ATimer() { }

        public abstract void Start();

        public abstract void Stop();

        public abstract void Reset();

    }
}