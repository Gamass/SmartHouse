namespace MVC.SmartHouse.Models
{
    public interface ITimer : IEntity
    {
        int time { get; set; }

        bool inWork { get; }

        int restTime { get; set; }

        void Start();

        void Stop();

        void Reset();
    }
}