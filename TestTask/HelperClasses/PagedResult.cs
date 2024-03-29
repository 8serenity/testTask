﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestTask.HelperClasses {
    public class PagedResult<T> {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int PageCount { get; private set; }

        public long TotalRecordCount { get; set; }

        public PagedResult(IEnumerable<T> items, int pageNumber, int pageSize, long totalRecordCount) {
            Items = new List<T>(items);

            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalRecordCount = totalRecordCount;

            PageCount = totalRecordCount > 0
                        ? (int)Math.Ceiling(totalRecordCount / (double)PageSize)
                        : 0;
        }

        public List<T> Items { get; set; }
    }
}
