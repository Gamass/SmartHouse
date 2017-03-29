using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization.Formatters.Binary;

namespace MVC.SmartHouse.Models
{
    //internal class Devices
    //{
    //    private int index;
    //    private Device[] devicesMas;
    //    private string unpossibleKeys = "1234";
    //    private string possibleKeys = "1234567890-=qwertyuiop[]\asdfghjkl;'zxcvbnm,./";
    //    public Devices() { devicesMas = new Device[1]; }
    //    public int Length { get { return devicesMas.Length; } }
    //    public Device this[int index]
    //    {
    //        get
    //        {
    //            this.index = index;
    //            return devicesMas[index];
    //        }
    //        set
    //        {
    //            if (index == -1 && devicesMas[0] == null)
    //            {
    //                devicesMas[0] = value;
    //            }
    //            else if (index == -1)
    //            {
    //                Array.Resize<Device>(ref devicesMas, devicesMas.Length + 1);
    //                devicesMas[devicesMas.Length - 1] = value;
    //            }
    //            else
    //            {
    //                devicesMas[index] = value;
    //            }
    //        }
    //    }
    //    internal void Delete(int num)
    //    {
    //        if (devicesMas.Length != 1)
    //        {
    //            DelKey(devicesMas[num].Key);
    //            Device[] devicesMas1 = new Device[devicesMas.Length - 1];
    //            for (int i = 0, i1 = 0; i < devicesMas1.Length && i1 < devicesMas.Length; i++, i1++)
    //            {
    //                if (i1 == num) i1++;
    //                devicesMas1[i] = devicesMas[i1];
    //            }
    //            devicesMas = devicesMas1;            
    //        }
    //        else
    //        {
    //            devicesMas = new Device[1];
    //        }
    //    }
    //    internal bool NewKey(char button)
    //    {
    //        if (unpossibleKeys.IndexOf(button) >= 0 || possibleKeys.IndexOf(button) < 0)
    //        {                
    //            return false;
    //        }
    //        else
    //        {
    //            unpossibleKeys += button;
    //            return true;
    //        }
    //    }
    //    private void DelKey(char button)
    //    {
    //        int del = unpossibleKeys.IndexOf(button);
    //        if (del >= 0) unpossibleKeys = unpossibleKeys.Remove(del);
    //    }
    //}
    [Serializable]
    public class Devices
    {
        private int index;
        private List<Device> devicesMas;
        //public string unpossibleKeys = "12345";
        //private string possibleKeys = "1234567890abcdefghijklmopqrstuvwy";

        public int Length
        {
            get
            {
                return devicesMas.Count;
            }
        }

        public Devices() { devicesMas = new List<Device>(); }

        public Device this[int index]
        {
            get
            {
                this.index = index;
                return devicesMas[index];
            }
            set
            {
                if (index == -1)
                {
                    devicesMas.Add(value);
                }
                else
                {
                    devicesMas[index] = value;
                }
            }
        }

        internal void RemoveAt(int num)
        {
            //DelKey(devicesMas[num].Key);
            devicesMas.RemoveAt(num);
        }

        //internal bool NewKey(char button)
        //{
        //    button = char.ToLower(button);
        //    if (unpossibleKeys.IndexOf(button) >= 0 || possibleKeys.IndexOf(button) < 0) return false;
        //    else
        //    {
        //        unpossibleKeys += button;
        //        return true;
        //    }
        //}

        //private void DelKey(char button)
        //{
        //    int delKeyNum = unpossibleKeys.IndexOf(button);
        //    if (delKeyNum >= 0) unpossibleKeys = unpossibleKeys.Remove(delKeyNum, 1);
        //}

        //internal char GetNewKey()
        //{
        //    char key = 'y';
        //    for(int i = 0; i<possibleKeys.Length; i++)
        //    {
        //        if (unpossibleKeys.IndexOf(possibleKeys[i]) < 0)
        //        {
        //            key = possibleKeys[i];
        //            break;
        //        }
        //    }
        //    NewKey(key);
        //    return key;
        //}

        //internal bool UsedKeys(char button)
        //{
        //    if (unpossibleKeys.IndexOf(button) >= 0) return true;
        //    else return false;
        //}
    }
}