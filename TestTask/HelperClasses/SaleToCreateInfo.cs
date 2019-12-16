using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestTask.HelperClasses {
    public class SaleToCreateInfo {
        public int Id { get; set; }
        [Required]
        public int ClientId { get; set; }
        [Required]
        [JsonProperty]
        public DateTime Date { get; set; }
        [Required]
        public List<SaleProductInfo> Products { get; set; }

    }
}
