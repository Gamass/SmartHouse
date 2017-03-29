using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC.SmartHouse.Models
{
    public class RefItem
    {
        public RefItem() { }
        public int Id { get; set; }
        public int Value { get; set; }
        public string Name { get; set; }

        [Required, ForeignKey("CapacitySpaceID")]
        public ACapacitySpace CapacitySpace { get; set;}

        [Required]
        public int CapacitySpaceID { get; set; }
    }
}