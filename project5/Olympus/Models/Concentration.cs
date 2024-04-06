using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class concentration
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public int major_id { get; set; }

    public virtual ICollection<concentrationcourse> concentrationcourses { get; set; } = new List<concentrationcourse>();

    public virtual major major { get; set; } = null!;

    public virtual ICollection<plan> plans { get; set; } = new List<plan>();
}
