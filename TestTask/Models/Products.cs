using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestTask.Models
{
    public partial class Products
    {
        public Products()
        {
            SaleProducts = new HashSet<SaleProducts>();
        }

        [Required]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public int GroupId { get; set; }
        public decimal? DefaultPrice { get; set; }
        public bool IsDeleted { get; set; }

        public virtual ProdGroups Group { get; set; }
        public virtual ICollection<SaleProducts> SaleProducts { get; set; }
    }
}
