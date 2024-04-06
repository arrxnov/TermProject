using System;
using System.Collections.Generic;

namespace Olympus.Models;

public partial class course
{
    public string id { get; set; } = null!;

    public string name { get; set; } = null!;

    public string credits { get; set; } = null!;

    public string description { get; set; } = null!;

    public virtual ICollection<concentrationcourse> concentrationcourses { get; set; } = new List<concentrationcourse>();

    public virtual ICollection<gened> geneds { get; set; } = new List<gened>();

    public virtual ICollection<majorcourse> majorcourses { get; set; } = new List<majorcourse>();

    public virtual ICollection<minorcourse> minorcourses { get; set; } = new List<minorcourse>();

    public virtual ICollection<plannedcourse> plannedcourses { get; set; } = new List<plannedcourse>();

    public virtual ICollection<catalog> catalog_years { get; set; } = new List<catalog>();

    public virtual ICollection<course> courses { get; set; } = new List<course>();

    public virtual ICollection<course> prereqs { get; set; } = new List<course>();
}
