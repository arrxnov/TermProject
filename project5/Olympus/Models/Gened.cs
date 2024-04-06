using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class gened
{
    public decimal catalog_year { get; set; }

    public string course_id { get; set; } = null!;

    public string type { get; set; } = null!;

    public virtual catalog catalog_yearNavigation { get; set; } = null!;

    public virtual course course { get; set; } = null!;
}
