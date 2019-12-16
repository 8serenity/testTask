using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class PlanPeriods
    {
        public PlanPeriods()
        {
            PlanSales = new HashSet<PlanSales>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public short PlanYear { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public virtual ICollection<PlanSales> PlanSales { get; set; }
    }
}
