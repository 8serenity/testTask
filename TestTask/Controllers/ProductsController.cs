using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TestTask.HelperClasses;
using TestTask.Models;

namespace TestTask.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class ProductsController : ControllerBase {

        private readonly IEIT_TestDBContext context;

        public ProductsController(IEIT_TestDBContext context) {
            this.context = context;
        }

        [HttpGet]
        public IActionResult Get(int pageNumber = 1, int pageSize = 50) {
            // Determine the number of records to skip
            int skip = (pageNumber - 1) * pageSize;

            // Get the total number of records
            int totalItemCount = context.Products.Where(p => !p.IsDeleted).Count();

            // Retrieve the data for the specified page
            var products = context.Products
                .OrderBy(c => c.Title)
                .Where(p => !p.IsDeleted)
                .Skip(skip)
                .Take(pageSize)
                .Select(p => new { p.Id, p.Title, Group = p.Group.Title, GroupId = p.Group.Id })
                .ToList();

            // Return the paged results
            return Ok(new PagedResult<object>(products, pageNumber, pageSize, totalItemCount));
        }

        [HttpGet]
        public IActionResult GetAll() {
            var products = context.Products
                .OrderBy(c => c.Title)
                .Where(p => !p.IsDeleted)
                .Select(p => new { p.Id, p.Title, Group = p.Group.Title, GroupId = p.Group.Id })
                .ToList();

            return Ok(products);
        }

        [HttpGet]
        public IActionResult GetProduct(int id) {
            var product = context.Products
                .Where(p => !p.IsDeleted)
                .Select(p => new { p.Id, p.Title, GroupId = p.Group.Id })
                .FirstOrDefault(p => p.Id == id);
            return Ok(product);
        }

        [HttpPost]
        public IActionResult Create(Products product) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState.Keys);
            }
            context.Products.Add(product);
            context.SaveChanges();
            return Ok(product.Id);
        }

        [HttpPut]
        public IActionResult Edit(Products productToEdit) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState.Keys);
            }
            if (!context.Products.Where(p => p.Id == productToEdit.Id && !p.IsDeleted).Any()) {
                return BadRequest("No such product");
            }
            context.Products.Update(productToEdit);
            context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        public IActionResult Delete(int id) {
            var productToDelete = context.Products.Where(p => p.Id == id && !p.IsDeleted).FirstOrDefault();
            if (productToDelete == null) {
                return BadRequest("No such product");
            }
            productToDelete.IsDeleted = true;
            context.Products.Update(productToDelete);
            context.SaveChanges();
            return Ok();
        }

        [HttpGet]
        public IActionResult GetGroups() {
            return Ok(context.ProdGroups.Select(gr => new { gr.Id, gr.Title }));
        }
    }
}