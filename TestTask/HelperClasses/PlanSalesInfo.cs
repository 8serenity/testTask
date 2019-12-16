using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestTask.HelperClasses {
    public class PlanSalesInfo {
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public int GroupId { get; set; }
        [Required]
        public int PeriodId { get; set; }
    }
}
