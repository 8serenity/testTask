using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestTask.HelperClasses {
    public class SaleProductInfo {
        [Required]
        public int Id { get; set; }
        [Required]
        public int Count { get; set; }
        [Required]
        public decimal Price { get; set; }
    }
}
