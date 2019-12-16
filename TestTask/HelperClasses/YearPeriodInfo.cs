using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTask.HelperClasses {
    public class YearPeriodInfo {
        public short Year { get; set; }

        public List<PeriodInfo> Periods { get; set; }

        public YearPeriodInfo() {
            Periods = new List<PeriodInfo>();
        }

    }
}
