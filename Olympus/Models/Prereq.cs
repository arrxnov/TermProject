using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CourseId), nameof(PrereqId))]
public partial class Prereq
{
    public string CourseId { get; set; } = null!;

    public string PrereqId { get; set; } = null!;
}
