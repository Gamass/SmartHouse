using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MVC.SmartHouse.Models
{
    public abstract class ACapacitySpace : ICapacitySpace
    {
        public int Id { get; set; }

        [Required]
        public virtual int SpaceLimit { get; protected set; }

        [Required]
        public virtual List<RefItem> SpaceElements { get; protected set; }

        protected ACapacitySpace() { }

        public abstract int FreeSpace();

        public abstract bool Put(RefItem item);

        public abstract bool Take(int num, int volume);

    }
}