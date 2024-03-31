using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace Olympus.Models;

[PrimaryKey(nameof(CourseId), nameof(MajorId))]
public partial class Majorcourse
{
    public int MajorId { get; set; }

    public string CourseId { get; set; } = null!;

    public string Type { get; set; } = null!;
}
