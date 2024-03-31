using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(MajorId), nameof(PlanId))]
public partial class Plannedmajor
{
    public int MajorId { get; set; }

    public int PlanId { get; set; }
}
