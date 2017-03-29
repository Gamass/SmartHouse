using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace MVC.SmartHouse.Models
{
    public enum _4lvlBright
    {
        низкий,
        средний,
        высокий,
        максимальный
    }

    public enum _3lvlTermo
    {
        охлаждение,
        авто,
        обогрев
    }

    public enum _3lvlRef
    {
        экономный,
        авто,
        интенсивный
    }

    public enum _4lvlMic
    {
        разморозка,
        низкий,
        средний,
        макс
    }

    public interface IModes : IEntity
    {
        int modeLvl { get; }

        void ChangeMode(bool UpDown);

        string CurrentMode();

        (string first, string last) FirstLastModes();
    }

    //interface INotEnum
    //{
    //    string[] value { get; }
    //}

    //public class NotEnum: INotEnum
    //{
    //    public string[] value { get; private set; }
    //    public NotEnum()
    //    {
    //        value = new string[] { "низкий", "средний", "высокий", "максимальный" };
    //    }
    //}
}