using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class Sales
    {
        public Sales()
        {
            SaleProducts = new HashSet<SaleProducts>();
        }

        public int Id { get; set; }
        public DateTime SaleDate { get; set; }
        public int ClientId { get; set; }

        public virtual Clients Client { get; set; }
        public virtual ICollection<SaleProducts> SaleProducts { get; set; }
    }
}
