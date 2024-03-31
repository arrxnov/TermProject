using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CatalogYear), nameof(CourseId))]
public partial class Catalogcourse
{
    public decimal CatalogYear { get; set; }

    public string CourseId { get; set; } = null!;
}
 