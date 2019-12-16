using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class SaleProducts
    {
        public int SaleId { get; set; }
        public int ProductId { get; set; }
        public int ProdCount { get; set; }
        public decimal ProdPrice { get; set; }
        public decimal? ProdAmount { get; set; }

        public virtual Products Product { get; set; }
        public virtual Sales Sale { get; set; }
    }
}
