using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVC.SmartHouse.Models
{
    public interface ICapacitySpace : IEntity
    {
        int SpaceLimit { get; }

        int FreeSpace();

        List<RefItem> SpaceElements { get; }

        bool Put(RefItem item);

        bool Take(int num, int volume);
    }
}