using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class minorcourse
{
    public int minor_id { get; set; }

    public string course_id { get; set; } = null!;

    public string type { get; set; } = null!;

    public virtual course course { get; set; } = null!;

    public virtual minor minor { get; set; } = null!;
}
