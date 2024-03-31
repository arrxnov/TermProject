using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CourseId), nameof(ConcentrationId))]
public partial class Concentrationcourse
{
    public int ConcentrationId { get; set; }

    public string CourseId { get; set; } = null!;

    public string Type { get; set; } = null!;
}
