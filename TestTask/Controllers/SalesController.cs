using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestTask.HelperClasses;
using TestTask.Models;

namespace TestTask.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class SalesController : ControllerBase {

        private readonly IEIT_TestDBContext context;

        public SalesController(IEIT_TestDBContext context) {
            this.context = context;
        }

        [HttpGet]
        public IActionResult Get(int pageNumber = 1, int pageSize = 50) {
            // Determine the number of records to skip
            int skip = (pageNumber - 1) * pageSize;

            // Get the total number of records
            int totalItemCount = context.Sales.Count();

            // Retrieve the data for the specified page
            var sales = context.Sales
                .OrderBy(c => c.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(p => new { p.Id, p.SaleDate, Client = p.Client.Title, ClientId = p.Client.Id, Sum = p.SaleProducts.Sum(p => p.ProdAmount) })
                .ToList();


            // Return the paged results
            return Ok(new PagedResult<object>(sales, pageNumber, pageSize, totalItemCount));
        }

        [HttpGet]
        public IActionResult GetClientSales(int clientId, int pageNumber = 1, int pageSize = 50) {
            // Determine the number of records to skip
            int skip = (pageNumber - 1) * pageSize;

            // Get the total number of records
            int totalItemCount = context.Sales.Where(c => c.ClientId == clientId).Count();

            // Retrieve the data for the specified page
            var sales = context.Sales
                .OrderBy(c => c.Id)
                .Where(c => c.ClientId == clientId)
                .Skip(skip)
                .Take(pageSize)
                .Select(p => new { p.Id, p.SaleDate, Client = p.Client.Title, ClientId = p.Client.Id, Sum = p.SaleProducts.Sum(p => p.ProdAmount) })
                .ToList();


            // Return the paged results
            return Ok(new PagedResult<object>(sales, pageNumber, pageSize, totalItemCount));
        }

        [HttpPost]
        public IActionResult Create(SaleToCreateInfo sale) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState.Keys);
            }
            if (sale.Products.GroupBy(p => p.Id).Where(p => p.Count() > 1).Any()) {
                return BadRequest("Duplicate products");
            }

            var saleToAdd = new Sales {
                ClientId = sale.ClientId,
                SaleDate = sale.Date,
                SaleProducts = sale.Products.Select(p => new SaleProducts { ProductId = p.Id, ProdCount = p.Count, ProdPrice = p.Price }).ToList()
            };

            context.Sales.Add(saleToAdd);
            context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        public IActionResult Edit(SaleToCreateInfo sale) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState.Keys);
            }

            var saleToEdit = context.Sales.Where(s => s.Id == sale.Id).FirstOrDefault();

            if (saleToEdit == null) {
                return BadRequest("No such sale");
            }

            if (sale.Products.GroupBy(p => p.Id).Where(p => p.Count() > 1).Any()) {
                return BadRequest("Duplicate products");
            }

            var productsInSale = context.SaleProducts.Where(sp => sp.SaleId == sale.Id);
            foreach (var product in productsInSale) {
                context.SaleProducts.Remove(product);
            }

            saleToEdit.ClientId = sale.ClientId;
            saleToEdit.SaleDate = sale.Date.ToUniversalTime();
            saleToEdit.SaleProducts = sale.Products.Select(p => new SaleProducts { ProductId = p.Id, ProdCount = p.Count, ProdPrice = p.Price }).ToList();

            context.Sales.Update(saleToEdit);
            context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        public IActionResult Delete(int id) {
            var saleToDelete = context.Sales.Where(s => s.Id == id).FirstOrDefault();
            if (saleToDelete == null) {
                return BadRequest("No such sale");
            }
            context.Sales.Remove(saleToDelete);
            context.SaveChanges();
            return Ok();
        }

        [HttpGet]
        public IActionResult GetSaleProducts(int saleId) {
            var products = context.SaleProducts.Where(sp => sp.SaleId == saleId && !sp.Product.IsDeleted).Select(sp => new { sp.ProductId, sp.ProdCount, sp.ProdPrice }).ToList();
            return Ok(products);
        }

        [HttpGet]
        public IActionResult GetClients() {
            return Ok(context.Clients.Select(c => new { c.Id, c.Title }));
        }
    }
}