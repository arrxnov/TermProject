using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CourseId), nameof(MinorId))]
public partial class Minorcourse
{
    public int MinorId { get; set; }

    public string CourseId { get; set; } = null!;

    public string Type { get; set; } = null!;
}
