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
    public class PlanController : ControllerBase {

        private readonly IEIT_TestDBContext context;

        public PlanController(IEIT_TestDBContext context) {
            this.context = context;
        }

        [HttpGet]
        public IActionResult GetPlans() {
            return Ok(context.PlanSales
                .Select(p => new { p.ProdGroupId, p.PeriodId, p.PlanAmount })
                .ToList());
        }


        [HttpGet]
        public IActionResult GetPeriods() {
            return Ok(context.PlanPeriods
                .Select(p => new { p.Id, p.Title, p.PlanYear })
                .ToList());
        }

        [HttpPost]
        public IActionResult UploadPlanSales(PlanSalesInfo[] plans) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState.Keys);
            }

            foreach (var plan in plans) {
                var planInDb = context.PlanSales.FirstOrDefault(p => p.ProdGroupId == plan.GroupId && p.PeriodId == plan.PeriodId);
                if (planInDb != null) {
                    planInDb.PlanAmount = plan.Amount;
                    context.PlanSales.Update(planInDb);
                }
                else {
                    var planToAdd = new PlanSales { ProdGroupId = plan.GroupId, PeriodId = plan.PeriodId, PlanAmount = plan.Amount };
                    context.PlanSales.Add(planToAdd);
                }
            }

            this.context.SaveChanges();
            return Ok();
        }
    }
}