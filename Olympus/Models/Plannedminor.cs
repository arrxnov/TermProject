using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(MinorId), nameof(PlanId))]
public partial class Plannedminor
{
    public int MinorId { get; set; }

    public int PlanId { get; set; }
}
