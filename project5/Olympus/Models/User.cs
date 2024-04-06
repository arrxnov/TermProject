using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class user
{
    public string id { get; set; } = null!;

    public string name { get; set; } = null!;

    public decimal gpa { get; set; }

    public decimal major_gpa { get; set; }

    public int default_plan_id { get; set; }

    public virtual aspnetuser idNavigation { get; set; } = null!;

    public virtual ICollection<plan> plans { get; set; } = new List<plan>();
}
