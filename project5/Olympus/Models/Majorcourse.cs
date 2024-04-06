using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class majorcourse
{
    public int major_id { get; set; }

    public string course_id { get; set; } = null!;

    public string type { get; set; } = null!;

    public virtual course course { get; set; } = null!;

    public virtual major major { get; set; } = null!;
}
