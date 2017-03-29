using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;


namespace MVC.SmartHouse.Models.InterfaceClases
{
    public class OptionFile<T> : IFile<T>
    {
        private string fullPath;
        public OptionFile(string fullPath)
        {
            this.fullPath = fullPath;
        }
        public bool Exists()
        {
            FileInfo FI = new FileInfo(fullPath);
            if (FI.Exists)
            {
                return true;
            }
            else
            {
                using (new FileStream(fullPath, FileMode.OpenOrCreate))
                    return false;
            }
        }
        public T Read()
        {
            using (StreamReader SR = new StreamReader(fullPath))
            {
                return (T)(object)SR.ReadToEnd();
            }
        }
        public void Save(T saveObj)
        {
            using (StreamWriter SW = new StreamWriter(fullPath, false))
            {
                SW.Write((T)saveObj);
            }
        }
    }
}