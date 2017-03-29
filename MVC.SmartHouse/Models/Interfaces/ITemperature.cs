using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVC.SmartHouse.Models
{
    public interface ITemperature : IEntity
    {
        int[] AllTemps { get; }

        int temperature { get; }

        void ChangeTemperature(bool UpDown);

        void MinTemperature();

        void MaxTemperature();
    }
}