using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class ProdGroups
    {
        public ProdGroups()
        {
            PlanSales = new HashSet<PlanSales>();
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string Title { get; set; }

        public virtual ICollection<PlanSales> PlanSales { get; set; }
        public virtual ICollection<Products> Products { get; set; }
    }
}
