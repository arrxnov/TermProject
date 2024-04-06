using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class major
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public decimal catalog_year { get; set; }

    public virtual catalog catalog_yearNavigation { get; set; } = null!;

    public virtual ICollection<concentration> concentrations { get; set; } = new List<concentration>();

    public virtual ICollection<majorcourse> majorcourses { get; set; } = new List<majorcourse>();

    public virtual ICollection<plan> plans { get; set; } = new List<plan>();
}
