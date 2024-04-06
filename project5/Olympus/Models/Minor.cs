using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class minor
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public decimal catalog_year { get; set; }

    public virtual catalog catalog_yearNavigation { get; set; } = null!;

    public virtual ICollection<minorcourse> minorcourses { get; set; } = new List<minorcourse>();

    public virtual ICollection<plan> plans { get; set; } = new List<plan>();
}
