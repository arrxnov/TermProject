using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CourseId), nameof(CatalogYear))]
public partial class Gened
{
    public decimal CatalogYear { get; set; }

    public string CourseId { get; set; } = null!;

    public string Type { get; set; } = null!;
}
