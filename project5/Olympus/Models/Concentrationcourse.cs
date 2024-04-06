using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class concentrationcourse
{
    public int concentration_id { get; set; }

    public string course_id { get; set; } = null!;

    public string type { get; set; } = null!;

    public virtual concentration concentration { get; set; } = null!;

    public virtual course course { get; set; } = null!;
}
