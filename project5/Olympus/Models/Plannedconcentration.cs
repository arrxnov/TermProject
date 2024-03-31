using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(ConcentrationId), nameof(PlanId))]
public partial class Plannedconcentration
{
    public int ConcentrationId { get; set; }

    public int PlanId { get; set; }
}
