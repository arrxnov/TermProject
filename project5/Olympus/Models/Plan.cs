using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class plan
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public string user_id { get; set; } = null!;

    public decimal catalog_year { get; set; }

    public virtual catalog catalog_yearNavigation { get; set; } = null!;

    public virtual ICollection<plannedcourse> plannedcourses { get; set; } = new List<plannedcourse>();

    public virtual user user { get; set; } = null!;

    public virtual ICollection<concentration> concentrations { get; set; } = new List<concentration>();

    public virtual ICollection<major> majors { get; set; } = new List<major>();

    public virtual ICollection<minor> minors { get; set; } = new List<minor>();
}
