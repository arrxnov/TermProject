using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(AdvisorId), nameof(AdviseeId))]
public partial class Advisee
{
    public string AdvisorId { get; set; } = null!;

    public string AdviseeId { get; set; } = null!;
}
