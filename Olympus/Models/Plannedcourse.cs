using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(PlanId), nameof(CourseId), nameof(Year), nameof(Term))]
public partial class Plannedcourse
{
    public int PlanId { get; set; }

    public string CourseId { get; set; } = null!;

    public decimal Year { get; set; }

    public string Term { get; set; } = null!;
}
