using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class plannedcourse
{
    public int plan_id { get; set; }

    public string course_id { get; set; } = null!;

    public decimal year { get; set; }

    public string term { get; set; } = null!;

    public virtual course course { get; set; } = null!;

    public virtual plan plan { get; set; } = null!;
}
