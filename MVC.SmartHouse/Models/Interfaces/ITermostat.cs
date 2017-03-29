using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVC.SmartHouse.Models
{
    public interface ITermostat: ITemperature, IModes { }
}
