using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class PlanSales
    {
        public int PeriodId { get; set; }
        public int ProdGroupId { get; set; }
        public decimal? PlanAmount { get; set; }

        public virtual PlanPeriods Period { get; set; }
        public virtual ProdGroups ProdGroup { get; set; }
    }
}
