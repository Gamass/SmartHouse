using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

namespace MVC.SmartHouse.Models
{
    public interface IFile<T>
    {
        T Read();

        void Save(T obj);

        bool Exists();
    }
}