using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class RefrigeratorSpace : ACapacitySpace
    {
        public RefrigeratorSpace(int SpaceLimit)
        {
            this.SpaceLimit = SpaceLimit;
            SpaceElements = new List<RefItem>();
            Put(new RefItem { Name = "Бананы", Value = 5 });
        }

        private RefrigeratorSpace() { }

        public override bool Put(RefItem item)
        {
            if (item.Value <= FreeSpace() && item.Value > 0)
            {
                //item.CapacitySpace = this;
                item.CapacitySpaceID = Id;
                SpaceElements.Add(item);
                return true;
            }
            else return false;
        }

        public override bool Take(int num, int volume)
        {
            if (num >= 0 && num < SpaceElements.Count && volume >= 0 && volume <= FreeSpace() + SpaceElements[num].Value)
            {
                if (volume == 0)
                {
                    SpaceElements.RemoveAt(num);
                }
                else
                {
                    SpaceElements[num].Value = volume;
                }
                return true;
            }
            else return false;
        }

        public override int FreeSpace()
        {
            if (SpaceElements.Count > 0)
            {
                int SpaceTotal = 0;
                foreach (var val in SpaceElements)
                    SpaceTotal += val.Value;
                return SpaceLimit - SpaceTotal;

            }
            else
                return SpaceLimit;
        }
    }
}