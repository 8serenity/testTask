using System;
using System.Collections.Generic;

namespace TestTask.Models
{
    public partial class Clients
    {
        public Clients()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }
        public string Title { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
